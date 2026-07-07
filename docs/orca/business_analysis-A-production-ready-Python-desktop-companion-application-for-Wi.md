# business_analysis: A production-ready Python desktop companion application for Windows that displays an animated character with a hydration

Status: draft

## outOfScope

- Generating or providing any artwork, animations, or sound files.
- Support for macOS or Linux.
- Network or cloud-based features (sync, online account, analytics).
- Multi-language support.
- Advanced animation authoring tools or in-app asset editing.
- Mobile or web versions.
- Integration with external health tracking or notification services.
- Complex character logic beyond state transitions triggered by reminders or future user-defined events.

## tlFeedback

- Requirements are clear, specific, and actionable. User stories and acceptance criteria are well-defined with domain-specific actors and outcomes. No blocking gaps identified.

## assumptions

- Target platform is Windows 10/11 only.
- The application will use PySide6 for the GUI, system tray, and native notifications (via Windows API or QSystemTrayIcon).
- Notification sounds are provided by the user or a default system sound is used if not specified.
- The configuration file is stored in a standard user directory (e.g., %APPDATA%\ORCA Companion\config.json).
- Default reminder interval is 60 minutes.
- Default animation speed is 100ms per frame; scale is 1.0.
- The application will not bundle any third-party animation playback libraries for Lottie by default; extension points will be provided.
- The placeholder image is a static PNG (assets/logo.png) included with the source.
- The user may manually edit the JSON configuration file; the app will gracefully handle missing or malformed values.

## userStories

- As a user, I want the ORCA companion to appear as a transparent, borderless, always-on-top window on my desktop so that it integrates seamlessly with my workspace.
- As a user, I want to drag the companion window to reposition it anywhere on the screen for convenience.
- As a user, I want the application to minimize to the system tray and provide quick access to settings and quit options.
- As a user, I want to be reminded to drink water at configurable intervals, with a visual animation (or placeholder) and a desktop notification.
- As a user, I want the companion to automatically switch between different animation states (idle, drink, wave, etc.) when triggered by reminders or user interaction.
- As a user, I want to add new character animations by simply placing asset files into predefined folders without modifying any code.
- As a user, I want the application to work correctly even if no animation files are provided, falling back to a default logo or placeholder.
- As a user, I want to configure reminder intervals, theme (dark mode), animation speed/scale, notification sound, and enable/disable reminders through a settings interface.
- As a user, I want settings to persist across application restarts in a JSON configuration file.
- As a user, I want the application to support future expansion for additional animation formats like Lottie without rewriting core logic.

## scopeQuestions


## tlReviewStatus

- Approved by Tech Lead

## tlChangeRequests


## visualReferences


## acceptanceCriteria

- The main window is transparent, borderless, always on top, and draggable.
- The window displays a default ORCA logo or placeholder when no animation assets are found.
- The system tray icon is present, with a context menu containing at least 'Settings' and 'Exit'.
- Reminders fire at the configured interval, triggering the 'drink' animation state and a native desktop notification with the text '💧 Time to Drink Water'.
- After the reminder, the animation returns to the 'idle' state (or placeholder if no idle assets exist).
- The Animation Manager auto-detects animation assets placed in `assets/animations/<state>/` folders for states like idle, drink, wave, sleep, happy, work, think, celebrate, and any custom folder added later.
- Supported animation formats are static PNG, animated GIF, APNG, sprite sheets, and PNG frame sequences, with a clear path for future Lottie support.
- Configuration settings (interval, theme, launch on startup, animation speed/scale, notification sound, enable/disable reminders) are loaded from a JSON file at startup and saved on changes.
- Launch on startup is implemented via Windows registry or startup folder (configurable).
- The application runs without errors on Python 3.12+ on Windows 10/11 with PySide6 installed.
