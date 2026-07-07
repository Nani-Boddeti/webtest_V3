"""Animation manager for ORCA Companion.

Handles loading and switching character animations based on state.
Scans ``{base_path}/{state_name}/`` directories for supported image
assets and loads the first valid one found, falling back to a generated
placeholder when no assets are available.
"""

from __future__ import annotations

import io
import logging
import os
from pathlib import Path
from typing import List, Optional, Sequence, Union

from PIL import Image, UnidentifiedImageError

logger = logging.getLogger(__name__)

# ---- Supported file types -------------------------------------------------
_ANIMATED_EXTS: frozenset[str] = frozenset({".gif"})
_STATIC_EXTS: frozenset[str] = frozenset(
    {".png", ".apng", ".jpg", ".jpeg", ".bmp", ".webp"}
)
_SPRITESHEET_NAMES: frozenset[str] = frozenset(
    {"spritesheet", "sprite_sheet", "sprite-sheet", "sprites"}
)

# Frame-sequence detection: files whose stem ends with a numeric suffix
# separated by underscore, e.g.  frame_001, img_0001, walk_01.
_FRAME_PATTERNS: tuple[str, ...] = ("frame_", "img_", "walk_", "idle_", "run_")


# ============================================================================
# Helpers
# ============================================================================


def _is_frame_sequence(stems: Sequence[str]) -> bool:
    """Return *True* when the stems look like a numbered frame sequence."""
    return len(_pick_frame_stems(stems)) >= 2


def _pick_frame_stems(stems: Sequence[str]) -> list[str]:
    """Return the subset of *stems* that match a frame-sequence pattern."""
    result: list[str] = []
    for stem in stems:
        for prefix in _FRAME_PATTERNS:
            if stem.startswith(prefix):
                suffix = stem[len(prefix) :]
                if suffix.isdigit():
                    result.append(stem)
                    break
    return result


def _classify(path: Path) -> str:
    """Classify a file path into its asset kind.

    Returns one of ``'animated'``, ``'spritesheet'``, ``'static'``,
    or ``'unknown'``.
    """
    stem = path.stem.lower()
    ext = path.suffix.lower()

    if ext in _ANIMATED_EXTS:
        return "animated"

    if stem in _SPRITESHEET_NAMES:
        return "spritesheet"

    if ext in _STATIC_EXTS:
        return "static"

    return "unknown"


def _pil_to_qpixmap(image: Image.Image) -> "QPixmap":
    """Convert a Pillow *Image* to a QPixmap without using ImageQt."""
    from PySide6.QtGui import QPixmap

    buf = io.BytesIO()
    # Ensure we save in a format QPixmap can ingest
    fmt = image.format or "PNG"
    image.save(buf, format=fmt)
    buf.seek(0)
    pixmap = QPixmap()
    pixmap.loadFromData(buf.read())
    return pixmap


# ============================================================================
# AnimationManager
# ============================================================================


class AnimationManager:
    """Load and manage character animation assets for named states.

    Parameters
    ----------
    base_path:
        Root directory containing per-state animation folders.
        Overridable via the ``ANIMATIONS_BASE_PATH`` environment variable.
    """

    # Default size of the generated placeholder (square).
    PLACEHOLDER_SIZE: int = 64
    # Colour used for the placeholder (RGBA).
    PLACEHOLDER_COLOUR: tuple[int, int, int, int] = (30, 30, 200, 255)

    def __init__(self, base_path: str = "assets/animations") -> None:
        self._base_path = Path(
            os.environ.get("ANIMATIONS_BASE_PATH", base_path)
        )
        self._current_state: Optional[str] = None
        self._current_asset: Union[None, Image.Image, "QMovie", List[Image.Image]] = (
            None
        )
        self._asset_kind: Optional[str] = None
        self._placeholder: Image.Image = self._generate_placeholder()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def set_state(self, state_name: str) -> None:
        """Switch to the animation for *state_name*.

        Scans ``{base_path}/{state_name}/`` for the best available asset,
        loading it into memory.  Falls back to the placeholder if no valid
        asset is found.
        """
        self._current_state = state_name
        state_dir = self._base_path / state_name

        if not state_dir.is_dir():
            logger.debug("State directory %s not found – using placeholder.", state_dir)
            self._use_placeholder()
            return

        try:
            entries = list(state_dir.iterdir())
        except OSError as exc:
            logger.warning("Cannot read state dir %s: %s – using placeholder.", state_dir, exc)
            self._use_placeholder()
            return

        files = [p for p in entries if p.is_file()]
        if not files:
            logger.debug("State directory %s is empty – using placeholder.", state_dir)
            self._use_placeholder()
            return

        self._load_best_asset(files, state_dir)

    def get_current_pixmap(self) -> "QPixmap":
        """Return a ``QPixmap`` representing the current frame.

        * Static / sprite-sheet / placeholder images → rasterised pixmap.
        * Frame sequences → first frame.
        * Animated GIF (QMovie) → the movie's current pixmap.
        """
        if self._asset_kind == "animated":
            # QMovie – return the current frame
            movie: "QMovie" = self._current_asset  # type: ignore[assignment]
            pix = movie.currentPixmap()
            if not pix.isNull():
                return pix
            # If movie hasn't started yet, jump to frame 0
            movie.jumpToFrame(0)
            return movie.currentPixmap()

        if self._asset_kind == "sequence":
            frames: list[Image.Image] = self._current_asset  # type: ignore[assignment]
            if frames:
                return _pil_to_qpixmap(frames[0])

        if self._asset_kind in ("static", "spritesheet"):
            img: Image.Image = self._current_asset  # type: ignore[assignment]
            return _pil_to_qpixmap(img)

        # Fallback to placeholder
        return _pil_to_qpixmap(self._placeholder)

    def get_movie(self) -> Optional["QMovie"]:
        """Return the ``QMovie`` when the current asset is an animated GIF.

        Returns ``None`` for static images, sequences, spritesheets, and
        the placeholder.
        """
        if self._asset_kind == "animated":
            return self._current_asset  # type: ignore[return-value]
        return None

    @property
    def current_state(self) -> Optional[str]:
        """The most-recently requested state name."""
        return self._current_state

    @property
    def asset_kind(self) -> Optional[str]:
        """Kind of the currently loaded asset.

        One of ``'animated'``, ``'static'``, ``'spritesheet'``,
        ``'sequence'``, or ``None`` when nothing has been loaded yet.
        """
        return self._asset_kind

    # ------------------------------------------------------------------
    # Placeholder
    # ------------------------------------------------------------------

    @classmethod
    def _generate_placeholder(cls) -> Image.Image:
        """Create a solid-colour placeholder image."""
        return Image.new(
            "RGBA",
            (cls.PLACEHOLDER_SIZE, cls.PLACEHOLDER_SIZE),
            cls.PLACEHOLDER_COLOUR,
        )

    def _use_placeholder(self) -> None:
        """Reset internal state to the placeholder."""
        self._current_asset = None
        self._asset_kind = None

    # ------------------------------------------------------------------
    # Asset loading
    # ------------------------------------------------------------------

    def _load_best_asset(self, files: list[Path], state_dir: Path) -> None:
        """Pick the best asset from *files* and load it.

        Priority order:
        1. Animated GIF
        2. Frame sequence (numbered PNGs)
        3. Sprite sheet
        4. Static image (first found)
        """
        # Build lookup by kind
        by_kind: dict[str, list[Path]] = {"animated": [], "spritesheet": [], "static": []}
        for f in files:
            kind = _classify(f)
            if kind == "unknown":
                continue
            by_kind.setdefault(kind, []).append(f)

        # 1) Animated GIF
        if by_kind.get("animated"):
            path = by_kind["animated"][0]
            if self._try_load_animated(path):
                return

        # 2) Frame sequence – group files whose stems match frame patterns
        static_stems = sorted({p.stem for p in by_kind.get("static", [])})
        if _is_frame_sequence(static_stems):
            frame_stems = _pick_frame_stems(static_stems)
            seq_files = sorted(
                [p for p in by_kind["static"] if p.stem in frame_stems],
                key=lambda p: p.stem,
            )
            if self._try_load_sequence(seq_files):
                return

        # 3) Sprite sheet
        if by_kind.get("spritesheet"):
            path = by_kind["spritesheet"][0]
            if self._try_load_static(path, "spritesheet"):
                return

        # 4) First static image
        for path in by_kind.get("static", []):
            if self._try_load_static(path, "static"):
                return

        # Nothing worked – fall back
        logger.debug("No loadable asset found in %s – using placeholder.", state_dir)
        self._use_placeholder()

    def _try_load_animated(self, path: Path) -> bool:
        """Attempt to load *path* as a ``QMovie`` (animated GIF)."""
        from PySide6.QtGui import QMovie

        try:
            movie = QMovie(str(path))
            if not movie.isValid():
                logger.warning("QMovie reports invalid file: %s", path)
                return False
            # Jump to first frame to populate currentPixmap
            movie.jumpToFrame(0)
            self._current_asset = movie
            self._asset_kind = "animated"
            logger.debug("Loaded animated GIF: %s", path)
            return True
        except Exception as exc:
            logger.warning("Failed to load animated GIF %s: %s", path, exc)
            return False

    def _try_load_sequence(self, paths: list[Path]) -> bool:
        """Attempt to load a frame sequence from *paths*."""
        frames: list[Image.Image] = []
        for p in paths:
            try:
                img = Image.open(p)
                img.load()
                frames.append(img)
            except (UnidentifiedImageError, OSError, ValueError) as exc:
                logger.warning("Skipping corrupt/unreadable frame %s: %s", p, exc)
                continue

        if not frames:
            return False

        self._current_asset = frames
        self._asset_kind = "sequence"
        logger.debug("Loaded frame sequence: %d frames from %s", len(frames), paths[0].parent)
        return True

    def _try_load_static(self, path: Path, kind: str = "static") -> bool:
        """Attempt to load *path* as a static Pillow image."""
        try:
            img = Image.open(path)
            img.load()  # force decode so corrupt files surface here
            self._current_asset = img
            self._asset_kind = kind
            logger.debug("Loaded %s image: %s", kind, path)
            return True
        except (UnidentifiedImageError, OSError, ValueError) as exc:
            logger.warning("Skipping corrupt/unreadable image %s: %s", path, exc)
            return False
