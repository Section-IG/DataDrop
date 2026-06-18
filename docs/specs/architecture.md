# Architecture

## Context

DataDrop has two behavior entrypoints:

1. Discord Bot runtime
2. Web App + Backend API

Both must enforce the same business rules and write to the same domain model.

## High-Level System Diagram

```mermaid
flowchart LR
    U[User] -->|Discord Client| D[Discord Platform]
    U -->|Browser| W[Web App]

    D -->|Gateway Events| B[DataDrop Bot]
    B -->|Commands, role updates, onboarding checks| D

    W -->|JWT-authenticated calls| A[DataDrop Backend API]
    A --> DB[(PostgreSQL)]
    B --> DB

    DB --> Q[Dead Letter Queue]
    Q --> R[Staff Remediation Panel]

    A --> O[Audit and Security Logs]
    B --> O
```

## Tenant and Access Flow

```mermaid
sequenceDiagram
    participant User
    participant Web as Web App
    participant Discord as Discord OAuth API
    participant API as Backend API
    participant DB as PostgreSQL

    User->>Web: Login with Discord
    Web->>Discord: OAuth exchange
    Discord-->>Web: user identity + guild list
    Web->>API: fetch guilds known by DataDrop for user
    API->>DB: read guild memberships and roles
    DB-->>API: guilds from platform scope
    API-->>Web: intersection list for guild selector
    User->>Web: select guild
    Web->>API: request guild context
    API->>DB: action-time authorization check
    DB-->>API: allowed or denied
    API-->>Web: scoped response
```

## Cross-Entrypoint Consistency

Design rule:

- Bot and API writes use strict optimistic locking
- Transition preconditions include expected state and expected version
- Conflict retries are bounded
- Retry exhaustion creates dead-letter records

## Source Notes

For Discord gateway and member update semantics, see [Discord API and Discord.js Sources](discord-sources.md).
