# Membership State Machine

## Canonical Lifecycle

```mermaid
stateDiagram-v2
    [*] --> InvitedOrJoined
    InvitedOrJoined --> OnboardingInProgress
    OnboardingInProgress --> OnboardingCompleted
    OnboardingCompleted --> RoleEligible
    RoleEligible --> RulesAccepted
    RulesAccepted --> VerificationPending
    VerificationPending --> Verified

    VerificationPending --> RejectedNotEligible
    VerificationPending --> Kicked
    VerificationPending --> LeftGuild
    VerificationPending --> Banned

    Verified --> LeftGuild
    Verified --> Banned

    RejectedNotEligible --> [*]
    Kicked --> [*]
    LeftGuild --> [*]
    Banned --> [*]
```

## Critical Guard Rules

1. Admin implicit verification transition is valid only from `VerificationPending`.
2. Admin implicit verification must hard fail if email is missing.
3. Successful manual implicit verification transition is only `VerificationPending -> Verified`.
4. Historical manual override does not grant bypass in future reverification waves.
5. Per-guild onboarding and rules acceptance remain mandatory even when user is globally verified.

## Transition Control

Every transition must include:

1. Expected current state
2. Expected aggregate version
3. Idempotency key
4. Transition source
5. Reason code

## Reconciliation Model

```mermaid
flowchart TD
    E[Event arrives from Bot or API] --> P[Load member aggregate]
    P --> C{Expected state and version match?}
    C -->|Yes| T[Apply transition]
    T --> W[Write transition ledger + snapshot]
    C -->|No| R[Reload and retry]
    R --> B{Retry budget exceeded?}
    B -->|No| C
    B -->|Yes| D[Write dead-letter record]
    D --> S[Show in remediation panel]
```

## Notes on Discord Signals

- `GUILD_MEMBER_UPDATE` is treated as an input signal, not sole source of truth.
- Role and flag deltas can trigger reconciliation runs.
- No assumption is made that onboarding reruns always produce unique onboarding-specific flags changes.

## Source Notes

For member update events, pending behavior, and member flags, see [Discord API and Discord.js Sources](discord-sources.md).
