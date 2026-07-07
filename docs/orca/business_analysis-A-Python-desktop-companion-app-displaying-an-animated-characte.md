# business_analysis: A Python desktop companion app displaying an animated character, always-on-top, borderless, draggable, with system tray 

Status: draft

## outOfScope

- Generating, sourcing, or including actual animation artwork or Lottie files.
- Lottie animation rendering in the MVP.
- Cloud sync, backup, or remote settings.
- Multi-language localization.
- Multi-monitor-aware positioning or snapping.
- In-app purchase or payment integration.
- Advanced notification action buttons or custom UI in the reminder popup beyond the message.
- Audio playback of custom sound files.
- Animated transitions between states (direct swap).

## assumptions

- The user will provide a logo.png for the default placeholder; if missing, a simple colored shape is generated.
- The popup auto-dismisses after 5 seconds; no user interaction beyond minimizing.
- Notification sound will use the system’s default notification sound with an on/off toggle, not a custom audio file.
- Reminder intervals are in minutes; default is 60.
- The app does not remember window position across sessions.
- Launch on startup integration will be implemented for the target OS(es) using OS-specific mechanisms.
- The app initially supports dark theme toggle with a default dark style.

## userStories

- As a user, I want an always-on-top, borderless character window on my desktop so I can see it while working.
- As a user, I want to drag the window to any screen location.
- As a user, I want the app minimized to the system tray with quick access.
- As a user, I want to receive periodic drink water reminders including a visual drink animation (if available), a native notification, and a popup.
- As a user, I want to configure reminder interval, theme, animation speed/scale, sound, and toggle reminders.
- As a user, I want the character to display different animation states (idle, drink, wave, happy, sleep, work, think, celebrate, custom).
- As a user, I want to add new animations simply by placing files in specific folders (e.g., GIF, PNG sequence, sprite sheet) and the app detects and uses them automatically.
- As a user, I want the app to work with placeholder/logo image if no animation files exist.

## scopeAnswers

- What operating system(s) must be supported (Windows, macOS, Linux)? This affects tray behavior, startup registration, and notification APIs.
Answer: windows

## scopeQuestions

- What operating system(s) must be supported (Windows, macOS, Linux)? This affects tray behavior, startup registration, and notification APIs.

## visualReferences


## acceptanceCriteria

- The app window appears transparent (except character), always on top, borderless, draggable.
- System tray icon is present, with right-click menu including Show, Settings, Quit.
- Reminder triggers at configurable interval; plays drink animation if available; shows native notification '💧 Time to Drink Water'; shows a popup 'Stay hydrated!' that auto-dismisses after a few seconds; returns to idle afterwards.
- Settings window (or dialog) allows changing interval, animation speed (fps multiplier), scale (size multiplier), notification sound toggle, enable/disable reminders, theme (dark/light).
- Animation manager scans /assets/animations/ subfolders; for any state folder, if containing files (e.g., frame_001.png, frame.gif, sprite sheet with json), it loads and plays them in sequence if multiple frames, or displays single static PNG.
- When an animation is missing, the default logo.png from /assets/ is displayed (or placeholder generated).
- Application runs without errors even when /assets/animations/ folders are empty.
- Settings are saved and loaded from a config.json file.
- Animation scale and speed settings apply to all animations globally.
- The system supports adding new states by dropping a new folder; it becomes available in the app without code changes.
