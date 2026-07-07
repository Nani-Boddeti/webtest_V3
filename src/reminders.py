"""Reminder manager for the ORCA Companion.

Provides ``ReminderManager``, a :class:`QObject` that fires periodic
hydration reminders using :class:`QTimer`.  On each tick it:

1. Emits ``state_change_requested('drink')`` so the main controller can
   switch the mascot animation.
2. Shows a desktop notification (via ``QSystemTrayIcon.showMessage`` when
   a tray reference was supplied, otherwise attempts ``win10toast``).
3. Plays a user-configured ``.wav`` sound if one is set.
4. After a configurable duration, emits ``state_change_requested('idle')``
   so the mascot returns to idle.
"""

from __future__ import annotations

import logging
import os
from typing import Optional

from PySide6.QtCore import QObject, QTimer, Signal, QUrl

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Try importing QSoundEffect – may not be present on all Qt installs.
# ---------------------------------------------------------------------------
try:
    from PySide6.QtMultimedia import QSoundEffect

    _HAS_QT_MULTIMEDIA = True
except ImportError:  # pragma: no cover
    _HAS_QT_MULTIMEDIA = False
    QSoundEffect = None  # type: ignore[assignment]


# ---------------------------------------------------------------------------
# ReminderManager
# ---------------------------------------------------------------------------


class ReminderManager(QObject):
    """Periodic hydration reminder.

    Parameters
    ----------
    config:
        A ``ConfigManager`` instance supplying the keys ``interval``
        (minutes), ``reminders_enabled``, ``notification_sound``, and
        ``reminder_duration`` (seconds).
    tray:
        An optional ``QSystemTrayIcon``.  When provided, notifications
        are shown via ``tray.showMessage()``; otherwise ``win10toast``
        is tried as a fallback.
    parent:
        Parent QObject.
    """

    #: Emitted with ``'drink'`` or ``'idle'`` so that the animation
    #: controller can react.
    state_change_requested = Signal(str)

    #: Emitted when a desktop notification should be shown.  Subscribers
    #: (e.g. the main app) may connect this to their own notification
    #: display logic.
    notification_requested = Signal(str, str)  # title, message

    _DEFAULT_DURATION: int = 5       # seconds
    _NOTIFICATION_TITLE: str = "ORCA Companion"
    _NOTIFICATION_MESSAGE: str = "💧 Time to Drink Water"

    def __init__(
        self,
        config: "ConfigManager",  # noqa: F821
        tray: Optional["QSystemTrayIcon"] = None,  # noqa: F821
        parent: Optional[QObject] = None,
    ) -> None:
        super().__init__(parent)
        self._config = config
        self._tray = tray

        # -- Reminder interval timer --
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._on_timeout)

        # -- Single-shot revert timer --
        self._revert_timer = QTimer(self)
        self._revert_timer.setSingleShot(True)
        self._revert_timer.timeout.connect(self._on_revert)

        self._sound: Optional[QSoundEffect] = None

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def start(self) -> None:
        """Begin the reminder cycle.

        Reads the current interval from the config on every call so that
        settings changes are picked up without needing to restart the app.
        Does nothing when ``reminders_enabled`` is ``False``.
        """
        if not self._config.get("reminders_enabled", True):
            logger.debug("Reminders disabled — not starting.")
            return

        interval_min = int(self._config.get("interval", 60))
        if interval_min < 1:
            interval_min = 1

        interval_ms = interval_min * 60 * 1000
        self._timer.start(interval_ms)
        logger.info("Reminder timer started (interval=%d min).", interval_min)

    def stop(self) -> None:
        """Stop the reminder cycle and cancel any pending revert."""
        self._timer.stop()
        self._revert_timer.stop()
        logger.debug("Reminder timer stopped.")

    def restart(self) -> None:
        """Convenience: stop then start (e.g. after config change)."""
        self.stop()
        self.start()

    @property
    def is_running(self) -> bool:
        """``True`` when the interval timer is active."""
        return self._timer.isActive()

    @property
    def interval_ms(self) -> int:
        """The current timer interval in milliseconds (0 if stopped)."""
        return self._timer.interval()

    # ------------------------------------------------------------------
    # Internal – timeout handlers
    # ------------------------------------------------------------------

    def _on_timeout(self) -> None:
        """Fired by the interval timer."""
        logger.info("Hydration reminder triggered.")

        # 1. Request drink animation
        self.state_change_requested.emit("drink")

        # 2. Show desktop notification
        self._show_notification(self._NOTIFICATION_TITLE, self._NOTIFICATION_MESSAGE)

        # 3. Play sound (if configured)
        self._play_sound()

        # 4. Schedule revert to idle
        duration_sec = int(self._config.get("reminder_duration", self._DEFAULT_DURATION))
        self._revert_timer.start(duration_sec * 1000)

    def _on_revert(self) -> None:
        """Fired by the single-shot revert timer."""
        logger.debug("Reverting animation state to idle.")
        self.state_change_requested.emit("idle")

    # ------------------------------------------------------------------
    # Internal – notification
    # ------------------------------------------------------------------

    def _show_notification(self, title: str, message: str) -> None:
        """Show a desktop notification.

        Prefers ``QSystemTrayIcon.showMessage`` when a tray is available,
        falls back to ``win10toast``, then logs a warning if neither works.
        """
        # -- Also emit a signal so the main app can hook in --
        self.notification_requested.emit(title, message)

        # -- Attempt tray-based notification --
        if self._tray is not None:
            try:
                if self._tray.supportsMessages():
                    self._tray.showMessage(
                        title,
                        message,
                        self._tray.MessageIcon.Information,
                        5000,
                    )
                    logger.debug("Notification shown via system tray.")
                    return
            except Exception as exc:  # pragma: no cover
                logger.warning("Tray notification failed: %s", exc)

        # -- Fallback: win10toast --
        if self._try_win10toast(title, message):
            return

        # -- Last resort --
        logger.info("Notification: %s – %s", title, message)

    @staticmethod
    def _try_win10toast(title: str, message: str) -> bool:
        """Attempt a ``win10toast`` notification; return ``True`` on success."""
        # Skip on non-Windows or when explicitly disabled
        if os.name != "nt":
            return False
        if os.environ.get("ORCA_NO_TOAST", "").strip() == "1":
            return False

        try:
            from win10toast import ToastNotifier  # type: ignore[import-untyped]

            toaster = ToastNotifier()
            toaster.show_toast(title, message, duration=5, threaded=True)
            logger.debug("Notification shown via win10toast.")
            return True
        except ImportError:
            logger.debug("win10toast not installed.")
            return False
        except Exception as exc:  # pragma: no cover
            logger.debug("win10toast failed: %s", exc)
            return False

    # ------------------------------------------------------------------
    # Internal – sound
    # ------------------------------------------------------------------

    def _play_sound(self) -> None:
        """Play the user-configured ``.wav`` file, if any."""
        sound_path = str(self._config.get("notification_sound", "")).strip()
        if not sound_path:
            return

        # Ensure the file exists before attempting playback
        if not os.path.isfile(sound_path):
            logger.warning("Sound file not found: %s", sound_path)
            return

        if not _HAS_QT_MULTIMEDIA:
            logger.debug("QtMultimedia unavailable – cannot play sound.")
            return

        try:
            if self._sound is None:
                self._sound = QSoundEffect(self)
            self._sound.setSource(QUrl.fromLocalFile(sound_path))
            self._sound.play()
            logger.debug("Playing notification sound: %s", sound_path)
        except Exception as exc:  # pragma: no cover
            logger.warning("Failed to play sound '%s': %s", sound_path, exc)
