"""Manage Windows start-up registration for the ORCA Companion.

Provides :func:`apply_startup` which writes or removes a registry entry
under ``HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`` so that
the application can optionally launch when the user logs in.

On non-Windows platforms the function logs a warning and is a no-op.
"""

from __future__ import annotations

import logging
import os
import sys
from pathlib import Path

logger = logging.getLogger(__name__)

# Registry constants for Windows start-up
_RUN_KEY: str = r"Software\Microsoft\Windows\CurrentVersion\Run"
_VALUE_NAME: str = "ORCA Companion"


def _exe_path() -> str:
    """Return the best guess for the executable / script path.

    When running from source this is ``sys.executable`` with the
    ``src/main.py`` script appended.  When frozen (PyInstaller) it is
    the path to the generated ``.exe``.
    """
    if getattr(sys, "frozen", False):
        # PyInstaller sets sys.executable to the frozen .exe
        return sys.executable

    # Running from source: construct the command line
    exe = sys.executable
    main_script = Path(__file__).resolve().parent / "main.py"
    return f'"{exe}" "{main_script}"'


def apply_startup(enable: bool) -> None:
    """Add or remove the ORCA Companion entry from Windows start-up.

    Parameters
    ----------
    enable:
        When ``True`` the entry is written to the registry; when
        ``False`` any existing entry is removed.
    """
    if os.name != "nt":
        logger.debug(
            "Start-up registration is only supported on Windows "
            "(current platform: %s).",
            os.name,
        )
        return

    try:
        import winreg
    except ImportError:
        logger.warning("winreg module unavailable – cannot manage start-up.")
        return

    try:
        key = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            _RUN_KEY,
            0,
            winreg.KEY_SET_VALUE | winreg.KEY_QUERY_VALUE,
        )
    except OSError as exc:
        logger.error("Cannot open registry run key: %s", exc)
        return

    try:
        if enable:
            path = _exe_path()
            winreg.SetValueEx(key, _VALUE_NAME, 0, winreg.REG_SZ, path)
            logger.info("Start-up entry added: %s", path)
        else:
            try:
                winreg.DeleteValue(key, _VALUE_NAME)
                logger.info("Start-up entry removed.")
            except FileNotFoundError:
                logger.debug("No existing start-up entry to remove.")
    except OSError as exc:
        logger.error("Failed to update registry run key: %s", exc)
    finally:
        winreg.CloseKey(key)
