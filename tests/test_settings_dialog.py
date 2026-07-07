"""Tests for the SettingsDialog module."""

from __future__ import annotations

import sys
import tempfile
from pathlib import Path
from unittest import mock

import pytest

from PySide6.QtWidgets import QApplication, QDialogButtonBox
from PySide6.QtCore import Qt

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.config import ConfigManager
from src.settings_dialog import SettingsDialog


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
    """Return a ConfigManager pointed at a temporary, empty config file."""
    with tempfile.TemporaryDirectory() as tmpdir:
        cfg_file = Path(tmpdir) / "nonexistent" / "config.json"
        with mock.patch("src.config._default_path", return_value=cfg_file):
            yield ConfigManager()


@pytest.fixture
def dialog(qapp: QApplication, config: ConfigManager) -> SettingsDialog:
    """Create a SettingsDialog, yield it, then clean up."""
    dlg = SettingsDialog(config)
    yield dlg
    dlg.close()
    dlg.deleteLater()


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class TestSettingsDialog:
    """Tests for SettingsDialog UI and behaviour."""

    def test_dialog_is_created(self, dialog: SettingsDialog) -> None:
        """The dialog should be a valid QDialog."""
        assert dialog.isWindow()
        assert dialog.isModal()

    def test_dialog_title(self, dialog: SettingsDialog) -> None:
        """The dialog title should include the app name."""
        assert "ORCA" in dialog.windowTitle()

    def test_default_values_match_config(
        self, dialog: SettingsDialog, config: ConfigManager
    ) -> None:
        """On creation, the form should reflect the current config values."""
        assert dialog.interval_spin.value() == config.get("interval", 60)
        assert dialog.theme_combo.currentText() == config.get("theme", "dark")
        assert dialog.speed_spin.value() == config.get("animation_speed", 100)
        assert dialog.scale_spin.value() == config.get("scale", 1.0)
        assert dialog.sound_edit.text() == config.get("notification_sound", "")
        assert dialog.reminders_check.isChecked() is config.get("reminders_enabled", True)
        assert dialog.startup_check.isChecked() is config.get("launch_on_startup", False)

    def test_form_populates_from_config(self, config: ConfigManager, qapp: QApplication) -> None:
        """When config has non-default values, the form reflects them."""
        config.set("interval", 30)
        config.set("theme", "light")
        config.set("animation_speed", 500)
        config.set("scale", 2.0)
        config.set("notification_sound", "/tmp/test.wav")
        config.set("reminders_enabled", False)
        config.set("launch_on_startup", True)

        dlg = SettingsDialog(config)
        try:
            assert dlg.interval_spin.value() == 30
            assert dlg.theme_combo.currentText() == "light"
            assert dlg.speed_spin.value() == 500
            assert dlg.scale_spin.value() == 2.0
            assert dlg.sound_edit.text() == "/tmp/test.wav"
            assert dlg.reminders_check.isChecked() is False
            assert dlg.startup_check.isChecked() is True
        finally:
            dlg.close()
            dlg.deleteLater()

    def test_interval_spin_range(self, dialog: SettingsDialog) -> None:
        """Interval spin box allows 1–1440 minutes."""
        assert dialog.interval_spin.minimum() == 1
        assert dialog.interval_spin.maximum() == 1440

    def test_speed_spin_range(self, dialog: SettingsDialog) -> None:
        """Animation speed spin box allows 10–2000 ms."""
        assert dialog.speed_spin.minimum() == 10
        assert dialog.speed_spin.maximum() == 2000

    def test_scale_spin_range(self, dialog: SettingsDialog) -> None:
        """Scale spin box allows 0.25–5.0."""
        assert dialog.scale_spin.minimum() == 0.25
        assert dialog.scale_spin.maximum() == 5.0

    def test_theme_combo_options(self, dialog: SettingsDialog) -> None:
        """Theme combo has 'dark' and 'light'."""
        items = [dialog.theme_combo.itemText(i) for i in range(dialog.theme_combo.count())]
        assert "dark" in items
        assert "light" in items

    def test_accept_saves_to_config(self, dialog: SettingsDialog, config: ConfigManager) -> None:
        """Clicking OK writes form values back to ConfigManager."""
        dialog.interval_spin.setValue(30)
        dialog.theme_combo.setCurrentText("light")
        dialog.speed_spin.setValue(500)
        dialog.scale_spin.setValue(1.5)
        dialog.sound_edit.setText("/tmp/alert.wav")
        dialog.reminders_check.setChecked(False)
        dialog.startup_check.setChecked(True)

        dialog._on_accept()

        assert config.get("interval") == 30
        assert config.get("theme") == "light"
        assert config.get("animation_speed") == 500
        assert config.get("scale") == 1.5
        assert config.get("notification_sound") == "/tmp/alert.wav"
        assert config.get("reminders_enabled") is False
        assert config.get("launch_on_startup") is True

    def test_cancel_does_not_save(self, dialog: SettingsDialog, config: ConfigManager) -> None:
        """Rejecting the dialog should preserve original config values."""
        original_interval = config.get("interval")
        dialog.interval_spin.setValue(999)

        dialog.reject()

        assert config.get("interval") == original_interval


class TestSettingsDialogButtonBox:
    """Tests for the OK/Cancel button box."""

    def test_has_ok_and_cancel(self, dialog: SettingsDialog) -> None:
        """The dialog should have OK and Cancel standard buttons."""
        # Find the button box by searching children
        button_boxes = dialog.findChildren(QDialogButtonBox)
        assert len(button_boxes) > 0
        bb = button_boxes[0]
        assert bb.button(QDialogButtonBox.StandardButton.Ok) is not None
        assert bb.button(QDialogButtonBox.StandardButton.Cancel) is not None
