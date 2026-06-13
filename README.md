# Service Booking System - MVP

AI-powered service booking system with chat interface and admin panel.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────┐
│ Customer Chat   │     │ Admin Panel     │     │  Ollama AI   │
│ (HTML/CSS/JS)   │     │ (HTML/CSS/JS)   │     │  (optional)  │
└────────┬────────┘     └────────┬────────┘     └──────┬───────┘
         │                      │                      │
         └──────────┬───────────┴──────────┬───────────┘
                    │                      │
            ┌───────▼────────┐    ┌────────▼───────┐
            │  FastAPI       │    │  PostgreSQL    │
            │  Backend       │    │  Database      │
            └────────────────┘    └────────────────┘
```

## Quick Start

```bash
# Start with Docker (requires Docker Compose)
docker-compose up -d

# Or manually:
# 1. Start PostgreSQL
# 2. Install Python deps
pip install -r backend/requirements.txt
# 3. Run backend
cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Frontend

- **Customer Chat**: Open `frontend/customer-chat/index.html` in a browser (served with Live Server or similar)
- **Admin Panel**: Open `frontend/admin/index.html`
  - Login: `admin` / `admin123` (dev mode)

## Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Booking flow (create, lookup, cancel) | ✅ Tested |
| 2 | Business constraints (past, max advance, min lead) | ✅ Tested |
| 3 | Business hours enforcement | ✅ Tested |
| 4 | Overlap prevention | ✅ Tested |
| 5 | Admin overrides | ✅ Tested |
| 6 | Analytics (daily counts) | ✅ Tested |
| 7 | AI intent extraction (>=90% accuracy, 500+ test set) | ✅ 622 utterances tested |
| 8 | Session handling | ✅ Tested |
| 9 | Service CRUD | ✅ Tested |
| 10 | Error handling | ✅ Tested |
| 11 | Conversation logs | ✅ Tested |

## Testing

```bash
# Run all tests
bash tests/run_all_tests.sh

# Or run individually:
node tests/test_booking_logic.mjs        # Unit tests (20+ tests)
node tests/test_ai_accuracy.mjs          # AI accuracy (>=90% on 622 utterances)
node tests/test_e2e_acceptance.mjs       # E2E acceptance tests (all 11 ACs)

# Generate AI accuracy report
node tests/test_ai_accuracy.mjs --report
```

### AI Test Set

The curated AI test set (`tests/ai_test_set.json`) contains **622 test cases** across all intents:

| Intent | Count | Description |
|--------|-------|-------------|
| Booking | 250+ | Book appointments for various services |
| Cancel | 125+ | Cancel existing bookings |
| Reschedule | 50+ | Reschedule appointments |
| Availability | 75+ | Check available time slots |
| Greeting | 30+ | Greetings and salutations |
| Help | 25+ | Help and instructions |
| Unknown | 40+ | Out-of-scope queries |

## API Endpoints

### Public
- `GET /api/health` - Health check
- `GET /api/services` - List active services
- `GET /api/business-hours` - List business hours
- `POST /api/bookings` - Create booking
- `GET /api/bookings/lookup?reference_id=X` - Lookup booking
- `POST /api/bookings/{ref}/cancel` - Cancel booking
- `GET /api/available-slots?date=X&service_id=Y` - Get available slots
- `POST /api/chat` - AI chat endpoint

### Admin (Basic Auth)
- `GET /api/admin/bookings` - List all bookings (with optional filters)
- `POST /api/admin/bookings` - Create booking (with override option)
- `PUT /api/admin/bookings/{id}` - Update booking
- `GET /api/admin/analytics?date_from=X&date_to=Y` - Daily booking counts
- `GET /api/admin/conversation-logs` - Chat conversation logs
- `POST /api/admin/services` - Create service
- `PUT /api/admin/services/{id}` - Update service
- `POST /api/admin/business-hours` - Set business hours

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/booking_system` | Database connection |
| `OLLAMA_URL` | `http://localhost:11434` | Ollama AI endpoint |
| `ADMIN_PASSWORD_HASH` | (empty - dev mode) | bcrypt hash for admin password |
| `AI_CONFIDENCE_THRESHOLD` | `0.7` | Minimum confidence for AI intent |
| `AI_FALLBACK_THRESHOLD` | `2` | Consecutive failures before fallback |
| `MAX_ADVANCE_DAYS` | `30` | Max days ahead for booking |
| `MIN_LEAD_TIME_MINUTES` | `60` | Minimum lead time for booking |

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry
│   │   ├── config.py            # Environment configuration
│   │   ├── database.py          # DB connection and session
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── public.py        # Public API endpoints
│   │   │   └── admin.py         # Admin API endpoints
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── availability_service.py  # Slot calculation
│   │   │   ├── booking_service.py       # Booking CRUD + constraints
│   │   │   └── ai_service.py            # Intent extraction + chat
│   │   └── middleware/
│   │       ├── __init__.py
│   │       └── auth.py          # Admin authentication
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── customer-chat/
│   │   └── index.html           # Chat UI
│   └── admin/
│       └── index.html           # Admin panel
├── tests/
│   ├── test_booking_logic.mjs   # Unit tests (20+ tests)
│   ├── test_ai_accuracy.mjs     # AI accuracy (>=90% threshold)
│   ├── test_e2e_acceptance.mjs  # E2E acceptance tests
│   ├── ai_test_set.json         # Curated test set (622 utterances)
│   └── run_all_tests.sh         # Test runner script
├── docker-compose.yml
└── README.md
```
