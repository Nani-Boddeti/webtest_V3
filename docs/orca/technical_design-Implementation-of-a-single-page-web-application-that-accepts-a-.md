# technical_design: Implementation of a single-page web application that accepts a topic, performs live web search, generates a structured W

Status: draft

## riskNotes

- Search API may return inconsistent results, affecting document quality. LLM output variability may not always fit the required sections. Docx generation with python-docx handles special characters; edge cases for large content need testing. Rate limits and cost of external APIs should be considered. No persistent storage, so no file cleanup needed (in-memory).

## backendPlan

- Create FastAPI application with two routes. POST /generate endpoint uses search_service and llm_service (initially mocks returning dummy data). Build a .docx file with required sections: 5-point summary, challenges, optimal model, model guardrails, implementation guidelines. Return StreamingResponse with appropriate headers for file download. Add error handling for invalid input and service failures. Write unit tests with pytest and httpx to verify endpoint response and document content structure.

## agentHandoff

- Implementation agent: refer to task descriptions for detailed steps. Scaffolding task sets up repo structure, requirements.txt, and mock service stubs. Backend task implements FastAPI app, mock functions, docx generation, and tests. Frontend task creates static HTML/JS/CSS served by backend. All integration keys should be pulled from environment variables; use placeholders `<to be replaced>` until Orca config task runs. Use python-docx for document creation, httpx for async HTTP calls. Ensure all tests pass.

## databasePlan

- No database required.

## frontendPlan

- Create index.html in static directory. Include a form with topic input and submit button. On submit, show a loading spinner/indicator, send POST request to /generate using fetch, handle blob response, create object URL, and automatically trigger download. Minimal responsive CSS for readability. No JavaScript frameworks.

## testStrategy

- Backend: pytest tests covering /generate endpoint with valid topic, invalid input, and docx content validation. Use httpx to simulate client. Reviewer can run `pytest` and also manually test with curl: `curl -X POST -H 'Content-Type: application/json' -d '{"topic":"test"}' http://localhost:8000/generate -o test.docx`. Frontend: no automated UI tests; reviewer can validate that starting server and opening / serves the page, but visual verification is not required. Linting via flake8.

## dependencyPlan

- Tasks depend on scaffolding (Task 1). Backend implementation (Task 2) depends on Task 1. Frontend (Task 3) can run in parallel with Task 2 after Task 1, as it uses mock or real API.

## lowLevelDesign

- Backend: FastAPI app with two endpoints - GET / (serves static frontend) and POST /generate (receives topic, returns .docx). Uses python-docx for document generation. Search and LLM functions are dependency-injected, initially mocked. Configuration via environment variables. Frontend: Single HTML file (index.html) with vanilla JS, fetch for API call, loading state, blob download. No database or external storage.

## blockedOnIntegrations

- Web Search API
- LLM API

## implementationRoadmap

- Phase 1: Scaffold project structure, dependencies, and test harness (Task 1). Phase 2: Implement backend API with mock search and LLM (Task 2). Phase 3: Build frontend single-page UI (Task 3). Phase 4: Configuration of real Web Search API and LLM API via dedicated Orca config task.

## implementationApproach

- Start with project scaffolding and configuration placeholders. Develop backend logic using mock integrations, complete with automated tests. Build frontend UI independently. Finally, swap mocks with real API calls using environment variables (Orca handles integration configuration separately).
