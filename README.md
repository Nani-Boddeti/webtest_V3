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

The mascot window will appear as a transparent overlay. Right-click the system-tray icon for *Show/Hide*, *Settings*, and *Exit*.  Double-click the tray icon to toggle window visibility.

## Features

- **Transparent mascot window**: Always-on-top, borderless, draggable
- **System tray**: Quick access to Show/Hide, Settings, and Exit; double-click toggles window
- **Theme support**: Dark and light themes
- **Animation states**: Idle, drink, wave, happy, sleep, work, think, celebrate, custom
- **Hydration reminders**: Configurable interval with desktop notifications
- **Configurable settings**: Interval, theme, animation speed, scale, sound, and more
- **Launch on startup**: Optional Windows registry integration
- **Cross-platform**: Runs on Windows, macOS, and Linux (system tray varies)

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
  main.py            # Entry point – creates QApplication, wires all components
  app.py             # OrcaApp – transparent, draggable QMainWindow with mascot
  animation.py       # AnimationManager – loads and manages character animations
  config.py          # ConfigManager – JSON-backed user settings
  reminders.py       # ReminderManager – periodic hydration reminders
  settings_dialog.py # SettingsDialog – modal dialog for editing preferences
  startup.py         # Windows start-up registration (winreg)
  system_tray.py     # SystemTray – tray icon with Show/Hide, Settings, Exit menu
tests/
  test_app.py              # Unit tests for OrcaApp
  test_animation.py        # Unit tests for AnimationManager
  test_integration.py      # Full-session integration tests
  test_reminders.py        # Unit tests for ReminderManager
  test_settings_dialog.py  # Unit tests for SettingsDialog
  test_startup.py          # Unit tests for start-up registration
  test_system_tray.py      # Unit tests for SystemTray
assets/
  logo.png           # Placeholder mascot image and tray icon
```

## Port / URL

Not applicable – this is a desktop application. No HTTP server is started.

## Platform Notes

- **Windows**: Full system-tray support. The window stays on top of other applications.
- **macOS**: System tray may require additional permissions. The app uses `Qt.Tool` flag.
- **Linux**: Requires a system-tray implementation (e.g., `trayer`, GNOME extension).
