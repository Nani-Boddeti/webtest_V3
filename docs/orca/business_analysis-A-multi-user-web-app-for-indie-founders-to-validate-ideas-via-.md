# business_analysis: A multi-user web app for indie founders to validate ideas via landing pages, collect waitlist signups and feedback, and 

Status: draft

## outOfScope

- Email notifications for waitlist sign-ups.
- Custom domain support for landing pages.
- Integration with external project management tools (Trello, Asana, etc.).
- Automated idea selection based on metrics.
- Payment processing or monetization features.
- A/B testing or multivariate landing page variants.
- Public sharing of build plans beyond the team.

## assumptions

- The app does not need to support custom domains; all landing pages are served from the main app domain.
- Waitlist sign-ups are stored in a database and displayed in-app; no email notifications will be sent.
- The winning idea is selected manually by the founder, not automatically based on metrics.
- Build plan generation uses a static weekly template; there is no dynamic integration with external project management tools.
- Multi-user authentication will be handled via a self-hosted identity provider (e.g., Keycloak) or a simple JWT-based system in MVP.
- The app will be containerized and deployed using Docker/Kubernetes without automatic provisioning of infrastructure.
- For MVP, external integrations (database, auth, storage) will be mocked/simulated to accelerate development.

## userStories

- As a founder, I can create a landing page for an idea on a sub-path to promote and gather waitlist signups.
- As a founder, I can view waitlist signups and feedback collected from my landing pages in the app.
- As a founder, I can manually select a winning idea from my list of ideas to generate a weekly build plan.
- As a founder, I can collaborate with my team by granting them access to manage landing pages and view analytics.
- As a founder, I can track project status and review outputs of tasks generated from the build plan.

## scopeQuestions

- What level of detail is required in the weekly build plan template?
- Should the build plan tasks be editable after generation (e.g., reorder, add, remove)?
- Is there a need for role-based access control (e.g., owner, editor, viewer)?
- Should waitlist data include additional fields beyond email (e.g., name, company)?
- Should landing pages support custom CSS/branding, or are they based on a standard template?
- Is there a requirement for analytics on page views apart from sign-ups?
- Should the app support export of waitlist data (CSV/PDF)?

## acceptanceCriteria

- Landing pages are created and accessible via a unique path under the main domain, display a title, description, and a signup form.
- Users can sign up on a landing page; sign-up data (email, optional feedback) is stored and displayed in the app dashboard without sending email notifications.
- A dashboard lists all created landing pages with sign-up counts and feedback summaries.
- The winning idea selection is manual: a button to mark an idea as winner, which then generates a weekly build plan from a template.
- The generated build plan is displayed as a list of tasks with status tracking; users can mark tasks as done, in progress, etc.
- Multi-user support: an owner can invite other users by email; users can log in and see shared landing pages and build plans.
- All tasks and outputs are sandboxed, with no autonomous changes outside designated worktrees.
