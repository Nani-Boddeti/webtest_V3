"""Settings dialog for the ORCA Companion.

Provides ``SettingsDialog``, a modal QDialog that lets the user inspect and
edit every configuration key managed by :class:`ConfigManager`.

Changes are written back to the ConfigManager only when the user clicks
*OK*; *Cancel* discards any in-flight edits.
"""

from __future__ import annotations

import logging
from typing import Optional

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QCheckBox,
    QComboBox,
    QDialog,
    QDialogButtonBox,
    QDoubleSpinBox,
    QFileDialog,
    QFormLayout,
    QHBoxLayout,
    QLineEdit,
    QPushButton,
    QSpinBox,
    QVBoxLayout,
    QWidget,
)

from src.config import ConfigManager

logger = logging.getLogger(__name__)


class SettingsDialog(QDialog):
    """Modal dialog for editing application settings."""

    def __init__(
        self,
        config: ConfigManager,
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._config = config

        self.setWindowTitle("ORCA Companion – Settings")
        self.setMinimumWidth(420)
        self.setModal(True)

        self._build_ui()
        self._load_values()

    # ------------------------------------------------------------------
    # UI construction
    # ------------------------------------------------------------------
    def _build_ui(self) -> None:
        """Assemble the form layout and button box."""
        root = QVBoxLayout(self)

        form = QFormLayout()
        form.setLabelAlignment(Qt.AlignmentFlag.AlignRight)
        form.setFieldGrowthPolicy(
            QFormLayout.FieldGrowthPolicy.AllNonFixedFieldsGrow
        )

        # -- Interval (minutes) --
        self._interval_spin = QSpinBox()
        self._interval_spin.setRange(1, 1440)
        self._interval_spin.setSuffix(" min")
        self._interval_spin.setToolTip("Minutes between hydration reminders.")
        form.addRow("Reminder interval:", self._interval_spin)

        # -- Theme --
        self._theme_combo = QComboBox()
        self._theme_combo.addItems(["dark", "light"])
        self._theme_combo.setToolTip("Overall UI theme.")
        form.addRow("Theme:", self._theme_combo)

        # -- Animation speed --
        self._speed_spin = QSpinBox()
        self._speed_spin.setRange(10, 2000)
        self._speed_spin.setSuffix(" ms")
        self._speed_spin.setToolTip("Milliseconds per animation frame.")
        form.addRow("Animation speed:", self._speed_spin)

        # -- Scale --
        self._scale_spin = QDoubleSpinBox()
        self._scale_spin.setRange(0.25, 5.0)
        self._scale_spin.setSingleStep(0.25)
        self._scale_spin.setDecimals(2)
        self._scale_spin.setToolTip("Mascot size multiplier.")
        form.addRow("Scale:", self._scale_spin)

        # -- Notification sound --
        sound_row = QHBoxLayout()
        self._sound_edit = QLineEdit()
        self._sound_edit.setPlaceholderText("System default")
        self._sound_edit.setToolTip("Path to a .wav file for reminder alerts.")
        sound_row.addWidget(self._sound_edit)

        browse_btn = QPushButton("Browse…")
        browse_btn.clicked.connect(self._browse_sound)
        sound_row.addWidget(browse_btn)
        form.addRow("Notification sound:", sound_row)

        # -- Reminders enabled --
        self._reminders_check = QCheckBox("Enable periodic hydration reminders")
        form.addRow("", self._reminders_check)

        # -- Launch on startup --
        self._startup_check = QCheckBox("Launch ORCA Companion when Windows starts")
        form.addRow("", self._startup_check)

        root.addLayout(form)

        # -- Button box --
        buttons = QDialogButtonBox(
            QDialogButtonBox.StandardButton.Ok
            | QDialogButtonBox.StandardButton.Cancel
        )
        buttons.accepted.connect(self._on_accept)
        buttons.rejected.connect(self.reject)
        root.addWidget(buttons)

    # ------------------------------------------------------------------
    # Value loading / saving
    # ------------------------------------------------------------------
    def _load_values(self) -> None:
        """Populate widgets from the current ConfigManager values."""
        self._interval_spin.setValue(int(self._config.get("interval", 60)))
        theme = str(self._config.get("theme", "dark"))
        idx = self._theme_combo.findText(theme)
        if idx >= 0:
            self._theme_combo.setCurrentIndex(idx)
        self._speed_spin.setValue(int(self._config.get("animation_speed", 100)))
        self._scale_spin.setValue(float(self._config.get("scale", 1.0)))
        self._sound_edit.setText(str(self._config.get("notification_sound", "")))
        self._reminders_check.setChecked(
            bool(self._config.get("reminders_enabled", True))
        )
        self._startup_check.setChecked(
            bool(self._config.get("launch_on_startup", False))
        )

    def _on_accept(self) -> None:
        """Persist form values to the ConfigManager and close."""
        self._config.set("interval", self._interval_spin.value())
        self._config.set("theme", self._theme_combo.currentText())
        self._config.set("animation_speed", self._speed_spin.value())
        self._config.set("scale", self._scale_spin.value())
        self._config.set(
            "notification_sound", self._sound_edit.text().strip()
        )
        self._config.set("reminders_enabled", self._reminders_check.isChecked())
        self._config.set("launch_on_startup", self._startup_check.isChecked())
        self._config.save()

        logger.info("Settings saved.")
        self.accept()

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    def _browse_sound(self) -> None:
        """Open a file dialog to select a .wav file."""
        path, _ = QFileDialog.getOpenFileName(
            self,
            "Select Notification Sound",
            "",
            "WAV files (*.wav);;All files (*)",
        )
        if path:
            self._sound_edit.setText(path)

    # ------------------------------------------------------------------
    # Public test helpers (expose widgets for test assertions)
    # ------------------------------------------------------------------
    @property
    def interval_spin(self) -> QSpinBox:
        """The reminder-interval spin box."""
        return self._interval_spin

    @property
    def theme_combo(self) -> QComboBox:
        """The theme dropdown."""
        return self._theme_combo

    @property
    def speed_spin(self) -> QSpinBox:
        """The animation-speed spin box."""
        return self._speed_spin

    @property
    def scale_spin(self) -> QDoubleSpinBox:
        """The scale spin box."""
        return self._scale_spin

    @property
    def sound_edit(self) -> QLineEdit:
        """The notification-sound path editor."""
        return self._sound_edit

    @property
    def reminders_check(self) -> QCheckBox:
        """The reminders-enabled checkbox."""
        return self._reminders_check

    @property
    def startup_check(self) -> QCheckBox:
        """The launch-on-startup checkbox."""
        return self._startup_check
