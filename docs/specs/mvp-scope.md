# MVP Scope

## In Scope

1. Multi-tenant behavior keyed by `guildId`.
2. Mandatory verification flow integrated with lifecycle state machine.
3. BPMN-aligned transition enforcement.
4. Start-of-year automation:
   - pre-reset admin prompt for settings
   - dry-run summary
   - explicit confirmation
   - role reset and announcement
5. Config redesign path from JSON toward database model.
6. Core operational safety:
   - optimistic locking with retry
   - dead-letter queue
   - remediation visibility for staff

## Out of Scope for MVP (Later)

1. discord-mailbox integration
2. member statistics portal
3. guild-wide statistics dashboards
4. public or private leaderboards
5. ban appeal web workflow

## Acceptance Criteria

1. A new guild can be onboarded without code changes.
2. Unverified users remain gated from protected channels and capabilities.
3. Manual override constraints are enforced by guard rules.
4. Yearly reset can be executed safely with admin confirmation.
5. Transition conflicts are handled without inconsistent state.
6. p95 latency target under 500ms is met for core operations.
