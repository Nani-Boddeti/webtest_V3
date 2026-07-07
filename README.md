# ORCA Companion

A Windows desktop companion application built with PySide6. Displays a transparent, borderless, always-on-top mascot window with system-tray integration.

## Prerequisites

- Python 3.10 or later
- pip
- Windows, macOS, or Linux (system tray availability varies)

## Installation

```bash
# Clone the repository, then:
pip install -r requirements.txt
```

## Environment

Copy `.env.example` to `.env` (no secrets required for local development):

```bash
cp .env.example .env
```

## Build / Run

```bash
# Start the application
python src/main.py
```

The mascot window will appear as a transparent overlay. Right-click the system-tray icon for *Settings* and *Exit*.

## Development

```bash
# Run the test suite
pytest tests/ -v

# Lint the source
pylint src/ tests/
```

## Project Structure

```
src/
  main.py          # Entry point – creates QApplication, OrcaApp, SystemTray
  app.py           # OrcaApp – transparent, draggable QMainWindow with logo
  system_tray.py   # SystemTray – tray icon with Settings / Exit menu
tests/
  test_app.py      # Unit tests for OrcaApp window creation
  test_system_tray.py  # Unit tests for system-tray functionality
assets/
  logo.png         # Placeholder mascot image
```

## Port / URL

Not applicable – this is a desktop application. No HTTP server is started.

## Platform Notes

- **Windows**: Full system-tray support. The window stays on top of other applications.
- **macOS**: System tray may require additional permissions. The app uses `Qt.Tool` flag.
- **Linux**: Requires a system-tray implementation (e.g., `trayer`, GNOME extension).
