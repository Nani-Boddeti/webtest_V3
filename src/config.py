"""Configuration manager for the ORCA Companion.

Reads and writes a JSON configuration file stored in the user's
AppData directory.  Malformed files are silently replaced with defaults.
"""

from __future__ import annotations

import json
import logging
from copy import deepcopy
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

# -- Defaults applied when no config file exists --------------------------
_DEFAULT_CONFIG: dict[str, Any] = {
    "interval": 60,              # minutes between reminders
    "theme": "dark",
    "animation_speed": 100,      # ms per frame
    "scale": 1.0,                # mascot size multiplier
    "notification_sound": "",    # path to .wav (empty → system default)
    "reminders_enabled": True,
    "launch_on_startup": False,
    "reminder_duration": 5,      # seconds to show 'drink' before reverting
}


def _default_path() -> Path:
    """Return the default config file path on Windows."""
    return Path.home() / "AppData" / "Roaming" / "ORCA Companion" / "config.json"


class ConfigManager:
    """Manages application settings backed by a JSON file.

    Parameters
    ----------
    config_path:
        Path to the JSON config file.  Defaults to
        ``%APPDATA%/ORCA Companion/config.json``.
    """

    def __init__(self, config_path: str | Path | None = None) -> None:
        self._path = Path(config_path) if config_path else _default_path()
        self._data: dict[str, Any] = deepcopy(_DEFAULT_CONFIG)
        self._load()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def get(self, key: str, default: Any = None) -> Any:
        """Return the value for *key*, falling back to *default*."""
        return self._data.get(key, default)

    def set(self, key: str, value: Any) -> None:
        """Store *value* under *key* (in-memory; call :meth:`save` to persist)."""
        self._data[key] = value

    def save(self) -> None:
        """Persist the current configuration to disk."""
        try:
            self._path.parent.mkdir(parents=True, exist_ok=True)
            with open(self._path, "w", encoding="utf-8") as fh:
                json.dump(self._data, fh, indent=2)
        except OSError as exc:
            logger.error("Failed to save config to %s: %s", self._path, exc)

    @property
    def path(self) -> Path:
        """The filesystem path of the backing JSON file."""
        return self._path

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _load(self) -> None:
        """Read the JSON file, merging its values on top of defaults."""
        if not self._path.exists():
            logger.debug("No config file at %s – using defaults.", self._path)
            return

        try:
            with open(self._path, "r", encoding="utf-8") as fh:
                loaded = json.load(fh)
            if not isinstance(loaded, dict):
                raise ValueError("Config root must be a JSON object.")
            self._data.update(loaded)
            logger.debug("Config loaded from %s.", self._path)
        except (json.JSONDecodeError, ValueError, OSError) as exc:
            logger.warning(
                "Could not parse config file %s (%s) – using defaults.",
                self._path,
                exc,
            )
