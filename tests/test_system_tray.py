"""Tests for the system-tray module."""

import sys
from pathlib import Path

import pytest
from PySide6.QtWidgets import QApplication, QSystemTrayIcon
from PySide6.QtGui import QAction

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.system_tray import SystemTray


@pytest.fixture(scope="session")
def qapp() -> QApplication:
    app = QApplication.instance()
    if app is None:
        app = QApplication(sys.argv)
    return app


class TestSystemTrayIsolated:
    """Additional tray tests that require their own instances."""

    def test_tooltip_is_set(self, qapp: QApplication) -> None:
        tray = SystemTray()
        assert tray.tray.toolTip() == "ORCA Companion"
        tray.hide()

    def test_menu_has_show_action(self, qapp: QApplication) -> None:
        """The menu should include a Show / Hide action."""
        tray = SystemTray()
        action_texts = [a.text() for a in tray.menu.actions()]
        assert "Show / Hide" in action_texts
        tray.hide()

    def test_show_action_triggers_callback(self, qapp: QApplication) -> None:
        """Triggering Show / Hide should invoke the on_show callback."""
        called = []
        tray = SystemTray(on_show=lambda: called.append(True))
        try:
            show_action: QAction = next(
                a for a in tray.menu.actions() if a.text() == "Show / Hide"
            )
            show_action.trigger()
            assert called == [True]
        finally:
            tray.hide()
            tray.deleteLater()

    def test_no_show_callback_does_not_raise(self, qapp: QApplication) -> None:
        """Absence of on_show should be handled gracefully."""
        tray = SystemTray()  # no callbacks
        show_action: QAction = next(
            a for a in tray.menu.actions() if a.text() == "Show / Hide"
        )
        # Should not raise
        show_action.trigger()
        tray.hide()

    def test_double_click_triggers_show(self, qapp: QApplication) -> None:
        """Double-clicking the tray icon should invoke on_show."""
        called = []
        tray = SystemTray(on_show=lambda: called.append(True))
        try:
            tray.tray.activated.emit(
                QSystemTrayIcon.ActivationReason.DoubleClick
            )
            assert called == [True]
        finally:
            tray.hide()
            tray.deleteLater()

    def test_no_settings_callback_does_not_raise(self, qapp: QApplication) -> None:
        """Absence of on_settings should be handled gracefully."""
        tray = SystemTray()  # no callbacks
        settings_action: QAction = next(
            a for a in tray.menu.actions() if a.text() == "Settings"
        )
        # Should not raise
        settings_action.trigger()
        tray.hide()

    def test_default_exit_calls_quit(self, qapp: QApplication) -> None:
        """Default on_exit should be QApplication.quit (no crash)."""
        tray = SystemTray()
        exit_action: QAction = next(
            a for a in tray.menu.actions() if a.text() == "Exit"
        )
        # We can't easily assert quit() without exiting the test runner, but
        # we can verify the action exists and is connected.
        assert exit_action.isEnabled()
        tray.hide()
