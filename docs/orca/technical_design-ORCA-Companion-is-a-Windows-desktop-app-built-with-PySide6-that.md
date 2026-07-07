# technical_design: ORCA Companion is a Windows desktop app built with PySide6 that displays a transparent, always-on-top mascot window, pro

Status: draft

## riskNotes

- Low risk: the requirements are well-scoped and no external integrations are needed. The main risk is ensuring correct window transparency and always-on-top behavior across different Windows 10/11 configurations, which can be mitigated by testing on multiple environments. The animation manager must gracefully handle missing or corrupted asset files.

## backendPlan

- No server-side backend required. All logic runs locally in the Python desktop process.

## agentHandoff

- All tasks are suitable for a single Python developer experienced with PySide6 and Windows desktop development. No specialized sub-teams required. The reviewer must verify via pytest/pylint and check file existence; they cannot perform UI testing.

## databasePlan

- No database. User configuration is stored as a plain JSON file in the user's app data directory.

## frontendPlan

- The frontend is a PySide6 desktop GUI with: a transparent, borderless, always-on-top QMainWindow containing a QLabel for the character image; a QSystemTrayIcon with a context menu (Settings, Exit); a QDialog for settings. Theme support uses dark/light style sheets. Window dragging is implemented via mouse press/move events.

## testStrategy

- Each task includes pytest unit tests for its module. The final integration task adds a simulation test that instantiates the full app and verifies signal/slot connections and component states. Linting (pylint) is enforced on all source files. The reviewer must run `pytest` and `pylint src tests` to validate each task. No GUI or manual visual verification is required.

## dependencyPlan

- Python 3.12+, PySide6, Pillow, and optionally win10toast (or fallback to PySide6 notifications). All dependencies specified in requirements.txt. The app will be installed via a virtual environment and run from source; no packaging is required at this stage.

## lowLevelDesign

- The application follows a modular architecture: main entry point (main.py) initializes the QApplication and launches the main controller (app.py). App manages the TransparentWindow (a borderless, transparent, always-on-top QMainWindow with a QLabel for the pet image), SystemTray (QSystemTrayIcon with context menu), ReminderManager (QTimer-based, configurable interval, triggers notifications via win10toast or QSystemTrayIcon::showMessage), AnimationManager (discovers assets in assets/animations/<state>/ using PIL/Pillow and QMovie, supports PNG, GIF, APNG, sprite sheets, frame sequences, with placeholder fallback), and ConfigManager (reads/writes JSON to %APPDATA%/ORCA Companion/config.json). The SettingsDialog (QDialog) allows adjustment of interval, theme, animation speed/scale, sound, and startup behavior. Components communicate via signal/slot connections. Launch on startup is handled via Windows registry (winreg) if enabled in config.

## blockedOnIntegrations


## implementationRoadmap

- 1. Scaffold the PySide6 app with transparent window, tray icon, and placeholder image. 2. Implement the AnimationManager to load and cycle character states. 3. Add the reminder system with timer and notifications. 4. Create the settings UI and JSON config logic. 5. Integrate components, add launch on startup, and polish the application.

## implementationApproach

- Develop modularly with TDD. Start with project scaffolding and the core window/tray, then build independent components (animation, reminders, settings), and finally integrate all parts. Each task includes unit tests and linting to ensure code quality before proceeding.
