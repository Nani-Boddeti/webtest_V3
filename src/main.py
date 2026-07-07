"""Entry point for the ORCA Companion desktop application."""

import logging
import sys
from pathlib import Path

# Ensure the project root is on sys.path so that ``src.*`` imports work
# regardless of whether the entry point is invoked as ``python src/main.py``
# or ``python -m src.main``.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from PySide6.QtGui import QIcon
from PySide6.QtWidgets import QApplication
from PySide6.QtCore import Qt

from src.app import OrcaApp
from src.animation import AnimationManager
from src.config import ConfigManager
from src.reminders import ReminderManager
from src.settings_dialog import SettingsDialog
from src.startup import apply_startup
from src.system_tray import SystemTray


def _setup_logging() -> None:
    """Configure root logger with a sensible default format."""
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s [%(levelname)-7s] %(name)s - %(message)s",
        datefmt="%H:%M:%S",
        stream=sys.stdout,
    )


def main() -> int:
    """Run the ORCA Companion application.

    Returns:
        0 on clean exit, 1 if a fatal error occurred during startup.
    """
    _setup_logging()
    logger = logging.getLogger("main")

    try:
        # High-DPI support (must be set before QApplication is created)
        QApplication.setAttribute(Qt.ApplicationAttribute.AA_EnableHighDpiScaling, True)
        QApplication.setAttribute(Qt.ApplicationAttribute.AA_UseHighDpiPixmaps, True)

        app = QApplication(sys.argv)
        app.setApplicationName("ORCA Companion")
        app.setOrganizationName("ORCA")
        app.setQuitOnLastWindowClosed(False)

        # -- Application icon (taskbar, Alt-Tab, etc.) --
        icon_path = Path("assets/logo.png")
        if icon_path.exists():
            app.setWindowIcon(QIcon(str(icon_path)))

        # -- Config --
        config = ConfigManager()

        # -- Apply start-up preference on launch --
        apply_startup(bool(config.get("launch_on_startup", False)))

        # -- Animation manager --
        anim_manager = AnimationManager(
            frame_duration_ms=int(config.get("animation_speed", 100))
        )

        # -- Create the mascot window --
        window = OrcaApp(config=config, anim_manager=anim_manager)

        # -- System tray --
        _reminder_manager = None  # assigned further below

        def _open_settings() -> None:
            """Open the settings dialog and apply changes on accept."""
            dlg = SettingsDialog(config, parent=window)
            if dlg.exec() == SettingsDialog.DialogCode.Accepted:
                # Re-apply theme, scale, and animation speed
                window.apply_theme()
                window.apply_scale()
                anim_manager.frame_duration_ms = int(
                    config.get("animation_speed", 100)
                )
                # Sync start-up registry entry
                apply_startup(bool(config.get("launch_on_startup", False)))
                if _reminder_manager is not None:
                    _reminder_manager.restart()

        tray = SystemTray(
            on_show=window.toggle_visibility,
            on_settings=_open_settings,
        )
        tray.show()

        # -- Reminders --
        _reminder_manager = ReminderManager(
            config=config,
            tray=tray.tray,
            parent=window,
        )
        _reminder_manager.state_change_requested.connect(
            window.set_animation_state
        )
        _reminder_manager.start()

        # Show window and start event loop
        window.show()
        logger.info("ORCA Companion started.")
        exit_code = app.exec()
        logger.info("ORCA Companion exiting (code %d).", exit_code)
        return exit_code

    except Exception:
        logger.exception("Fatal error during startup.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
