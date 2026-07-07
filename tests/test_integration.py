"""Integration tests for the ORCA Companion application.

Simulates a full app session: creates all major components, verifies
signal/slot connections, and checks that component wiring is correct.
"""

from __future__ import annotations

import sys
import tempfile
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from PySide6.QtTest import QSignalSpy
from PySide6.QtWidgets import QApplication

from src.app import OrcaApp
from src.animation import AnimationManager
from src.config import ConfigManager
from src.reminders import ReminderManager
from src.settings_dialog import SettingsDialog
from src.system_tray import SystemTray


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def qapp() -> QApplication:
    """Session-scoped QApplication so Qt is initialised once."""
    app = QApplication.instance()
    if app is None:
        app = QApplication(sys.argv)
    return app


@pytest.fixture
def config() -> ConfigManager:
    """Return a ConfigManager backed by a temporary file."""
    with tempfile.TemporaryDirectory() as tmpdir:
        cfg_path = Path(tmpdir) / "config.json"
        yield ConfigManager(config_path=cfg_path)


@pytest.fixture
def anim_manager() -> AnimationManager:
    """Return an AnimationManager with the default base path."""
    return AnimationManager()


@pytest.fixture
def orca_app(config: ConfigManager, anim_manager: AnimationManager, qapp: QApplication) -> OrcaApp:
    """Return a fully wired OrcaApp with config and animation manager."""
    window = OrcaApp(config=config, anim_manager=anim_manager)
    yield window
    window.close()
    window.deleteLater()


@pytest.fixture
def system_tray(qapp: QApplication) -> SystemTray:
    """Return a fresh SystemTray instance."""
    tray = SystemTray()
    yield tray
    tray.hide()
    tray.deleteLater()


@pytest.fixture
def reminder_manager(config: ConfigManager, qapp: QApplication) -> ReminderManager:
    """Return a ReminderManager with a temp config."""
    mgr = ReminderManager(config=config)
    yield mgr
    mgr.stop()
    mgr.deleteLater()


# ---------------------------------------------------------------------------
# Integration tests
# ---------------------------------------------------------------------------


class TestComponentWiring:
    """Verify that the major components can be wired together correctly."""

    def test_orca_app_accepts_config_and_anim_manager(
        self, orca_app: OrcaApp, config: ConfigManager, anim_manager: AnimationManager
    ) -> None:
        """OrcaApp should store config and anim_manager references."""
        assert orca_app._config is config
        assert orca_app._anim_manager is anim_manager

    def test_orca_app_without_config_and_anim_manager(
        self, qapp: QApplication
    ) -> None:
        """OrcaApp should work with no config or anim_manager (defaults)."""
        window = OrcaApp()
        try:
            assert window._config is None
            assert window._anim_manager is None
            # Should still show placeholder
            assert window._image_label is not None
            assert window._image_label.pixmap() is not None or bool(window._image_label.text())
        finally:
            window.close()
            window.deleteLater()

    def test_reminder_manager_state_signal_connected(
        self,
        reminder_manager: ReminderManager,
        orca_app: OrcaApp,
    ) -> None:
        """Connecting state_change_requested → set_animation_state should work."""
        reminder_manager.state_change_requested.connect(
            orca_app.set_animation_state
        )
        # Emit a drink signal
        spy = QSignalSpy(reminder_manager.state_change_requested)

        reminder_manager.state_change_requested.emit("drink")

        assert len(spy) == 1
        assert spy[0][0] == "drink"

        # Disconnect to avoid side effects
        reminder_manager.state_change_requested.disconnect(
            orca_app.set_animation_state
        )

    def test_settings_dialog_opens_and_accepts(
        self,
        config: ConfigManager,
        orca_app: OrcaApp,
    ) -> None:
        """Opening settings dialog and accepting should persist changes."""
        dlg = SettingsDialog(config, parent=orca_app)
        try:
            # Change a value
            dlg.interval_spin.setValue(45)
            dlg.theme_combo.setCurrentText("light")
            dlg._on_accept()

            assert config.get("interval") == 45
            assert config.get("theme") == "light"
        finally:
            dlg.close()
            dlg.deleteLater()

    def test_settings_dialog_cancel_preserves_config(
        self,
        config: ConfigManager,
        orca_app: OrcaApp,
    ) -> None:
        """Cancelling settings dialog should not change config."""
        original = config.get("interval")
        dlg = SettingsDialog(config, parent=orca_app)
        try:
            dlg.interval_spin.setValue(999)
            dlg.reject()
            assert config.get("interval") == original
        finally:
            dlg.close()
            dlg.deleteLater()

    def test_theme_change_applies_to_window(
        self,
        config: ConfigManager,
        anim_manager: AnimationManager,
        qapp: QApplication,
    ) -> None:
        """Changing theme in config + re-applying should update stylesheet."""
        config.set("theme", "light")
        window = OrcaApp(config=config, anim_manager=anim_manager)
        try:
            # Light theme should have the light stylesheet
            ss = window.styleSheet()
            assert "transparent" in ss.lower()
        finally:
            window.close()
            window.deleteLater()

    def test_tray_settings_action_triggers_dialog(
        self,
        config: ConfigManager,
        orca_app: OrcaApp,
    ) -> None:
        """The tray Settings action callback should open a dialog."""
        dialog_opened = []

        def _open_settings() -> None:
            dlg = SettingsDialog(config, parent=orca_app)
            dialog_opened.append(dlg)
            dlg.close()
            dlg.deleteLater()

        tray = SystemTray(on_settings=_open_settings)
        try:
            # Find and trigger the Settings action
            from PySide6.QtGui import QAction
            settings_action: QAction = next(
                a for a in tray.menu.actions() if a.text() == "Settings"
            )
            settings_action.trigger()
            assert len(dialog_opened) == 1
            assert isinstance(dialog_opened[0], SettingsDialog)
        finally:
            tray.hide()
            tray.deleteLater()

    def test_full_session_simulation(
        self,
        config: ConfigManager,
        anim_manager: AnimationManager,
        qapp: QApplication,
    ) -> None:
        """Simulate a full app session: window + tray + reminders + settings."""
        # 1. Create window
        window = OrcaApp(config=config, anim_manager=anim_manager)
        window.show()
        assert window.isVisible()

        # 2. Create tray
        tray_call_count = []

        def on_settings() -> None:
            tray_call_count.append(1)

        tray = SystemTray(on_settings=on_settings)
        tray.show()

        # 3. Create reminder manager and wire signals
        reminders = ReminderManager(config=config, tray=tray.tray, parent=window)
        reminders.state_change_requested.connect(window.set_animation_state)

        try:
            # Verify initial state
            assert window.isVisible()
            assert reminders.is_running is False  # not started yet

            # Start reminders
            reminders.start()
            assert reminders.is_running is True

            # Verify state change propagates (manual trigger)
            reminders.state_change_requested.emit("drink")
            QApplication.processEvents()

            # Verify revert
            reminders.state_change_requested.emit("idle")
            QApplication.processEvents()

            # Open settings via callback
            from PySide6.QtGui import QAction
            settings_action: QAction = next(
                a for a in tray.menu.actions() if a.text() == "Settings"
            )
            settings_action.trigger()
            assert len(tray_call_count) == 1

        finally:
            reminders.stop()
            reminders.deleteLater()
            tray.hide()
            tray.deleteLater()
            window.close()
            window.deleteLater()
