# business_analysis: An AI-powered booking mobile app with an admin panel. Customers interact with a chatbot to book, cancel, or reschedule a

Status: draft

## outOfScope

- Email and SMS notifications
- Payment processing
- Multi-location support
- Multi-admin roles
- Customer accounts with passwords
- Real-time calendar sync with external providers
- Internationalization / multi-language support
- Production-level rate limiting
- Automated conflict resolution on admin configuration changes

## assumptions

- Booking slots align to 30-minute intervals; service durations are multiples of 30 minutes.
- System time is server time for all constraint calculations.
- Chat is text-only, rendered in a mobile app webview or similar.
- AI intent extraction uses a self-hosted LLM (Ollama) with a dedicated intent classifier prompt.
- The test set for AI accuracy is manually curated and stored in version control.
- Rate limiting on chat messages is not implemented for MVP.
- Admin configuration changes do not automatically cascade to bookings; manual admin review required.
- Customer chat session is anonymous; no authentication or persistent user accounts.
- Admin panel uses a simple charting library to render analytics from database queries.

## userStories

- As a customer, I want to chat with the AI to book a service so that I can schedule an appointment.
- As a customer, I want to cancel a booking via chat so that I can free up my slot.
- As a customer, I want to reschedule a booking via chat so that I can move my appointment.
- As a customer, I want to retrieve my booking details using the reference ID and my name so that I can access my confirmation after session loss.
- As a customer, I want to see my booking history within the current chat session so that I can review my upcoming appointments.
- As an admin, I want to configure services (name, duration) and business hours (daily open/close, 30-min slots) so that the system reflects my availability.
- As an admin, I want to set max advance booking period and min cancellation lead time so that I control booking policies.
- As an admin, I want to view and manage all bookings (view, cancel, reschedule) so that I can handle exceptions and overrides.
- As an admin, I want to review AI conversation logs so that I can monitor interactions.
- As an admin, I want to view a daily analytics chart so that I can track booking trends.
- As an admin, I want a single admin login with basic auth so that only I can access the admin panel.

## scopeQuestions

- SQ1: What are the criteria for a 'failed intent extraction' (confidence threshold, missing intent) that triggers AI fallback?
- SQ2: Is there a single bookable resource or can multiple services run in parallel without overlap?
- SQ3: What is the boundary behavior for cancellation lead time when set to 0? Can user cancel exactly at appointment start?
- SQ4: What is the latest allowed booking start time relative to closing time?
- SQ5: Can admin override business hours and cancellation lead time when manually rescheduling/cancelling?
- SQ6: How do admin configuration changes (services, durations, hours) impact existing bookings?
- SQ7: Is the admin panel a separate web app or part of the mobile app? What is the login flow?
- SQ8: What metric does the daily analytics chart display beyond 'booking counts'?
- SQ9: How is the AI intent extraction test set maintained and evaluated for 90% accuracy?
- SQ10: How is booking history retrieval secured if only name is used?
- SQ11: How is the max advance booking enforced during customer booking?
- SQ12: What is the definition of 'booking counts per day' in analytics (appointment date or creation date)?
- SQ13: Should the system reject bookings for past dates/times?
- SQ14: Does the cancellation lead time apply to rescheduling as well?
- SQ15: How are admin credentials initially set and securely stored?
- SQ16: What happens to existing bookings when admin changes business hours?
- SQ17: What is the chat session tracking mechanism and its persistence?
- SQ18: Can admin override cancellation/rescheduling lead time restrictions when managing bookings manually?
- SQ19: Should the analytics chart include future booked dates?
- SQ20: What error should be shown when rescheduling exceeds max advance booking?
- SQ21: What are the security requirements for admin credentials (hashing, default password)?

## acceptanceCriteria

- BC-REF: Booking reference ID format is 'BK-' followed by 4 uppercase letters.
- CONFIRM-CARD: Confirmation is a non-dismissable in-chat card persisting for the session; lost on refresh but retrievable via reference ID and name.
- LATEST-START: Latest start time for a booking is (closing time - service duration). System rejects if end time would exceed business hours.
- ADMIN-OVERRIDE: Admin can reschedule or cancel any booking regardless of business hours, lead time, or max advance constraints. UI shows warning and requires confirmation.
- CONFIG-PRESERVE: Admin configuration changes (services, durations, hours) do not retroactively affect existing bookings; they remain valid. Admin must manually resolve conflicts.
- ADMIN-PLATFORM: Admin panel is a separate web app accessed via browser, using HTTP Basic Authentication over HTTPS.
- ANALYTICS-METRIC: Daily analytics chart shows number of bookings per calendar day (appointment date), filterable by service. Includes past, present, and future dates with bookings.
- FALLBACK-CONFIG: After two consecutive failed intent extractions (confidence < configurable threshold, default 0.7, or missing intent), AI transitions to a configurable fallback prompt.
- AI-TEST-SET: A versioned test set of 500 utterances is maintained; AI intent extraction must achieve >=90% exact match accuracy on this set before release.
- BOOKING-HISTORY: Session-based booking history shows all bookings made in current session. Retrieval by reference ID requires name verification; no bulk retrieval by name alone.
- MAX-ADVANCE: System rejects booking if appointment date exceeds admin-set max advance booking period (default 30 days from current date).
- MIN-LEAD-TIME-SELF: Customer self-service cancellation/reschedule is prevented if current time is within min cancellation lead time of appointment (appointment start - lead time). Applies to rescheduling as well.
- ANALYTICS-COUNT-DEF: 'Booking counts per day' counts bookings by appointment date, not creation date.
- REJECT-PAST: System rejects any booking where appointment start time is in the past relative to server time.
- CREDENTIALS: Admin password is set via environment variable or config file at deployment, stored as bcrypt hash; no default password exists.
- HOURS-CHANGE-EXISTING: Existing bookings remain unchanged even if new business hours would exclude them; admin may manually adjust.
- SESSION-MECHANISM: Anonymous session ID stored in HTTP-only session cookie; persists until browser close or 24-hour inactivity. Confirmation card stored in session state.
- RESCHEDULE-MAX-ADVANCE: Customer reschedule is rejected if new date exceeds max advance booking period.
- FALLBACK-CRITERIA: Failed intent extraction = confidence below threshold (default 0.7) or unrecognized intent. Two consecutive failures trigger fallback.
- SINGLE-RESOURCE: Single bookable resource; no overlapping appointments across any services.
- LEAD-TIME-ZERO: When min cancellation lead time=0, cancellation allowed up to (appointment start time - 1 second). On or after start time, cancellation is rejected.
- ADMIN-MANAGE-OVERRIDE: Admin can override lead time and business hours when manually managing bookings. UI displays explicit override warnings.
- ANALYTICS-FUTURE: Analytics chart includes future booked dates to show schedule density.
- ERROR-RESCHED-MAXADV: Appropriate error message when reschedule target date exceeds max advance period.
- SECURITY-ADMIN: Password hashed, never plaintext; no default credentials shipped.
