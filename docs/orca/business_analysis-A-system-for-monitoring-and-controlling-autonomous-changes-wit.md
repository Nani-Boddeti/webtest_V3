# business_analysis: A system for monitoring and controlling autonomous changes within sandboxed worktrees, providing project status visibili

Status: draft

## outOfScope

- Detailed analytics, reporting, or dashboards beyond simple status and logs.
- User management, permissions, and role-based access control.
- Integration with external CI/CD pipelines or version control systems.
- Long-term audit logging or historical data warehousing.

## assumptions

- Autonomous changes are produced by an external process that operates within sandboxed worktrees.
- The system has read access to the worktree filesystem to determine status and outputs.
- User authentication and authorization are handled outside this system (e.g., by Orca's environment).
- Escalation handling requires a human decision (e.g., approve, reject, or request changes).

## userStories

- As a user, I can view the current status of my project tasks.
- As a user, I can initiate a task run.
- As a user, I can review outputs of executed tasks.
- As a user, I can handle escalations raised by autonomous processes.

## scopeQuestions

- What specific events or conditions trigger an escalation?
- What types of tasks can the user run, and what are their expected inputs and outputs?
- How is project status defined? Which metrics or states should be tracked?

## visualReferences


## acceptanceCriteria

- A dashboard displays the latest status of all tasks.
- User can trigger a task execution from the UI.
- After task completion, outputs are shown in a review panel.
- Escalated items appear in a queue with actions to resolve them.
