"""Entry point for the ORCA Companion desktop application."""

import logging
import sys
from pathlib import Path

# Ensure the project root is on sys.path so that ``src.*`` imports work
# regardless of whether the entry point is invoked as ``python src/main.py``
# or ``python -m src.main``.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from PySide6.QtWidgets import QApplication
from PySide6.QtCore import Qt

from src.app import OrcaApp
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

        # -- Create the mascot window --
        window = OrcaApp()

        # -- System tray --
        tray = SystemTray(
            on_settings=lambda: logger.info("Settings placeholder – not yet implemented."),
        )
        tray.show()

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
