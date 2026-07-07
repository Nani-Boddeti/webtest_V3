"""Tests for the ORCA Companion application."""

import sys
import pytest
from pathlib import Path

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QApplication, QMenu
from PySide6.QtGui import QAction

# Ensure src/ is on the path (project root is one level above tests/)
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.app import OrcaApp, _asset_path
from src.system_tray import SystemTray


# ── Fixtures ────────────────────────────────────────────────────────────

@pytest.fixture(scope="session")
def qapp() -> QApplication:
    """Session-scoped QApplication so Qt is initialised once."""
    app = QApplication.instance()
    if app is None:
        app = QApplication(sys.argv)
    return app


@pytest.fixture
def orca_app(qapp: QApplication) -> OrcaApp:
    """Return a fresh OrcaApp instance."""
    window = OrcaApp()
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


# ── OrcaApp tests ───────────────────────────────────────────────────────

class TestOrcaApp:
    """Tests for the main transparent mascot window."""

    def test_window_is_created(self, orca_app: OrcaApp) -> None:
        """Verify the window object is instantiated."""
        assert orca_app is not None
        assert orca_app.isWindow()

    def test_window_flags(self, orca_app: OrcaApp) -> None:
        """Check the required window flags are set."""
        flags = orca_app.windowFlags()
        assert flags & Qt.WindowType.FramelessWindowHint
        assert flags & Qt.WindowType.WindowStaysOnTopHint

    def test_window_translucent(self, orca_app: OrcaApp) -> None:
        """Ensure the translucent background attribute is enabled."""
        assert orca_app.testAttribute(
            Qt.WidgetAttribute.WA_TranslucentBackground
        )

    def test_window_title(self, orca_app: OrcaApp) -> None:
        """Window title should include the app name."""
        assert "ORCA" in orca_app.windowTitle()

    def test_central_widget_has_image_label(self, orca_app: OrcaApp) -> None:
        """The QLabel holding the logo must exist."""
        label = orca_app._image_label
        assert label is not None
        # Should have a pixmap or fallback text set
        has_content = (
            label.pixmap() is not None
            or bool(label.text())
        )
        assert has_content, "Logo label must have either pixmap or placeholder text."

    def test_drag_state_initial(self, orca_app: OrcaApp) -> None:
        """Before any mouse event the internal drag position is None."""
        assert orca_app._drag_pos is None

    def test_toggle_visibility(self, orca_app: OrcaApp) -> None:
        """toggle_visibility changes the visible state."""
        orca_app.show()
        assert orca_app.isVisible()
        orca_app.toggle_visibility()
        assert not orca_app.isVisible()
        orca_app.toggle_visibility()
        assert orca_app.isVisible()

    def test_asset_path_returns_path(self) -> None:
        """_asset_path always returns a Path, even when the file is missing."""
        result = _asset_path("logo.png")
        assert isinstance(result, Path)


# ── SystemTray tests ────────────────────────────────────────────────────

class TestSystemTray:
    """Tests for the system-tray icon and menu."""

    def test_tray_created(self, system_tray: SystemTray) -> None:
        """The SystemTray wrapper should be instantiated."""
        assert system_tray is not None

    def test_tray_icon_exists(self, system_tray: SystemTray) -> None:
        """The underlying QSystemTrayIcon must be set."""
        assert system_tray.tray is not None

    def test_tray_has_menu(self, system_tray: SystemTray) -> None:
        """A context menu must be assigned."""
        menu = system_tray.menu
        assert menu is not None
        assert isinstance(menu, QMenu)

    def test_menu_has_settings_and_exit(self, system_tray: SystemTray) -> None:
        """The context menu must contain Show/Hide, Settings, and Exit actions."""
        actions = system_tray.menu.actions()
        action_texts = [a.text() for a in actions]
        assert "Show / Hide" in action_texts
        assert "Settings" in action_texts
        assert "Exit" in action_texts

    def test_settings_action_triggers_callback(self, system_tray: SystemTray) -> None:
        """Triggering Settings should invoke the on_settings callback."""
        called = []

        tray = SystemTray(on_settings=lambda: called.append(True))

        try:
            settings_action: QAction = next(
                a for a in tray.menu.actions() if a.text() == "Settings"
            )
            settings_action.trigger()
            assert called == [True]
        finally:
            tray.hide()
            tray.deleteLater()

    def test_exit_action_triggers_callback(self, system_tray: SystemTray) -> None:
        """Triggering Exit should invoke the on_exit callback."""
        called = []

        tray = SystemTray(on_exit=lambda: called.append(True))

        try:
            exit_action: QAction = next(
                a for a in tray.menu.actions() if a.text() == "Exit"
            )
            exit_action.trigger()
            assert called == [True]
        finally:
            tray.hide()
            tray.deleteLater()
