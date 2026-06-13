# business_analysis: An AI-powered booking mobile app with a single-location admin panel for MVP. Customers interact with a chatbot to book, 

Status: draft

## outOfScope

- Multi-location support.
- Multi-admin roles or admin management.
- Email or SMS notifications.
- Payment processing.
- Rate limiting (may be added later).
- Configurable fallback prompt text (fixed for MVP).
- Cross-session booking history retrieval without a unique personal identifier (only reference ID lookup).
- Customer login/accounts.
- Real-time analytics beyond daily count charts (e.g., revenue, trends are future scope).
- UI for admin to edit existing bookings other than cancel/reschedule.
- Multi-language support (English only).
- Integration with external calendars (Google Calendar, iCal).
- Advanced AI fallback with live agent handoff.
- Persistent confirmation card across sessions or devices.

## assumptions

- The mobile app frontend and admin panel are part of a single codebase; both share the same backend API.
- Session persistence: the in-chat confirmation card relies on a session identifier stored in the browser’s local storage (mobile app) and is not cross-device persistent.
- Booking history for a session is limited to bookings created within that anonymous session; for retrieval across devices/sessions, only reference ID + name is allowed.
- Admin authentication is handled with a single account; credentials are set via environment variable at deployment and hashed with bcrypt.
- Business hours and service configurations are stored in the database; changes apply to new bookings only. Existing bookings are grandfathered.
- Admin daily analytics chart defaults to counting bookings by appointment date for the current calendar month.
- AI model for intent extraction is a self-hosted Ollama instance during production; for MVP it may be simulated/mocked, but the integration dependency is listed for production readiness.
- Backend uses PostgreSQL for all data storage; no external notification services (email/SMS) are integrated.
- The mobile app is a single user-facing interface; no separate customer portal.
- No authentication or accounts for customers; all interactions are anonymous except for the required name and optional phone/email during booking.

## userStories

- As a customer, I want to chat with an AI to book an appointment using natural language, so that I can quickly schedule without navigating complex forms.
- As a customer, I want to cancel an existing booking via chat by providing my reference ID and name, so that I can free up a slot I no longer need.
- As a customer, I want to reschedule a booking by providing my reference ID and name, so that I can change the appointment time while keeping my details.
- As a customer, I want to retrieve my booking confirmation by reference ID and name, so that I can access details if I lose the in-chat card.
- As a customer, I want to see a list of my past bookings from my current session (or retrieve a single booking by reference ID), so that I can review my history.
- As an admin, I want to configure available services (name and duration) and set daily business hours, so that the system only offers valid slots.
- As an admin, I want to set a maximum advance booking period and a minimum cancellation lead time, so that I can manage scheduling constraints.
- As an admin, I want to view all bookings in a list and manually cancel or reschedule them, overriding lead-time limits when necessary, so that I can handle exceptions.
- As an admin, I want to review AI conversation logs to understand customer interactions and diagnose intent extraction issues.
- As an admin, I want to view a daily analytics chart showing booking counts per appointment date, so that I can monitor demand patterns.

## scopeQuestions


## acceptanceCriteria

- AI intent extraction: given a test set of at least 100 diverse natural-language booking, cancellation, and rescheduling phrases, the system extracts the correct intent and entities (service, date, time, reference ID, name) with ≥90% accuracy.
- Booking slot closing: the latest possible appointment start time is (closing_time - service_duration). Example: service duration 60 mins, closing 17:00 → latest start 16:00.
- The system prevents double-booking of the same time slot for the same resource.
- Booking reference ID is generated as 'BK-' followed by 4 random uppercase letters (e.g., BK-XYZW) and is unique.
- Confirmation after booking is displayed as a non-dismissable card within the chat; the card persists for the duration of the chat session but is lost on page refresh or clearance of session data.
- A booking can be retrieved by entering the reference ID and matching customer name; if name mismatches or reference ID invalid, appropriate error message is shown.
- Customer self-service cancellation and rescheduling are blocked if the current time is within the admin-configured min cancellation lead time before the appointment start (e.g., lead time 24h, appointment tomorrow at 10:00 → cannot cancel/reschedule after today 10:00).
- Customers cannot book an appointment with a start date/time in the past. Attempts are rejected with a clear message.
- Customers cannot book an appointment beyond the admin-configured max advance booking period (e.g., 30 days from now). Attempts are rejected with a clear message.
- When rescheduling via chat, the cancellation lead time applies: reschedule is prevented if within lead time (treated same as cancellation). The new time must also be valid (future, within advance period, within business hours, not conflicting).
- Admin can manually override the cancellation lead time and max advance booking when rescheduling or cancelling bookings from the admin panel, with a confirmation step.
- Admin changes to business hours, service durations, or service availability do not automatically cancel existing bookings; existing bookings are preserved. If a service is removed, existing bookings for that service remain but no new ones can be created.
- Admin login uses basic authentication; credentials are stored as a bcrypt hash (no plaintext) with no default password. Initial admin password is set via a secure environment variable or setup script.
- Daily analytics chart displays a bar graph of booking counts by appointment date (not creation date). Default view shows the current month (including past and future dates with bookings). Admin can filter by date range and service.
- AI fallback after two consecutive failed intent extractions in the same conversation triggers a fixed prompt offering general support and instructing the user to try again or contact support.
- Chat session tracking uses an anonymous session ID stored in browser local storage (mobile app) or cookie, lasting until cleared. The confirmation card and any session-scoped data are lost on refresh but the booking can be retrieved via reference ID.
- Booking history: during a single chat session, a customer can ask for their booking history, which lists all bookings made from that session. For cross-session retrieval, only single booking query by reference ID and name is supported.
- Admin can view AI conversation logs including raw user messages and extracted intents for auditing and debugging.
- Admin panel is a separate web application accessible from a browser, not embedded in the mobile app.
- The AI intent extraction test set is maintained as a versioned file in the code repository and evaluated automatically in the CI/CD pipeline to ensure ongoing accuracy.
- Rescheduling a booking retains the original customer name; only the appointment time is updated.
- Overriding admin constraints: when admin manually reschedules or cancels, the system allows the action even if it violates business hours or lead time (with a warning).
- Rate limiting and configurability of the fallback prompt are out-of-scope for MVP.
