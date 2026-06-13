# technical_design: MVP service booking system with AI chat-powered customer interface and admin panel. Customers chat with an AI to book, c

Status: draft

## riskNotes

- Unconfirmed integrations (Ollama, PostgreSQL) block core functionality. AI intent accuracy depends on prompt engineering and test set; may need iteration. Admin override logic must carefully bypass constraints with warnings. Session-based chat is fragile (browser close) and relies on server-side state.

## backendPlan

- Set up Express/FastAPI project with TypeScript/Python, environment config (DB URL, Ollama URL, admin password hash, etc.)
- Implement database migrations and models using an ORM (e.g., Knex, Sequelize, SQLAlchemy)
- Build REST API: /api/services (CRUD), /api/business-hours, /api/bookings (create, read, update, delete, list for admin), /api/available-slots (compute available 30-min slots given date/service)
- Implement admin auth middleware (HTTP Basic Auth, bcrypt password check)
- Implement session management: generate anonymous session ID, store in HTTP-only cookie, persist chat session state in DB
- Build AI integration service: /api/chat endpoint that processes message, calls Ollama for intent, manages conversation state, and triggers booking actions
- Implement booking business logic: overlap check, constraints (past, max advance, min lead time, business hours), confirmation card generation
- Admin endpoints: /api/admin/bookings (list, update, cancel), /api/admin/conversation-logs, /api/admin/analytics (daily counts by date range)
- AI fallback logic: track consecutive failures, switch to fallback prompt
- Error handling and logging

## agentHandoff

- Backend agents: Use config from environment variables for DB_URL, OLLAMA_URL, ADMIN_PASSWORD_HASH. Use migrations for DB schema. Ensure all endpoints return proper errors. For AI, implement intent extraction with confidence threshold (default 0.7). Frontend agents: Use session cookie for chat, store reference ID in state. Admin panel must send Basic Auth header. Ensure responsive design. Test all acceptance criteria.

## databasePlan

- Design PostgreSQL schema with migrations: tables for services, business_hours (day_of_week, open_time, close_time), bookings (id, reference_id, customer_name, service_id, appointment_start, duration, status, session_id, created_at), admin_users (id, username, password_hash), chat_sessions (session_id, created_at, expires_at), conversation_messages (session_id, role, content, timestamp, intent, confidence)
- Add indexes on bookings (appointment_start, reference_id), chat_sessions (session_id)
- Seed admin user with bcrypt-hashed password from env variable

## frontendPlan

- Customer Chat App (single-page, mobile-responsive): Chat UI with message bubbles, input, session indicator, expandable booking cards. Manage session cookie. Call /api/chat for messages. Display confirmation cards (non-dismissable). Show chat history within session. Booking history retrieval via reference ID and name.
- Admin Panel (separate SPA, browser-based): Login form (Basic Auth). Service management (add/edit/delete). Business hours configuration (day, open, close). Booking management: list with filters, cancel/reschedule buttons with override warnings. Analytics page: daily booking counts chart (e.g., Chart.js), filter by service. Conversation logs: searchable list of sessions, view full conversation. All API calls with Basic Auth.

## testStrategy

- Manual and automated API tests for all endpoints. Test AI intent accuracy using provided test set (curated in repo). End-to-end tests covering booking flow, cancellation, rescheduling, constraint enforcement, admin overrides, analytics. Acceptance criteria to be verified individually.

## dependencyPlan

- PostgreSQL and Ollama must be available. Use Docker Compose to spin them up for development. For production, ensure self-hosted instances. AI integration blocked until Ollama model is deployed and intent classifier prompt is validated.

## lowLevelDesign

- Architecture: Monorepo with backend (Node.js/Express or Python/FastAPI), frontend (React or Vue), both in Docker. Database: PostgreSQL with tables: services, business_hours, bookings (status, reference, name, service, date, time, duration, created_at, updated_at), admin_users, chat_sessions, admin_conversation_logs. AI: Backend makes HTTP calls to Ollama API with curated prompts for intent classification (book, cancel, reschedule, retrieve, history, fallback) and entity extraction. Fallback after two low-confidence/non-intents. Booking logic enforces: no overlapping appointments, past rejection, max advance, min cancellation lead time, business hour boundaries. Admin can override constraints. Analytics: aggregated counts by appointment date.

## blockedOnIntegrations

- Ollama
- PostgreSQL

## implementationRoadmap

- 1. Project scaffolding and database schema
- 2. Backend core API (services, hours, admin auth)
- 3. Booking logic and availability engine
- 4. AI Chat integration (Ollama intent extraction)
- 5. Customer chat frontend
- 6. Admin panel frontend (management, analytics, logs)
- 7. End-to-end integration testing and acceptance criteria validation

## implementationApproach

- Iterative MVP: First deploy backend with DB, basic API, and admin panel for configuration. Then build AI chat integration and customer frontend. Finally add analytics and logging. Use Docker Compose for local dev with PostgreSQL and Ollama. All components self-contained in the monorepo.
