"""Main controller for the ORCA Companion application.

Provides OrcaApp, which owns the transparent, borderless, always-on-top
window displaying the mascot / logo image.  Integrates with
:class:`ConfigManager` for theme and scale, and
:class:`AnimationManager` for character animation states.
"""

import logging
import sys
from pathlib import Path
from typing import Optional

from PySide6.QtCore import Qt, QPoint
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import (
    QMainWindow,
    QLabel,
    QVBoxLayout,
    QWidget,
)

logger = logging.getLogger(__name__)


def _asset_path(name: str) -> Path:
    """Resolve an asset path relative to the project root.

    During development the working directory is the project root, so
    ``assets/<name>`` should resolve.  When frozen with PyInstaller the
    assets are next to the executable.
    """
    # -- develop mode: cwd is project root --
    dev_path = Path.cwd() / "assets" / name
    if dev_path.exists():
        return dev_path

    # -- frozen mode (PyInstaller) --
    if getattr(sys, "frozen", False):
        frozen_base = Path(sys.executable).parent
        return frozen_base / "assets" / name

    return dev_path  # fallback – let the caller handle the missing file


# -- Theme style sheets ---------------------------------------------------

_DARK_THEME = """
QMainWindow {
    background: transparent;
}
QLabel {
    background: transparent;
    color: #c0e0ff;
}
"""

_LIGHT_THEME = """
QMainWindow {
    background: transparent;
}
QLabel {
    background: transparent;
    color: #1a1a2e;
}
"""


class OrcaApp(QMainWindow):
    """Transparent, borderless, always-on-top mascot window.

    Parameters
    ----------
    config:
        A :class:`ConfigManager` instance for theme and scale settings.
        When ``None``, sensible defaults are used (dark theme, 1× scale).
    anim_manager:
        An optional :class:`AnimationManager` for character animations.
        When provided, calling :meth:`set_animation_state` switches the
        displayed image to the corresponding animation asset.
    parent:
        Parent widget.
    """

    def __init__(
        self,
        config: Optional["ConfigManager"] = None,      # noqa: F821
        anim_manager: Optional["AnimationManager"] = None,  # noqa: F821
        parent: Optional[QWidget] = None,
    ) -> None:
        super().__init__(parent)
        self._config = config
        self._anim_manager = anim_manager
        self._drag_pos: Optional[QPoint] = None

        self._setup_window()
        self._setup_ui()
        self._apply_theme()
        self._apply_scale()

        logger.info("OrcaApp window initialised.")

    # ------------------------------------------------------------------
    # Window chrome & flags
    # ------------------------------------------------------------------
    def _setup_window(self) -> None:
        """Apply window flags and attributes for transparency / top-most."""
        self.setWindowFlags(
            Qt.WindowType.FramelessWindowHint
            | Qt.WindowType.WindowStaysOnTopHint
            | Qt.WindowType.Tool
        )
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground, True)
        self.setAttribute(Qt.WidgetAttribute.WA_NoSystemBackground, True)
        self.setWindowTitle("ORCA Companion")

    # ------------------------------------------------------------------
    # UI
    # ------------------------------------------------------------------
    def _setup_ui(self) -> None:
        """Create the central label that holds the logo image."""
        central = QWidget(self)
        central.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground, True)
        self.setCentralWidget(central)

        layout = QVBoxLayout(central)
        layout.setContentsMargins(0, 0, 0, 0)

        self._image_label = QLabel(central)
        self._image_label.setAlignment(
            Qt.AlignmentFlag.AlignCenter
        )
        self._image_label.setStyleSheet("background: transparent;")
        layout.addWidget(self._image_label)

        self._load_logo()

        # Size the window to fit the image
        self.adjustSize()

    def _load_logo(self) -> None:
        """Load the logo image from assets/logo.png.

        If the file is missing a solid-colour placeholder is shown so the
        window is never invisible.
        """
        logo_path = _asset_path("logo.png")
        if logo_path.exists():
            pixmap = QPixmap(str(logo_path))
            if pixmap.isNull():
                logger.warning("logo.png could not be decoded – using placeholder.")
            else:
                self._image_label.setPixmap(pixmap)
                logger.debug("logo.png loaded (%dx%d).", pixmap.width(), pixmap.height())
                return
        else:
            logger.warning("assets/logo.png not found – using placeholder.")

        self._show_placeholder()

    def _show_placeholder(self) -> None:
        """Draw a simple 200×200 placeholder bitmap."""
        pixmap = QPixmap(200, 200)
        pixmap.fill(Qt.GlobalColor.transparent)
        self._image_label.setPixmap(pixmap)
        self._image_label.setText("🐬 ORCA")
        self._image_label.setStyleSheet(
            "background: rgba(30, 30, 60, 200);"
            "color: #c0e0ff;"
            "font-size: 24px;"
            "font-weight: bold;"
            "border-radius: 12px;"
        )

    # ------------------------------------------------------------------
    # Dragging
    # ------------------------------------------------------------------
    def mousePressEvent(self, event) -> None:
        """Store the offset when the user presses the mouse."""
        if event.button() == Qt.MouseButton.LeftButton:
            self._drag_pos = event.globalPosition().toPoint() - self.frameGeometry().topLeft()
            event.accept()
            return
        super().mousePressEvent(event)

    def mouseMoveEvent(self, event) -> None:
        """Reposition the window as the mouse moves."""
        if self._drag_pos is not None and event.buttons() == Qt.MouseButton.LeftButton:
            new_pos = event.globalPosition().toPoint() - self._drag_pos
            self.move(new_pos)
            event.accept()
            return
        super().mouseMoveEvent(event)

    def mouseReleaseEvent(self, event) -> None:
        """Clear drag state on release."""
        self._drag_pos = None
        super().mouseReleaseEvent(event)

    # ------------------------------------------------------------------
    # Theme
    # ------------------------------------------------------------------
    def _apply_theme(self) -> None:
        """Apply the current theme (dark / light) to the window."""
        theme = "dark"
        if self._config is not None:
            theme = str(self._config.get("theme", "dark")).lower()

        sheet = _DARK_THEME if theme == "dark" else _LIGHT_THEME
        self.setStyleSheet(sheet)

        # Adjust placeholder styling to match theme
        if theme == "light":
            self._image_label.setStyleSheet(
                "background: rgba(220, 220, 240, 200);"
                "color: #1a1a2e;"
                "font-size: 24px;"
                "font-weight: bold;"
                "border-radius: 12px;"
            )
        else:
            self._image_label.setStyleSheet(
                "background: rgba(30, 30, 60, 200);"
                "color: #c0e0ff;"
                "font-size: 24px;"
                "font-weight: bold;"
                "border-radius: 12px;"
            )

    # ------------------------------------------------------------------
    # Scale
    # ------------------------------------------------------------------
    def _apply_scale(self) -> None:
        """Scale the displayed image according to the config."""
        scale = 1.0
        if self._config is not None:
            scale = float(self._config.get("scale", 1.0))

        current_pixmap = self._image_label.pixmap()
        if current_pixmap is not None and not current_pixmap.isNull():
            new_width = max(1, int(current_pixmap.width() * scale))
            new_height = max(1, int(current_pixmap.height() * scale))
            scaled = current_pixmap.scaled(
                new_width,
                new_height,
                Qt.AspectRatioMode.KeepAspectRatio,
                Qt.TransformationMode.SmoothTransformation,
            )
            self._image_label.setPixmap(scaled)
            self.adjustSize()

    # ------------------------------------------------------------------
    # Animation
    # ------------------------------------------------------------------
    def set_animation_state(self, state_name: str) -> None:
        """Switch the mascot to the animation for *state_name*.

        Delegates to :class:`AnimationManager` when available; otherwise
        does nothing.
        """
        if self._anim_manager is None:
            logger.debug("No AnimationManager – ignoring state '%s'.", state_name)
            return

        self._anim_manager.set_state(state_name)
        pixmap = self._anim_manager.get_current_pixmap()
        if pixmap is not None and not pixmap.isNull():
            self._image_label.setPixmap(pixmap)
            self._apply_scale()
            self.adjustSize()
            logger.debug("Animation state set to '%s'.", state_name)

    # ------------------------------------------------------------------
    # Public helpers
    # ------------------------------------------------------------------
    def toggle_visibility(self) -> None:
        """Show / hide the mascot window."""
        if self.isVisible():
            self.hide()
        else:
            self.show()
