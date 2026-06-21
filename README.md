# BuildPlan - Idea Validation Platform

Create landing pages, collect signups, choose a winner, and generate a build plan.

## Project Structure

```
├── backend/           # Express + TypeScript API server
│   ├── src/
│   │   ├── config.ts          # Environment configuration
│   │   ├── database.ts        # SQLite database (sql.js with better-sqlite3-like API)
│   │   ├── index.ts           # Express app entry point
│   │   ├── data/              # Task templates and static data
│   │   ├── middleware/        # Auth, error handling
│   │   ├── migrations/        # Database schema
│   │   └── routes/            # API route handlers
│   ├── package.json
│   └── tsconfig.json
├── frontend/          # React + Vite + TypeScript client
│   ├── src/
│   │   ├── api/               # Axios client with interceptors
│   │   ├── context/           # Auth context provider
│   │   ├── pages/             # Login, Register, Dashboard, BuildPlan, Invite
│   │   └── styles/            # CSS stylesheets
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts         # Dev proxy to backend
├── .env.example
└── .gitignore
```

## Getting Started

1. **Install dependencies:**
   ```bash
   cd backend && npm install
   cd frontend && npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start development servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

4. Open http://localhost:5173 in your browser.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |
| GET/POST | /api/landing-pages | List/Create landing pages |
| PUT/DELETE | /api/landing-pages/:id | Update/Delete landing page |
| GET | /api/signups/:lpId | Get signups for a landing page |
| POST | /api/signups/:lpId/winner | Set winner |
| GET/POST | /api/invitations/:lpId | List/Create invitations |
| GET/POST | /api/build-plan/:lpId | List/Generate build plan tasks |
| PUT/DELETE | /api/build-plan/:lpId/tasks/:taskId | Update/Delete task |
| GET | /api/public/landing-page/:slug | Public landing page view |
| POST | /api/public/signup | Public signup |
