# business_analysis: A multi-user web application enabling indie founders to create and share lightweight landing pages via subpaths, collect

Status: draft

## outOfScope

- Email sending (for invitations, notifications, or verification)
- Custom domain support for landing pages
- Integration with external project management tools (Trello, Asana, etc.)
- Automated winner selection based on signup counts or sentiment analysis
- Export functionality for signups or build plans
- OAuth or social login; only JWT-based email/password (or just invite-based account creation)
- Payment processing or monetization features
- Multi-tenancy or separate workspaces beyond the single team

## assumptions

- The app will use SQLite as an embedded database; no separate DB server is required.
- JWT will be used for authentication; tokens are signed with a server secret and stored in HTTP-only cookies or local storage.
- Storage for landing page images will use the local filesystem inside the container; no cloud object storage.
- The weekly build plan template will be hardcoded in the application with a fixed set of tasks; it can be evolved later.
- Invitation links will be single-use, valid indefinitely until used, and shared manually (e.g., copy/paste) by the inviter.
- Multi-user roles are limited to Owner and Editor; all have access to all projects within the single workspace.
- The app will be deployed as a single Docker container; Orca manages building and running it.
- All code changes by Orca are performed in isolated, sandboxed worktrees to prevent side effects on the running system.

## userStories

- As a founder, I can create a landing page by providing a title, description, and optional image, and it gets a shareable subpath.
- As a founder, I can view, filter, and sort waitlist signups (email required, name optional) on a dashboard.
- As a founder, I can manually mark one landing page as the winning idea.
- As a founder, I can generate a weekly build plan from a predefined task template for the winning idea.
- As a user, I can edit task names/descriptions and update task statuses according to allowed transitions (to-do → in-progress → done, etc.).
- As an owner, I can invite other users by generating an invite link; the invitee gets a role (owner/editor) upon accessing the link.
- As a user, I can view the build plan tasks and their statuses in a simple board/list view.

## scopeQuestions

- What exact task statuses and transitions are desired? (e.g., should there be a 'Review' status?)
- Should the invitation link be single-use or reusable? (Assuming single-use for simplicity)
- Should landing page images be uploaded or provided as URLs? (Assuming file upload to local storage)
- Should the dashboard support pagination for large numbers of signups? (Assuming client-side pagination for MVP)
- Should the build plan be generated per landing page, or only one active build plan at a time? (Assuming one per winning idea, but only one winner.)

## acceptanceCriteria

- Landing page: creation form with fields (title required, description optional, image optional); upon submission, page is accessible at /lp/{id} and shows a signup form.
- Waitlist signup form on landing page collects email (required) and name (optional); submissions are stored and displayed in the dashboard.
- Dashboard lists all signups with columns: email, name, signup date; supports sorting by date and filtering by landing page.
- Winner selection: on landing pages list, owner can click 'Select as Winner' for one page; only one winner at a time; after selection, build plan generation becomes available for that page.
- Build plan generation: a hardcoded template of tasks (e.g., 'Set up repository', 'Design UI mockup', 'Develop MVP feature X') is duplicated; user can then edit task names, descriptions, and reorder.
- Task statuses: To Do, In Progress, Done, Blocked. Allowed transitions: To Do ↔ In Progress, In Progress → Done or Blocked, Blocked → In Progress or To Do, To Do → Blocked. Tasks start as To Do.
- User invitation: owner generates invitation link (single-use) that encodes role; when accessed by a logged-out user, prompts to create account and join with assigned role; no email needed.
- Invitee account creation: after clicking link, user sets password (or authenticates); no email verification.
- Users with editor role can edit tasks, statuses, but cannot delete landing pages or invite others.
- Owner can change roles of existing users.
- Build plan is editable at any time.
- App runs within Orca sandboxed environment; all file system changes are confined to worktrees.
