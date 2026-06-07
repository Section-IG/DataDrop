# Issue 93 Specification

## Purpose

Issue 93 is the umbrella epic for:

- Bot refactor
- Web app delivery

GitHub source links:

- Repository: https://github.com/section-ig/datadrop
- Issue #93: https://github.com/section-ig/datadrop/issues/93
- Issue #91 (web interface scope reference): https://github.com/section-ig/datadrop/issues/91

Priority order:

1. Bot refactor first
2. Web app can ship partially

## MVP Definition (Non-Negotiable)

MVP is done when all of the following are true:

1. Bot is multi-tenant
2. Verification is mandatory
3. BPMN flow is enforced
4. Start-of-year reset and announcement automation is available
5. Before yearly reset, admins are prompted to validate or update year settings

Settings requested before yearly reset include at minimum:

- Year start date
- Number of years
- Number of groups per year

These settings remain editable at any time.

## Tenant Model

- Tenant key is `guildId` everywhere.
- Web app guild selection is based on intersection:
  - guilds known by DataDrop in database
  - guilds returned by Discord OAuth identity

Ban appeal uses a separate flow because banned members are no longer in a guild member list.

## Authorization Model

Authorization is dual-layered:

1. Login-time role-aware UI shaping
2. Action-time permission re-check on every privileged operation

## Identity and Verification

Identity anchor:

- Discord `userId` is canonical identity key

Metadata only:

- Username and discriminator changes

Verification model:

1. Discord OAuth only
2. Verification required to continue platform usage
3. Verification can be executed in web app
4. Verification is one-time global across all guilds using DataDrop
5. Per-guild onboarding and rules acceptance still required by Discord guild flow

Email uniqueness rule:

- Henallux email is globally unique per person
- Duplicate email attempt on another Discord account is denied and staff-notified
- If a student becomes teacher and receives new email, reverification uses the new email

## State and Override Rules

Manual implicit verification by admin:

1. Allowed only from `VerificationPending`
2. Hard reject in any other state
3. Hard fail if user email is missing
4. Successful path is `VerificationPending -> Verified`
5. Treated as point-in-time override only
6. Historical override does not imply future bypass in reverification campaigns

Reverification campaigns:

- Targeted cohorts by filters are required
- Includes cohorts such as manually overridden users and date-based cohorts

## Discord Access Enforcement

- Enforcement is channel and role gating
- Not auto-kick for unverified users by default

## Start-of-Year Reset

Required behavior:

1. Bot prompts admin for updated configuration ahead of reset window
2. Dry-run summary is generated
3. Explicit admin confirmation is required
4. Reset is applied and announcement is posted automatically

## Config Management

1. Redesign now and map current JSON config keys to database model
2. No built-in config versioning requirement
3. Create and update audit is mandatory
4. Rollback is manual only
5. Stale-write protection is required for concurrent updates

Stale-write behavior:

- User who submits outdated config is informed
- Superseded submission is marked deprecated

## Ban Appeal

1. Appeal identity is strictly Discord `userId`
2. User authenticates through Discord OAuth
3. Reviewer set is admins, owner, and configurable reviewer roles
4. Outcomes are `unban` or `reject`
5. No rate limit requirement

## Data Deletion and Deactivation

User actions are self-serve and distinct:

1. Delete my data
2. Deactivate account

Common retention behavior:

- Soft delete first
- 6-month grace period
- Hard delete after inactivity window

Evidence retention after hard delete:

- Keep moderation evidence
- Keep audit and security events
- Keep userId linkage
- Also include pseudonymization

Deactivation access rule:

- Login blocked for rolling 24 hours

## Performance and Reliability

1. Bot is continuous background event process
2. Performance target is p95 under 500ms
3. Dead-letter queue required for transition failures
4. Staff remediation panel required

Concurrency model:

1. Strict optimistic locking with retry
2. Transition writes include expected state and version preconditions
3. Bounded retries on conflict
4. Dead-letter after retry exhaustion

## Source Traceability

Any Discord API or Discord.js behavior in this document is backed by:

- [Discord API and Discord.js Sources](discord-sources.md)

Project issue and repository references are tracked in:

- [GitHub Sources](github-sources.md)

Rule-by-rule traceability and linked implementation issues are tracked in:

- [Strict Traceability Matrix](traceability-matrix.md)

## Updated Issue #93 Description (Ready to Paste)

Issue #93 is the umbrella epic for the DataDrop bot refactor and web app delivery.

Implementation priority:

1. Stabilize platform and data layer first
2. Enforce identity and verification rules second
3. Deliver admin configuration capabilities third
4. Deliver user-facing flows and analytics after the core is stable

### Ordered Implementation Plan

Phase 0: Delivery and persistence foundation

1. #104 Deployment pipeline always fails
2. #111 Change ORM to Prisma
3. #71 The bot should log everything

Phase 1: Concurrency, auditability, reliability, and SLOs

1. #135 Persist config create/update audit trail
2. #136 Implement stale-write detection and superseded update deprecation for guild config
3. #132 Enforce strict optimistic locking with bounded retries for transition writes
4. #140 Implement dead-letter queue and remediation workflow for failed transitions
5. #139 Implement p95 under 500ms SLO instrumentation and alerting

Phase 2: Identity and verification lifecycle

1. #128 Implement global one-time verification identity across all DataDrop guilds
2. #130 Enforce global Henallux email uniqueness with staff alert on duplicate usage
3. #131 Guard manual implicit verification to VerificationPending with mandatory email check
4. #129 Enforce per-guild onboarding and rules acceptance even for globally verified users
5. #133 Add reverification campaigns with cohort filters and no historical override bypass

Phase 3: Admin configuration (role and channel governance)

1. #90 Configure admin role
2. #89 Configure announcement channel
3. #88 Configure number of years
4. #87 Configure number of classes/groups per year
5. #84 Configure grant-roles channel
6. #85 Configure general roles
7. #86 Configure role definitions (name, color, etc.)
8. #92 Configure through Discord commands
9. #91 Configure through web interface

Phase 4: Compliance and user lifecycle

1. #137 Self-serve data deletion and account deactivation with rolling 24h login block
2. #138 Retain moderation and audit evidence with userId linkage and pseudonymization
3. #77 User can contact guild staff by private message to the bot
4. #68 User can appeal guild ban through web interface

Phase 5: Automation, provisioning, and insights

1. #72 Automatic start-of-year announcement and yearly update campaign
2. #70 Generate server from saved guild configuration
3. #74 Read access to guild statistics
4. #73 Read access to dynamic leaderboard
5. #69 Additional user feature from the feature board
6. #94 Additional feature-list item tracked by epic

### Role and Target Categorization

Admin features

- Bot target: #92, #90, #89, #88, #87, #86, #85, #84, #72, #71, #70
- Web app target: #91
- Shared bot and web target: #111, #135, #136

Bot owner features

- Bot target: #81 (completed), #80 (completed)
- Platform target (ops): #104, #139, #140

User features

- Bot target: #77, #74, #73, #69
- Web app target: #68, #94
- Shared bot and web target: #128, #129, #130, #131, #133, #137, #138
- Already completed user features: #79, #78, #76, #75, #67

Feature-list items already completed in the admin bucket

- #83 (completed)
- #82 (completed)

### Notes

- #93 remains tracking-only and should be updated as a checklist/progress board.
- #104 and #111 are hard prerequisites for predictable delivery speed and safe implementation of later phases.
- #132 and #140 should be treated as a pair: conflict policy first, failure handling immediately after.

## Issue #93 Checkbox Board Format (GitHub-Ready)

Use this block directly in Issue #93.

```md
# Issue #93 - DataDrop Umbrella Epic

This issue tracks bot refactor and web app delivery.

Implementation priority:
1. Stabilize platform and data layer first
2. Enforce identity and verification rules second
3. Deliver admin configuration capabilities third
4. Deliver user-facing flows and analytics after the core is stable

## Phase 0 - Delivery and persistence foundation

- [ ] #104 Deployment pipeline always fails
- [ ] #111 Change ORM to Prisma
- [ ] #71 The bot should log everything

## Phase 1 - Concurrency, auditability, reliability, and SLOs

- [ ] #135 Persist config create/update audit trail
- [ ] #136 Implement stale-write detection and superseded update deprecation for guild config
- [ ] #132 Enforce strict optimistic locking with bounded retries for transition writes
- [ ] #140 Implement dead-letter queue and remediation workflow for failed transitions
- [ ] #139 Implement p95 under 500ms SLO instrumentation and alerting

## Phase 2 - Identity and verification lifecycle

- [ ] #128 Implement global one-time verification identity across all DataDrop guilds
- [ ] #130 Enforce global Henallux email uniqueness with staff alert on duplicate usage
- [ ] #131 Guard manual implicit verification to VerificationPending with mandatory email check
- [ ] #129 Enforce per-guild onboarding and rules acceptance even for globally verified users
- [ ] #133 Add reverification campaigns with cohort filters and no historical override bypass

## Phase 3 - Admin configuration (role and channel governance)

- [ ] #90 Configure admin role
- [ ] #89 Configure announcement channel
- [ ] #88 Configure number of years
- [ ] #87 Configure number of classes/groups per year
- [ ] #84 Configure grant-roles channel
- [ ] #85 Configure general roles
- [ ] #86 Configure role definitions (name, color, etc.)
- [ ] #92 Configure through Discord commands
- [ ] #91 Configure through web interface

## Phase 4 - Compliance and user lifecycle

- [ ] #137 Self-serve data deletion and account deactivation with rolling 24h login block
- [ ] #138 Retain moderation and audit evidence with userId linkage and pseudonymization
- [ ] #77 User can contact guild staff by private message to the bot
- [ ] #68 User can appeal guild ban through web interface

## Phase 5 - Automation, provisioning, and insights

- [ ] #72 Automatic start-of-year announcement and yearly update campaign
- [ ] #74 Read access to guild statistics
- [ ] #73 Read access to dynamic leaderboard

## Role and target categorization

### Admin features

- Bot target: #92, #90, #89, #88, #87, #86, #85, #84, #72, #71
- Web app target: #91
- Shared bot and web target: #111, #135, #136

### Bot owner features

- Platform target (ops): #104, #139, #140

### User features

- Bot target: #77, #74, #73
- Web app target: #68
- Shared bot and web target: #128, #129, #130, #131, #133, #137, #138

## Tracking notes

- #93 stays tracking-only.
- #104 and #111 are prerequisites for predictable delivery.
- #132 and #140 should be implemented as a reliability pair.
```
