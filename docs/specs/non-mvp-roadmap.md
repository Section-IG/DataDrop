# Non-MVP Roadmap

## Planned Features After MVP

1. Ban appeal workflow in web app
2. Member personal stats
3. Guild analytics
4. Leaderboards with role-based exclusions
5. discord-mailbox and staff communication workflows

## Suggested Delivery Order

1. Ban appeal and reviewer workflow
2. Member and guild telemetry endpoints
3. Leaderboard rendering and filters
4. Communication workflows

## Dependency Notes

1. Ban appeal depends on persistent ban identity model keyed by `guildId + userId`.
2. Stats and leaderboards depend on stable telemetry ingestion and UTC storage conventions.
3. Web admin features depend on final config schema migration to database.
