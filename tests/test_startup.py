"""Tests for the startup registration module."""

from __future__ import annotations

import sys
from pathlib import Path
from unittest import mock

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.startup import apply_startup, _exe_path


class TestExePath:
    """Tests for the _exe_path helper."""

    def test_returns_string(self) -> None:
        """_exe_path should return a non-empty string."""
        result = _exe_path()
        assert isinstance(result, str)
        assert len(result) > 0

    def test_includes_main_script_when_not_frozen(self) -> None:
        """When not frozen, the path should reference src/main.py."""
        # We are running from source, so the result should include main.py
        result = _exe_path()
        assert "main.py" in result

    def test_frozen_mode_returns_exe(self) -> None:
        """When frozen, the path should be sys.executable only."""
        with mock.patch("sys.frozen", True, create=True):
            with mock.patch("sys.executable", "C:\\Program Files\\ORCA\\orca.exe"):
                result = _exe_path()
                assert result == "C:\\Program Files\\ORCA\\orca.exe"


class TestApplyStartup:
    """Tests for the apply_startup function."""

    def test_noop_on_non_windows(self) -> None:
        """On non-Windows platforms, apply_startup should be a no-op."""
        with mock.patch("os.name", "posix"):
            # Should not raise
            apply_startup(True)
            apply_startup(False)

    def test_noop_when_winreg_missing(self) -> None:
        """When winreg cannot be imported, apply_startup should log and return."""
        # Simulate Windows but with a broken winreg import
        real_import = __import__

        def _fake_import(name, *args, **kwargs):
            if name == "winreg":
                raise ImportError("No module named winreg")
            return real_import(name, *args, **kwargs)

        with mock.patch("os.name", "nt"):
            with mock.patch("builtins.__import__", side_effect=_fake_import):
                with mock.patch("src.startup.logger") as mock_logger:
                    apply_startup(True)
                    mock_logger.warning.assert_called_once()

    @mock.patch("os.name", "nt")
    def test_enable_writes_registry_value(self) -> None:
        """When enable=True, winreg.SetValueEx should be called."""
        mock_winreg = mock.MagicMock()
        mock_key = mock.MagicMock()
        mock_winreg.OpenKey.return_value = mock_key

        with mock.patch.dict("sys.modules", {"winreg": mock_winreg}):
            apply_startup(True)

        mock_winreg.OpenKey.assert_called_once()
        mock_winreg.SetValueEx.assert_called_once()
        mock_winreg.CloseKey.assert_called_once_with(mock_key)

    @mock.patch("os.name", "nt")
    def test_disable_deletes_registry_value(self) -> None:
        """When enable=False, winreg.DeleteValue should be called."""
        mock_winreg = mock.MagicMock()
        mock_key = mock.MagicMock()
        mock_winreg.OpenKey.return_value = mock_key

        with mock.patch.dict("sys.modules", {"winreg": mock_winreg}):
            apply_startup(False)

        mock_winreg.OpenKey.assert_called_once()
        mock_winreg.DeleteValue.assert_called_once()
        mock_winreg.CloseKey.assert_called_once_with(mock_key)

    @mock.patch("os.name", "nt")
    def test_disable_handles_missing_value(self) -> None:
        """When the value doesn't exist, DeleteValue raises FileNotFoundError."""
        mock_winreg = mock.MagicMock()
        mock_key = mock.MagicMock()
        mock_winreg.OpenKey.return_value = mock_key
        mock_winreg.DeleteValue.side_effect = FileNotFoundError()

        with mock.patch.dict("sys.modules", {"winreg": mock_winreg}):
            # Should not raise
            apply_startup(False)

        mock_winreg.DeleteValue.assert_called_once()
        mock_winreg.CloseKey.assert_called_once_with(mock_key)

    @mock.patch("os.name", "nt")
    def test_open_key_failure_is_logged(self) -> None:
        """When OpenKey fails, the error is logged and no further calls made."""
        mock_winreg = mock.MagicMock()
        mock_winreg.OpenKey.side_effect = OSError("Access denied")

        with mock.patch.dict("sys.modules", {"winreg": mock_winreg}):
            with mock.patch("src.startup.logger") as mock_logger:
                apply_startup(True)
                mock_logger.error.assert_called_once()

        mock_winreg.OpenKey.assert_called_once()
        mock_winreg.SetValueEx.assert_not_called()
