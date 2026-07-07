"""Tests for the AnimationManager module."""

from __future__ import annotations

import io
import os
import sys
import tempfile
from pathlib import Path
from unittest import mock

import pytest

from PIL import Image
from PySide6.QtWidgets import QApplication

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.animation import (
    AnimationManager,
    _classify,
    _is_frame_sequence,
    _pick_frame_stems,
    _pil_to_qpixmap,
)


# ============================================================================
# Session-scoped QApplication (needed by QPixmap / QMovie)
# ============================================================================


@pytest.fixture(scope="session", autouse=True)
def qapp() -> QApplication:
    """Session-scoped QApplication so Qt is initialised once."""
    app = QApplication.instance()
    if app is None:
        app = QApplication(sys.argv)
    return app


# ============================================================================
# Helpers – minimal valid PNG
# ============================================================================


def _make_png(width: int = 10, height: int = 10) -> bytes:
    """Return the bytes of a minimal valid RGBA PNG."""
    img = Image.new("RGBA", (width, height), (255, 0, 0, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def _write_png(directory: Path, name: str, width: int = 10, height: int = 10) -> Path:
    """Write a valid PNG to *directory* and return its path."""
    path = directory / name
    path.write_bytes(_make_png(width, height))
    return path


def _write_corrupt(directory: Path, name: str) -> Path:
    """Write a file that claims to be PNG but is corrupt."""
    path = directory / name
    # Valid PNG header followed by garbage
    path.write_bytes(b"\x89PNG\r\n\x1a\n" + b"\x00" * 64)
    return path


def _write_unsupported(directory: Path, name: str) -> Path:
    """Write a file with an unsupported extension."""
    path = directory / name
    path.write_text("not an image", encoding="utf-8")
    return path


# ============================================================================
# Fixtures
# ============================================================================


@pytest.fixture
def temp_base() -> Path:
    """Create a temporary base directory for animation assets."""
    with tempfile.TemporaryDirectory() as tmpdir:
        yield Path(tmpdir)


@pytest.fixture
def manager(temp_base: Path) -> AnimationManager:
    """Return an AnimationManager pointed at *temp_base*."""
    with mock.patch.dict(os.environ, {}, clear=True):
        return AnimationManager(base_path=str(temp_base))


# ============================================================================
# Unit tests – helper functions
# ============================================================================


class TestClassify:
    """Tests for the _classify helper."""

    def test_animated_gif(self, temp_base: Path) -> None:
        assert _classify(temp_base / "walk.gif") == "animated"
        assert _classify(temp_base / "WALK.GIF") == "animated"

    def test_spritesheet_names(self, temp_base: Path) -> None:
        assert _classify(temp_base / "spritesheet.png") == "spritesheet"
        assert _classify(temp_base / "sprite_sheet.png") == "spritesheet"
        assert _classify(temp_base / "sprite-sheet.png") == "spritesheet"
        assert _classify(temp_base / "sprites.png") == "spritesheet"

    def test_static_images(self, temp_base: Path) -> None:
        assert _classify(temp_base / "idle.png") == "static"
        assert _classify(temp_base / "frame.apng") == "static"
        assert _classify(temp_base / "logo.jpg") == "static"
        assert _classify(temp_base / "bg.bmp") == "static"
        assert _classify(temp_base / "icon.webp") == "static"

    def test_unknown_extension(self, temp_base: Path) -> None:
        assert _classify(temp_base / "notes.txt") == "unknown"
        assert _classify(temp_base / "data.json") == "unknown"


class TestIsFrameSequence:
    """Tests for the _is_frame_sequence helper."""

    def test_valid_sequence(self) -> None:
        stems = ["frame_001", "frame_002", "frame_003"]
        assert _is_frame_sequence(stems) is True

    def test_single_frame_not_sequence(self) -> None:
        assert _is_frame_sequence(["frame_001"]) is False

    def test_empty(self) -> None:
        assert _is_frame_sequence([]) is False

    def test_mixed_prefixes(self) -> None:
        stems = ["frame_001", "img_002"]
        assert _is_frame_sequence(stems) is True

    def test_no_match(self) -> None:
        stems = ["logo", "icon", "avatar"]
        assert _is_frame_sequence(stems) is False


class TestPickFrameStems:
    """Tests for the _pick_frame_stems helper."""

    def test_picks_matching_stems(self) -> None:
        stems = ["frame_001", "frame_002", "logo", "icon"]
        result = _pick_frame_stems(stems)
        assert set(result) == {"frame_001", "frame_002"}

    def test_returns_empty_when_none_match(self) -> None:
        assert _pick_frame_stems(["logo", "icon"]) == []

    def test_walk_prefix(self) -> None:
        assert _pick_frame_stems(["walk_01", "walk_02"]) == ["walk_01", "walk_02"]


# ============================================================================
# AnimationManager tests
# ============================================================================


class TestPlaceholder:
    """Tests for placeholder behaviour."""

    def test_placeholder_is_generated(self, manager: AnimationManager) -> None:
        """The placeholder must be a 64×64 RGBA Pillow image."""
        placeholder = manager._placeholder
        assert isinstance(placeholder, Image.Image)
        assert placeholder.size == (64, 64)
        assert placeholder.mode == "RGBA"

    def test_missing_state_falls_back(self, manager: AnimationManager) -> None:
        """Calling set_state with a non-existent directory uses placeholder."""
        manager.set_state("nonexistent")
        assert manager.asset_kind is None
        assert manager.current_state == "nonexistent"
        pixmap = manager.get_current_pixmap()
        assert pixmap is not None
        assert not pixmap.isNull()
        assert manager.get_movie() is None

    def test_empty_directory_falls_back(self, manager: AnimationManager, temp_base: Path) -> None:
        """An empty state directory triggers fallback."""
        (temp_base / "idle").mkdir()
        manager.set_state("idle")
        assert manager.asset_kind is None
        assert manager.get_movie() is None

    def test_only_unsupported_files_falls_back(
        self, manager: AnimationManager, temp_base: Path
    ) -> None:
        """Directories with only .txt / .json files trigger fallback."""
        state_dir = temp_base / "idle"
        state_dir.mkdir()
        _write_unsupported(state_dir, "readme.txt")
        _write_unsupported(state_dir, "meta.json")
        manager.set_state("idle")
        assert manager.asset_kind is None


class TestStaticImage:
    """Tests for loading static PNG images."""

    def test_loads_png(self, manager: AnimationManager, temp_base: Path) -> None:
        state_dir = temp_base / "idle"
        state_dir.mkdir()
        _write_png(state_dir, "idle_001.png")

        manager.set_state("idle")
        assert manager.asset_kind == "static"
        assert manager.current_state == "idle"
        pixmap = manager.get_current_pixmap()
        assert not pixmap.isNull()
        assert manager.get_movie() is None

    def test_loads_apng_as_static(self, manager: AnimationManager, temp_base: Path) -> None:
        state_dir = temp_base / "idle"
        state_dir.mkdir()
        _write_png(state_dir, "character.apng")

        manager.set_state("idle")
        assert manager.asset_kind == "static"

    def test_skips_corrupt_image(self, manager: AnimationManager, temp_base: Path) -> None:
        """A corrupt file is skipped; fallback used if nothing else exists."""
        state_dir = temp_base / "idle"
        state_dir.mkdir()
        _write_corrupt(state_dir, "corrupt.png")

        manager.set_state("idle")
        # Corrupt → skipped, no other files → fallback
        assert manager.asset_kind is None

    def test_skips_corrupt_uses_next_valid(
        self, manager: AnimationManager, temp_base: Path
    ) -> None:
        """When a corrupt file is present alongside a valid one, the valid one wins."""
        state_dir = temp_base / "idle"
        state_dir.mkdir()
        _write_corrupt(state_dir, "corrupt.png")
        _write_png(state_dir, "good.png")

        manager.set_state("idle")
        assert manager.asset_kind == "static"

    def test_prefers_gif_over_static(
        self, manager: AnimationManager, temp_base: Path
    ) -> None:
        """Animated GIF is preferred over static images."""
        state_dir = temp_base / "idle"
        state_dir.mkdir()
        _write_png(state_dir, "frame.png")
        # A .gif file must exist for _classify to put it in the "animated" bucket.
        # The content doesn't matter – QMovie is mocked below.
        (state_dir / "walk.gif").write_bytes(b"GIF89a\x00\x00\x00\x00")

        # Mock QMovie to report a valid animated GIF.
        # QMovie is imported *inside* _try_load_animated, so we patch
        # the originating module.
        with mock.patch(
            "PySide6.QtGui.QMovie", autospec=True
        ) as mock_qmovie_cls:
            mock_movie = mock_qmovie_cls.return_value
            mock_movie.isValid.return_value = True
            # Also need a non-null currentPixmap
            from PySide6.QtGui import QPixmap

            mock_movie.currentPixmap.return_value = QPixmap(32, 32)

            manager.set_state("idle")
            assert manager.asset_kind == "animated"
            assert manager.get_movie() is mock_movie


class TestSpritesheet:
    """Tests for sprite-sheet loading."""

    def test_loads_spritesheet(self, manager: AnimationManager, temp_base: Path) -> None:
        state_dir = temp_base / "idle"
        state_dir.mkdir()
        _write_png(state_dir, "spritesheet.png", width=128, height=64)

        manager.set_state("idle")
        assert manager.asset_kind == "spritesheet"
        pixmap = manager.get_current_pixmap()
        assert not pixmap.isNull()

    def test_spritesheet_no_frame_count_assumes_single(
        self, manager: AnimationManager, temp_base: Path
    ) -> None:
        """A spritesheet without metadata is treated as a single-frame static."""
        state_dir = temp_base / "idle"
        state_dir.mkdir()
        _write_png(state_dir, "spritesheet.png")

        manager.set_state("idle")
        # get_current_pixmap should return the whole sheet as a single image
        pixmap = manager.get_current_pixmap()
        assert not pixmap.isNull()
        # It's a single pixmap, not a movie
        assert manager.get_movie() is None


class TestFrameSequence:
    """Tests for numbered frame-sequence loading."""

    def test_loads_frame_sequence(self, manager: AnimationManager, temp_base: Path) -> None:
        state_dir = temp_base / "idle"
        state_dir.mkdir()
        _write_png(state_dir, "frame_001.png")
        _write_png(state_dir, "frame_002.png")
        _write_png(state_dir, "frame_003.png")

        manager.set_state("idle")
        assert manager.asset_kind == "sequence"
        pixmap = manager.get_current_pixmap()
        assert not pixmap.isNull()
        assert manager.get_movie() is None

    def test_single_numbered_file_not_sequence(
        self, manager: AnimationManager, temp_base: Path
    ) -> None:
        """A single ``frame_001.png`` is loaded as static, not sequence."""
        state_dir = temp_base / "idle"
        state_dir.mkdir()
        _write_png(state_dir, "frame_001.png")

        manager.set_state("idle")
        # Only one frame-pattern file → loads as static
        assert manager.asset_kind == "static"

    def test_frame_sequence_skips_corrupt(
        self, manager: AnimationManager, temp_base: Path
    ) -> None:
        """Corrupt frames in a sequence are skipped."""
        state_dir = temp_base / "idle"
        state_dir.mkdir()
        _write_png(state_dir, "frame_001.png")
        _write_corrupt(state_dir, "frame_002.png")
        _write_png(state_dir, "frame_003.png")

        manager.set_state("idle")
        assert manager.asset_kind == "sequence"
        # Should have 2 frames (the corrupt one skipped)
        frames = manager._current_asset
        assert isinstance(frames, list)
        assert len(frames) == 2

    def test_mixed_files_only_frames_in_sequence(
        self, manager: AnimationManager, temp_base: Path
    ) -> None:
        """Non-frame files in the same dir are excluded from the sequence."""
        state_dir = temp_base / "idle"
        state_dir.mkdir()
        _write_png(state_dir, "frame_001.png")
        _write_png(state_dir, "frame_002.png")
        _write_png(state_dir, "logo.png")  # not a frame

        manager.set_state("idle")
        assert manager.asset_kind == "sequence"
        frames = manager._current_asset
        assert isinstance(frames, list)
        assert len(frames) == 2  # logo excluded


class TestStateSwitching:
    """Tests for switching between animation states."""

    def test_switch_between_states(
        self, manager: AnimationManager, temp_base: Path
    ) -> None:
        idle_dir = temp_base / "idle"
        idle_dir.mkdir()
        _write_png(idle_dir, "idle_frame.png")

        drink_dir = temp_base / "drink"
        drink_dir.mkdir()
        _write_png(drink_dir, "drink_frame.png")

        manager.set_state("idle")
        assert manager.current_state == "idle"
        assert manager.asset_kind == "static"
        idle_asset = manager._current_asset

        manager.set_state("drink")
        assert manager.current_state == "drink"
        assert manager.asset_kind == "static"
        drink_asset = manager._current_asset

        # Assets should be different objects
        assert idle_asset is not drink_asset

    def test_switch_to_missing_state(
        self, manager: AnimationManager, temp_base: Path
    ) -> None:
        idle_dir = temp_base / "idle"
        idle_dir.mkdir()
        _write_png(idle_dir, "idle_frame.png")

        manager.set_state("idle")
        assert manager.asset_kind == "static"

        manager.set_state("missing")
        assert manager.current_state == "missing"
        assert manager.asset_kind is None  # fallback


class TestEnvironmentVariable:
    """Tests for ANIMATIONS_BASE_PATH environment variable."""

    def test_env_overrides_base_path(self, temp_base: Path) -> None:
        custom = temp_base / "custom_anims"
        custom.mkdir()
        state_dir = custom / "wave"
        state_dir.mkdir()
        _write_png(state_dir, "wave.png")

        with mock.patch.dict(
            os.environ, {"ANIMATIONS_BASE_PATH": str(custom)}, clear=True
        ):
            mgr = AnimationManager()
            mgr.set_state("wave")
            assert mgr.asset_kind == "static"

    def test_env_nonexistent_dir_falls_back(self, temp_base: Path) -> None:
        with mock.patch.dict(
            os.environ,
            {"ANIMATIONS_BASE_PATH": "/nonexistent/path"},
            clear=True,
        ):
            mgr = AnimationManager()
            mgr.set_state("idle")
            assert mgr.asset_kind is None  # fallback


class TestPilToQPixmap:
    """Tests for the _pil_to_qpixmap converter."""

    def test_converts_valid_image(self) -> None:
        img = Image.new("RGBA", (32, 32), (100, 200, 50, 255))
        pixmap = _pil_to_qpixmap(img)
        assert not pixmap.isNull()
        assert pixmap.width() == 32
        assert pixmap.height() == 32

    def test_converts_placeholder(self, manager: AnimationManager) -> None:
        pixmap = _pil_to_qpixmap(manager._placeholder)
        assert not pixmap.isNull()
        assert pixmap.width() == 64
        assert pixmap.height() == 64


class TestCorruptDirectory:
    """Edge-case tests for unreadable directories."""

    def test_state_is_file_not_directory(
        self, manager: AnimationManager, temp_base: Path
    ) -> None:
        """When the state 'directory' is actually a file, fall back."""
        (temp_base / "idle").write_text("i am a file", encoding="utf-8")
        manager.set_state("idle")
        assert manager.asset_kind is None
