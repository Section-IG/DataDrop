# Strict Traceability Matrix

This matrix maps each accepted rule to:

1. Source specification section
2. GitHub issue link when available
3. Implementation target
4. Validation target

If no issue exists yet, the traceability row must point to an explicit GitHub issue that is still pending implementation.

## Matrix

| Rule ID | Rule | Source | GitHub Issue | Coverage | Implementation Target | Validation Target |
|---|---|---|---|---|---|---|
| TRC-001 | Issue 93 is umbrella epic for bot refactor and web app | issue-93-specification.md / Purpose | https://github.com/section-ig/datadrop/issues/93 | Existing | Planning and milestone docs under docs/specs | Release checklist by epic gates |
| TRC-002 | Bot refactor has higher priority, web app can ship partially | issue-93-specification.md / Purpose | https://github.com/section-ig/datadrop/issues/93 | Existing | Delivery sequencing in docs/specs/mvp-scope.md and docs/specs/non-mvp-roadmap.md | Milestone scope audit |
| TRC-003 | Multi-tenant model keyed by guildId | issue-93-specification.md / Tenant Model | https://github.com/section-ig/datadrop/issues/93 | Partial | src/models/Configuration.ts, src/services/PrismaDatabaseService.ts, prisma/schema.prisma | Integration tests for tenant isolation |
| TRC-004 | Mandatory verification flow for platform access | issue-93-specification.md / Identity and Verification | https://github.com/section-ig/datadrop/issues/67 | Partial | src/events/interactionCreate.ts, src/events/guildMemberAdd.ts, src/datadrop.ts | End-to-end verification flow tests |
| TRC-005 | Per-guild onboarding and rules acceptance still mandatory | issue-93-specification.md / Identity and Verification | https://github.com/Section-IG/DataDrop/issues/129 | Existing | src/events/interactionCreate.ts, src/events/guildMemberAdd.ts, src/services/CommandHandler.ts | Scenario tests: globally verified but not guild-onboarded |
| TRC-006 | Global one-time verification across all servers using bot | issue-93-specification.md / Identity and Verification | https://github.com/Section-IG/DataDrop/issues/128 | Existing | prisma/schema.prisma, src/services/PrismaDatabaseService.ts, src/models/User.ts | Cross-guild identity tests |
| TRC-007 | Email uniqueness and duplicate-email staff notification | issue-93-specification.md / Identity and Verification | https://github.com/Section-IG/DataDrop/issues/130 | Existing | src/events/interactionCreate.ts, src/services/PrismaDatabaseService.ts, src/commands/admins/announce.ts | Duplicate verification conflict tests |
| TRC-008 | Admin implicit verification only from VerificationPending | issue-93-specification.md / State and Override Rules | https://github.com/Section-IG/DataDrop/issues/131 | Existing | src/events/interactionCreate.ts, src/services/PrismaDatabaseService.ts | State-guard unit tests |
| TRC-009 | Admin implicit verification fails if email missing | issue-93-specification.md / State and Override Rules | https://github.com/Section-IG/DataDrop/issues/131 | Existing | src/events/interactionCreate.ts, src/services/PrismaDatabaseService.ts | Command failure-path tests |
| TRC-010 | Historical manual override does not auto-bypass future reverification | issue-93-specification.md / State and Override Rules | https://github.com/Section-IG/DataDrop/issues/133 | Existing | prisma/schema.prisma, src/services/PrismaDatabaseService.ts | Reverification campaign tests |
| TRC-011 | Reverification supports targeted cohorts by filters | issue-93-specification.md / State and Override Rules | https://github.com/Section-IG/DataDrop/issues/133 | Existing | New admin command module under src/commands/admins, db query layer in src/services/PrismaDatabaseService.ts | Cohort filter integration tests |
| TRC-012 | Discord access blocked by role/channel gating for unverified users | issue-93-specification.md / Discord Access Enforcement | https://github.com/section-ig/datadrop/issues/75 | Partial | src/events/guildMemberAdd.ts, src/events/interactionCreate.ts, src/datadrop.ts | Permission and channel visibility tests |
| TRC-013 | Start-of-year reset with admin pre-check prompt | issue-93-specification.md / Start-of-Year Reset | https://github.com/section-ig/datadrop/issues/72 | Partial | src/events/clientReady.ts, new scheduler service under src/services | Scheduled workflow tests |
| TRC-014 | Year reset requires dry-run summary and explicit confirmation | issue-93-specification.md / Start-of-Year Reset | https://github.com/Section-IG/DataDrop/issues/134 | Existing | New admin command(s) under src/commands/admins, scheduler service under src/services | Dry-run confirmation flow tests |
| TRC-015 | Config redesign from JSON to DB model | issue-93-specification.md / Config Management | https://github.com/section-ig/datadrop/issues/91 | Partial | src/config.ts, src/models/Configuration.ts, prisma/schema.prisma | Migration and fallback tests |
| TRC-016 | Config create/update audit is mandatory | issue-93-specification.md / Config Management | https://github.com/Section-IG/DataDrop/issues/135 | Existing | prisma/schema.prisma, src/services/PrismaDatabaseService.ts, admin command handlers | Audit log assertion tests |
| TRC-017 | Stale-write detection and deprecation of superseded config submit | issue-93-specification.md / Config Management | https://github.com/Section-IG/DataDrop/issues/136 | Existing | src/services/PrismaDatabaseService.ts, admin config command handlers | Concurrency update tests |
| TRC-018 | Ban appeal is OAuth, strict by Discord userId, with reviewer roles | issue-93-specification.md / Ban Appeal | https://github.com/section-ig/datadrop/issues/68 | Existing (future) | Web app and API modules (to be created), moderation persistence in prisma/schema.prisma | Appeal identity and reviewer authorization tests |
| TRC-019 | Outcomes for ban appeal are unban or reject only | issue-93-specification.md / Ban Appeal | https://github.com/section-ig/datadrop/issues/68 | Existing (future) | Web app/API moderation workflows (to be created) | Decision outcome tests |
| TRC-020 | Self-serve delete-data and deactivate-account with distinct semantics | issue-93-specification.md / Data Deletion and Deactivation | https://github.com/Section-IG/DataDrop/issues/137 | Existing | New API endpoints (to be created), src/services/PrismaDatabaseService.ts, prisma/schema.prisma | Compliance flow tests |
| TRC-021 | Soft delete then hard delete after 6 months inactivity | issue-93-specification.md / Data Deletion and Deactivation | Existing behavior partially in https://github.com/section-ig/datadrop/issues/93 | Partial | src/services/PrismaDatabaseService.ts, prisma/schema.prisma | Retention scheduler tests |
| TRC-022 | Keep audit and moderation evidence with userId linkage plus pseudonymization | issue-93-specification.md / Data Deletion and Deactivation | https://github.com/Section-IG/DataDrop/issues/138 | Existing | New evidence retention model in prisma/schema.prisma and API (to be created) | Evidence retention tests |
| TRC-023 | Deactivation blocks login for rolling 24h | issue-93-specification.md / Data Deletion and Deactivation | https://github.com/Section-IG/DataDrop/issues/137 | Existing | Web auth API (to be created), token/session middleware (to be created) | Auth gate tests |
| TRC-024 | Performance SLO is p95 under 500ms | issue-93-specification.md / Performance and Reliability | https://github.com/Section-IG/DataDrop/issues/139 | Existing | Runtime instrumentation in bot and API (to be created) | SLO dashboards and load tests |
| TRC-025 | Dead-letter queue and staff remediation panel for failures | issue-93-specification.md / Performance and Reliability | https://github.com/Section-IG/DataDrop/issues/140 | Existing | New queue/error subsystem (to be created), admin panel integration (to be created) | Fault injection tests |
| TRC-026 | Strict optimistic locking with bounded retries for bot/API races | issue-93-specification.md / Performance and Reliability | https://github.com/Section-IG/DataDrop/issues/132 | Existing | src/services/PrismaDatabaseService.ts, prisma/schema.prisma, API write handlers (to be created) | Concurrency race tests |
| TRC-027 | Web app uses Discord OAuth and JWT for backend API access | issue-93-specification.md / Identity and Verification; Security and Compliance | https://github.com/section-ig/datadrop/issues/91 | Partial | Web auth/API modules (to be created) | OAuth and JWT security tests |
| TRC-028 | Stats and leaderboards are post-MVP with Discord plus telemetry sources | issue-93-specification.md / Data + non-mvp-roadmap.md | https://github.com/section-ig/datadrop/issues/73 and https://github.com/section-ig/datadrop/issues/74 | Existing (future) | Telemetry ingestion and reporting services (to be created) | Stats accuracy tests |

## Strict Rules for Future Spec Changes

1. No new rule may be accepted without a traceability row.
2. Every row must include either an existing GitHub issue link or an issue draft reference.
3. Every row must define at least one implementation target and one validation target.

## Feature Request Coverage Map

This map ensures known repository feature requests are traceable to spec scope and delivery phase.

| Issue | Link | Traceability Status | Spec Mapping |
|---|---|---|---|
| #67 | https://github.com/section-ig/datadrop/issues/67 | Traced | issue-93-specification.md / Identity and Verification |
| #68 | https://github.com/section-ig/datadrop/issues/68 | Traced | issue-93-specification.md / Ban Appeal |
| #69 | https://github.com/section-ig/datadrop/issues/69 | Traced | non-mvp-roadmap.md / Planned Features |
| #70 | https://github.com/section-ig/datadrop/issues/70 | Traced | non-mvp-roadmap.md / Dependency Notes |
| #71 | https://github.com/section-ig/datadrop/issues/71 | Traced | issue-93-specification.md / Performance and Reliability |
| #72 | https://github.com/section-ig/datadrop/issues/72 | Traced | issue-93-specification.md / Start-of-Year Reset |
| #73 | https://github.com/section-ig/datadrop/issues/73 | Traced | non-mvp-roadmap.md / Planned Features |
| #74 | https://github.com/section-ig/datadrop/issues/74 | Traced | non-mvp-roadmap.md / Planned Features |
| #75 | https://github.com/section-ig/datadrop/issues/75 | Traced | issue-93-specification.md / Discord Access Enforcement |
| #76 | https://github.com/section-ig/datadrop/issues/76 | Traced | issue-93-specification.md / Identity and Verification |
| #77 | https://github.com/section-ig/datadrop/issues/77 | Traced | non-mvp-roadmap.md / Planned Features |
| #78 | https://github.com/section-ig/datadrop/issues/78 | Traced | non-mvp-roadmap.md / Planned Features |
| #79 | https://github.com/section-ig/datadrop/issues/79 | Traced | non-mvp-roadmap.md / Planned Features |
| #80 | https://github.com/section-ig/datadrop/issues/80 | Traced | non-mvp-roadmap.md / Suggested Delivery Order |
| #81 | https://github.com/section-ig/datadrop/issues/81 | Traced | issue-93-specification.md / Tenant Model and Config Management |
| #82 | https://github.com/section-ig/datadrop/issues/82 | Traced | issue-93-specification.md / Start-of-Year Reset |
| #83 | https://github.com/section-ig/datadrop/issues/83 | Traced | issue-93-specification.md / Config Management |
| #84 | https://github.com/section-ig/datadrop/issues/84 | Traced | issue-93-specification.md / Config Management |
| #85 | https://github.com/section-ig/datadrop/issues/85 | Traced | issue-93-specification.md / Config Management |
| #86 | https://github.com/section-ig/datadrop/issues/86 | Traced | issue-93-specification.md / Config Management |
| #87 | https://github.com/section-ig/datadrop/issues/87 | Traced | issue-93-specification.md / Start-of-Year Reset and Config Management |
| #88 | https://github.com/section-ig/datadrop/issues/88 | Traced | issue-93-specification.md / Start-of-Year Reset and Config Management |
| #89 | https://github.com/section-ig/datadrop/issues/89 | Traced | issue-93-specification.md / Start-of-Year Reset |
| #90 | https://github.com/section-ig/datadrop/issues/90 | Traced | issue-93-specification.md / Authorization Model |
| #91 | https://github.com/section-ig/datadrop/issues/91 | Traced | issue-93-specification.md / Purpose and Config Management |
| #92 | https://github.com/section-ig/datadrop/issues/92 | Traced | issue-93-specification.md / Purpose and MVP Scope |
| #93 | https://github.com/section-ig/datadrop/issues/93 | Traced | issue-93-specification.md / Purpose |
| #94 | https://github.com/section-ig/datadrop/issues/94 | Traced | non-mvp-roadmap.md / Planned Features |
