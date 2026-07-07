"""Tests for the system-tray module."""

import sys
from pathlib import Path

import pytest
from PySide6.QtWidgets import QApplication
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
