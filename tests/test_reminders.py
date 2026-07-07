"""Tests for the ReminderManager module."""

from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path
from unittest import mock

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from PySide6.QtCore import QTimer
from PySide6.QtTest import QSignalSpy
from PySide6.QtWidgets import QApplication, QSystemTrayIcon

from src.config import ConfigManager
from src.reminders import ReminderManager

# ============================================================================
# Session-scoped QApplication (needed by QSystemTrayIcon, signals, etc.)
# ============================================================================


@pytest.fixture(scope="session", autouse=True)
def qapp() -> QApplication:
    """Session-scoped QApplication so Qt is initialised once."""
    app = QApplication.instance()
    if app is None:
        app = QApplication(sys.argv)
    return app


# ============================================================================
# Fixtures
# ============================================================================


@pytest.fixture
def config() -> ConfigManager:
    """Return a ConfigManager backed by a temporary file."""
    with tempfile.TemporaryDirectory() as tmpdir:
        cfg_path = Path(tmpdir) / "config.json"
        yield ConfigManager(config_path=cfg_path)


@pytest.fixture
def manager(config: ConfigManager) -> ReminderManager:
    """Return a ReminderManager with a temp config and no tray."""
    mgr = ReminderManager(config=config)
    yield mgr
    mgr.stop()
    mgr.deleteLater()


@pytest.fixture
def manager_with_tray(config: ConfigManager, qapp: QApplication) -> ReminderManager:
    """Return a ReminderManager that has a QSystemTrayIcon for notifications."""
    tray = QSystemTrayIcon()
    mgr = ReminderManager(config=config, tray=tray)
    yield mgr
    mgr.stop()
    mgr.deleteLater()
    tray.hide()
    tray.deleteLater()


# ============================================================================
# Construction & defaults
# ============================================================================


class TestConstruction:
    """Tests for ReminderManager instantiation and initial state."""

    def test_created_not_running(self, manager: ReminderManager) -> None:
        """A newly created manager should not be running."""
        assert manager.is_running is False
        assert manager.interval_ms == 0

    def test_created_with_tray(self, manager_with_tray: ReminderManager) -> None:
        """Manager with a tray should still be in a valid initial state."""
        assert manager_with_tray.is_running is False


# ============================================================================
# Start / Stop / Restart
# ============================================================================


class TestStartStop:
    """Tests for the start / stop / restart lifecycle."""

    def test_start_starts_timer(self, manager: ReminderManager) -> None:
        """After start(), the timer should be active."""
        manager.start()
        assert manager.is_running is True
        assert manager.interval_ms > 0

    def test_stop_stops_timer(self, manager: ReminderManager) -> None:
        """After stop(), the timer should not be active."""
        manager.start()
        manager.stop()
        assert manager.is_running is False

    def test_restart_restarts(self, manager: ReminderManager) -> None:
        """restart() should stop then start."""
        manager.start()
        assert manager.is_running is True
        manager.restart()
        assert manager.is_running is True

    def test_start_respects_interval(self, config: ConfigManager) -> None:
        """Timer interval should reflect the config value (minutes → ms)."""
        config.set("interval", 10)  # 10 minutes
        mgr = ReminderManager(config=config)
        try:
            mgr.start()
            expected_ms = 10 * 60 * 1000
            assert mgr.interval_ms == expected_ms
        finally:
            mgr.stop()
            mgr.deleteLater()

    def test_start_respects_default_interval(self, config: ConfigManager) -> None:
        """Default interval (60 min) should be 3,600,000 ms."""
        mgr = ReminderManager(config=config)
        try:
            mgr.start()
            assert mgr.interval_ms == 60 * 60 * 1000
        finally:
            mgr.stop()
            mgr.deleteLater()

    def test_start_clamps_min_interval(self, config: ConfigManager) -> None:
        """Interval < 1 is clamped to 1 minute."""
        config.set("interval", 0)
        mgr = ReminderManager(config=config)
        try:
            mgr.start()
            assert mgr.interval_ms == 1 * 60 * 1000
        finally:
            mgr.stop()
            mgr.deleteLater()


# ============================================================================
# Reminders enabled flag
# ============================================================================


class TestRemindersEnabled:
    """Tests for the ``reminders_enabled`` config flag."""

    def test_start_when_disabled_does_not_start_timer(
        self, config: ConfigManager
    ) -> None:
        """When reminders are disabled, start() is a no-op."""
        config.set("reminders_enabled", False)
        mgr = ReminderManager(config=config)
        try:
            mgr.start()
            assert mgr.is_running is False
        finally:
            mgr.stop()
            mgr.deleteLater()

    def test_start_when_enabled_starts(self, config: ConfigManager) -> None:
        """When reminders are enabled (the default), start() works."""
        config.set("reminders_enabled", True)
        mgr = ReminderManager(config=config)
        try:
            mgr.start()
            assert mgr.is_running is True
        finally:
            mgr.stop()
            mgr.deleteLater()

    def test_disabled_then_enabled(self, config: ConfigManager) -> None:
        """Restarting after enabling reminders should start the timer."""
        config.set("reminders_enabled", False)
        mgr = ReminderManager(config=config)
        try:
            mgr.start()
            assert mgr.is_running is False

            config.set("reminders_enabled", True)
            mgr.restart()
            assert mgr.is_running is True
        finally:
            mgr.stop()
            mgr.deleteLater()


# ============================================================================
# Signal emission
# ============================================================================


class TestSignals:
    """Tests for signal emission on timeout and revert."""

    def test_timeout_emits_drink_signal(self, manager: ReminderManager) -> None:
        """When the timer fires, ``state_change_requested`` must emit 'drink'."""
        spy = QSignalSpy(manager.state_change_requested)
        # Prevent the revert timer from firing asynchronously
        manager._revert_timer.stop()

        manager._on_timeout()

        assert len(spy) == 1
        assert spy[0][0] == "drink"

    def test_timeout_emits_notification_signal(self, manager: ReminderManager) -> None:
        """The ``notification_requested`` signal should emit on timeout."""
        spy = QSignalSpy(manager.notification_requested)
        manager._revert_timer.stop()

        manager._on_timeout()

        assert len(spy) >= 1
        assert spy[0][0] == "ORCA Companion"
        assert spy[0][1] == "💧 Time to Drink Water"

    def test_revert_emits_idle(self, manager: ReminderManager) -> None:
        """Calling _on_revert should emit 'idle'."""
        spy = QSignalSpy(manager.state_change_requested)

        manager._on_revert()

        assert len(spy) == 1
        assert spy[0][0] == "idle"

    def test_revert_timer_fires_after_duration(
        self, config: ConfigManager
    ) -> None:
        """After _on_timeout, the revert timer should eventually fire."""
        config.set("reminder_duration", 1)  # 1 second for fast test
        mgr = ReminderManager(config=config)
        spy = QSignalSpy(mgr.state_change_requested)

        try:
            # Stop the interval timer so only the revert timer runs
            mgr._timer.stop()
            mgr._on_timeout()

            # Immediately after _on_timeout we should have 'drink'
            assert len(spy) >= 1
            assert spy[0][0] == "drink"

            # Wait for the revert timer (1 s + margin); poll with processEvents
            remaining = 3000  # ms budget
            while len(spy) < 2 and remaining > 0:
                QApplication.processEvents()
                import time
                time.sleep(0.05)
                remaining -= 50

            assert len(spy) >= 2, (
                f"Expected 2 signals (drink + idle), got {len(spy)}"
            )
            assert spy[1][0] == "idle"
        finally:
            mgr.stop()
            mgr.deleteLater()


# ============================================================================
# Notification
# ============================================================================


class TestNotification:
    """Tests for the notification delivery mechanism."""

    def test_notification_signal_emitted(self, manager: ReminderManager) -> None:
        """_show_notification should emit notification_requested."""
        spy = QSignalSpy(manager.notification_requested)
        manager._show_notification("Test Title", "Test Message")
        assert len(spy) == 1
        assert spy[0][0] == "Test Title"
        assert spy[0][1] == "Test Message"

    @mock.patch("src.reminders.ReminderManager._try_win10toast", return_value=False)
    def test_no_tray_no_toast_logs_info(
        self, mock_toast: mock.MagicMock, manager: ReminderManager
    ) -> None:
        """Without tray or win10toast the notification should not raise."""
        manager._show_notification("T", "M")
        mock_toast.assert_called_once_with("T", "M")

    def test_tray_notification_called(
        self, manager_with_tray: ReminderManager
    ) -> None:
        """When a tray is present, showMessage should be called."""
        tray = manager_with_tray._tray
        with mock.patch.object(tray, "showMessage") as mock_show:
            with mock.patch.object(
                tray, "supportsMessages", return_value=True
            ):
                manager_with_tray._show_notification("Title", "Body")
                mock_show.assert_called_once()

    @mock.patch.dict(os.environ, {"ORCA_NO_TOAST": "1"})
    def test_toast_disabled_by_env(self, manager: ReminderManager) -> None:
        """Setting ORCA_NO_TOAST=1 should skip win10toast."""
        result = ReminderManager._try_win10toast("T", "M")
        assert result is False

    def test_try_win10toast_on_non_windows(self) -> None:
        """On non-Windows platforms _try_win10toast should return False."""
        with mock.patch("os.name", "posix"):
            result = ReminderManager._try_win10toast("T", "M")
            assert result is False


# ============================================================================
# Sound
# ============================================================================


class TestSound:
    """Tests for sound playback."""

    def test_no_sound_when_path_empty(self, config: ConfigManager) -> None:
        """When notification_sound is empty, no sound should be attempted."""
        config.set("notification_sound", "")
        mgr = ReminderManager(config=config)
        try:
            # Should not raise
            mgr._play_sound()
        finally:
            mgr.stop()
            mgr.deleteLater()

    def test_no_sound_when_file_missing(self, config: ConfigManager) -> None:
        """A non-existent sound file is logged and ignored."""
        config.set("notification_sound", "/nonexistent/alert.wav")
        mgr = ReminderManager(config=config)
        try:
            mgr._play_sound()  # should not raise
        finally:
            mgr.stop()
            mgr.deleteLater()

    @mock.patch("src.reminders._HAS_QT_MULTIMEDIA", False)
    def test_no_sound_when_qt_multimedia_missing(self, config: ConfigManager) -> None:
        """When QtMultimedia is unavailable, sound is silently skipped."""
        import wave
        import struct

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            wav_path = tmp.name
            with wave.open(wav_path, "w") as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)
                wf.setframerate(44100)
                wf.writeframes(struct.pack("<h", 0) * 100)

        try:
            config.set("notification_sound", wav_path)
            mgr = ReminderManager(config=config)
            try:
                mgr._play_sound()  # should not raise
            finally:
                mgr.stop()
                mgr.deleteLater()
        finally:
            os.unlink(wav_path)

    @mock.patch("src.reminders.QSoundEffect", None)
    @mock.patch("src.reminders._HAS_QT_MULTIMEDIA", True)
    def test_play_sound_handles_null_qsoundeffect(
        self, config: ConfigManager
    ) -> None:
        """Graceful handling when QSoundEffect import succeeds but is None."""
        import wave
        import struct

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            wav_path = tmp.name
            with wave.open(wav_path, "w") as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)
                wf.setframerate(44100)
                wf.writeframes(struct.pack("<h", 0) * 100)

        try:
            config.set("notification_sound", wav_path)
            mgr = ReminderManager(config=config)
            try:
                mgr._play_sound()  # should not raise
            finally:
                mgr.stop()
                mgr.deleteLater()
        finally:
            os.unlink(wav_path)


# ============================================================================
# Full timeout cycle
# ============================================================================


class TestTimeoutCycle:
    """Integration-style tests for the full timeout → revert cycle."""

    def test_full_cycle_emits_correct_state_sequence(
        self, config: ConfigManager
    ) -> None:
        """A complete timeout cycle emits 'drink' then 'idle'."""
        config.set("reminder_duration", 1)  # fast revert
        mgr = ReminderManager(config=config)
        spy = QSignalSpy(mgr.state_change_requested)

        try:
            mgr._timer.stop()  # prevent real timer from firing
            mgr._on_timeout()

            # Should have 'drink' immediately
            assert len(spy) >= 1
            assert spy[0][0] == "drink"

            # Wait for revert
            remaining = 3000
            while len(spy) < 2 and remaining > 0:
                QApplication.processEvents()
                import time
                time.sleep(0.05)
                remaining -= 50

            assert len(spy) == 2
            assert spy[1][0] == "idle"
        finally:
            mgr.stop()
            mgr.deleteLater()

    @mock.patch("src.reminders.ReminderManager._play_sound")
    def test_play_sound_called_on_timeout(
        self,
        mock_sound: mock.MagicMock,
        config: ConfigManager,
    ) -> None:
        """_play_sound should be invoked during the timeout handler."""
        config.set("notification_sound", "/fake/path.wav")
        mgr = ReminderManager(config=config)
        try:
            mgr._timer.stop()
            mgr._revert_timer.stop()
            mgr._on_timeout()
            mock_sound.assert_called_once()
        finally:
            mgr.stop()
            mgr.deleteLater()
