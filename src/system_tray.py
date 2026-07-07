"""System-tray icon and context menu for the ORCA Companion."""

import logging
from typing import Optional, Callable

from PySide6.QtCore import QObject
from PySide6.QtGui import QIcon, QAction
from PySide6.QtWidgets import QSystemTrayIcon, QMenu, QApplication

logger = logging.getLogger(__name__)


class SystemTray(QObject):
    """Manages the system-tray icon with *Settings* and *Exit* actions."""

    def __init__(
        self,
        parent: Optional[QObject] = None,
        on_settings: Optional[Callable[[], None]] = None,
        on_exit: Optional[Callable[[], None]] = None,
    ) -> None:
        super().__init__(parent)
        self._on_settings = on_settings
        self._on_exit = on_exit or (lambda: QApplication.instance().quit())

        self._icon = self._make_icon()
        self._tray = QSystemTrayIcon(self._icon, self)
        self._tray.setToolTip("ORCA Companion")

        self._menu = self._build_menu()
        self._tray.setContextMenu(self._menu)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def show(self) -> None:
        """Make the tray icon visible."""
        if not QSystemTrayIcon.isSystemTrayAvailable():
            logger.warning("System tray is not available on this platform.")
            return
        self._tray.show()
        logger.info("System-tray icon shown.")

    def hide(self) -> None:
        """Remove the tray icon."""
        self._tray.hide()

    @property
    def tray(self) -> QSystemTrayIcon:
        """Expose the underlying QSystemTrayIcon for signal testing."""
        return self._tray

    @property
    def menu(self) -> QMenu:
        """Expose the context menu for testing."""
        return self._menu

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------
    @staticmethod
    def _make_icon() -> QIcon:
        """Return a fallback icon so the tray entry is always visible.

        Uses ``assets/logo.png`` when available, otherwise falls back to a
        built-in style pixmap.
        """
        from pathlib import Path

        icon_path = Path("assets/logo.png")
        if icon_path.exists():
            return QIcon(str(icon_path))
        # Fallback: use the standard application icon provided by Qt
        logger.debug("No tray icon file found – using fallback icon.")
        return QApplication.style().standardIcon(
            QApplication.style().StandardPixmap.SP_ComputerIcon
        )

    def _build_menu(self) -> QMenu:
        """Create the tray context menu with Settings and Exit."""
        menu = QMenu()

        settings_action = QAction("Settings", menu)
        settings_action.triggered.connect(self._on_settings_clicked)
        menu.addAction(settings_action)

        exit_action = QAction("Exit", menu)
        exit_action.triggered.connect(self._on_exit_clicked)
        menu.addAction(exit_action)

        return menu

    def _on_settings_clicked(self) -> None:
        """Handler for the Settings menu action."""
        logger.debug("Settings action triggered.")
        if self._on_settings:
            self._on_settings()

    def _on_exit_clicked(self) -> None:
        """Handler for the Exit menu action."""
        logger.debug("Exit action triggered.")
        if self._on_exit:
            self._on_exit()
