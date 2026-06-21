# technical_design: MVP of a Waitlist & Build Plan platform: founders create landing pages, collect signups, choose a winner, and generate a

Status: draft

## riskNotes

- Invitation token security: must be non-guessable and single-use. Winner selection: race condition if two owners click simultaneously; transaction handles it but API should return error if another update occurred. JWT secret exposure: ensure not committed; .env file excluded from git. File upload: validate file type and size to prevent abuse. Task status transitions: server-side validation crucial to prevent invalid state changes; frontend should also reflect allowed transitions. Migration scripts must be idempotent and run on startup; use a meta table to track applied migrations.

## backendPlan

- Express server with middleware for CORS, JSON body parsing, cookie-parser, and file upload (multer). Routes: /api/auth/*, /api/invites, /api/landing-pages, /api/signups, /api/build-plans, /api/tasks. Each route protected by JWT middleware (except public signup and registration). Controllers implement business logic with SQLite via better-sqlite3. Use parameterized queries to prevent injection. JWT secret from .env. File uploads stored in /uploads and served as static. Invitation tokens generated with crypto.randomBytes(32). Postman collection for testing.

## agentHandoff

- The project uses SQLite – ensure the database file path is configurable via DB_PATH env var, default to ./data/app.db. JWT secret must be set via JWT_SECRET env; use a strong, random value in production. File uploads directory (UPLOAD_DIR) defaults to ./uploads; ensure the directory exists at startup and is writable. Invitation tokens must be single‑use: mark the invitation record as used atomically within a transaction when creating the user. Winner logic: wrap the update in a transaction that first clears any existing winner before setting the new one to guarantee singularity. Hardcoded build plan tasks are defined in src/data/taskTemplate.json; when generating, copy each task and set status='To Do', order sequentially. Frontend: Ensure all API calls use credentials: 'include' to send cookies, and handle 401 by redirecting to login. The public landing page view at /lp/:id should not require authentication. Invitation link route should be /register?token=xxx; the frontend register page extracts the token from query params and calls the API.

## databasePlan

- SQLite with better-sqlite3. Tables: users (id, email, password_hash, role, created_at), landing_pages (id, title, description, image_path, is_winner, created_by, created_at), signups (id, email, name, landing_page_id, created_at), build_plans (id, landing_page_id, created_at), tasks (id, build_plan_id, title, description, status, order, created_at, updated_at), invitations (id, token, role, used, created_by, created_at). Indexes on foreign keys and token. Use WAL mode for concurrency. Migration scripts applied on startup. Seed script for initial owner user? (Should be created by first registration from invite). Hardcoded task template stored in code, inserted when generating build plan.

## frontendPlan

- React app created with Vite. Pages: Login, Register, RegisterFromInvite, Dashboard (tabs: Landing Pages, Signups, Invite Users), LandingPageView (public), BuildPlanBoard (columns for each status, tasks as cards, inline editing, drag-and-drop reorder). Components: LandingPageForm, SignupForm, TaskCard, InviteLinkGenerator. State: React Query for server data, context for auth. Routing: React Router v6. Styling: CSS Modules or Tailwind CSS. Use axios interceptors to attach JWT from cookies. Mock service worker (MSW) for local development without backend.

## testStrategy

- Backend: integration tests for each API endpoint using supertest, with an in-memory SQLite database for isolation. Validate authentication, role checks, status transition logic, and winner uniqueness. Frontend: component tests with React Testing Library and MSW to mock API responses. E2E sanity test with Cypress or Playwright covering critical user flows (create landing page, sign up via link, mark winner, edit tasks). All tests run in CI workflow (GitHub Actions) on push to main.

## dependencyPlan

- All tasks depend on Project Monorepo Setup and Scaffolding. Database Schema & Migrations is needed by all backend tasks. User Authentication is required by Invitation System and any route with auth. Landing Pages CRUD is needed by Waitlist Signup and Winner Selection. Build Plan Generation depends on Winner Selection. Build Plan Task Management depends on Build Plan Generation. Frontend Implementation depends on all backend tasks; can be started after core APIs are ready, later integrated with advanced ones.

## lowLevelDesign

- Monorepo with /backend (Node.js + Express) and /frontend (React). Backend serves REST API and, in production, static frontend build. SQLite database file stored in /data. JWT authentication with bcrypt hashed passwords; tokens stored in httpOnly cookies. File uploads for landing page images stored in /uploads inside the container. User roles enforced by middleware. Invitation links are single-use random tokens that encode a role; clicking creates a user account with that role. Build plan template tasks are hardcoded in a JSON file. Task statuses: To Do, In Progress, Done, Blocked; all transitions validated server-side. Winner selection ensures at most one winner across all landing pages. Frontend SPA with React Router; pages: Login/Register, Dashboard (landing pages list, signups table, winner select, invite management), Landing page public view with signup form, Build Plan board (task columns). Axios for API calls, React Query for state management.

## blockedOnIntegrations


## implementationRoadmap

- steps: [object Object],[object Object],[object Object],[object Object]

## implementationApproach

- Start with project scaffolding (monorepo structure, build tools). Set up database schema. Implement authentication then landing pages and signups in parallel. After that, build the winner selection and build plan generation. Finally, implement invitation system and frontend integration in parallel. Frontend will be developed incrementally as APIs become available. Use feature branches; Orca sandboxed worktrees for isolation. Testing as part of each implementation task.
