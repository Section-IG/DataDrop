# Discord API and Discord.js Sources

This file lists the authoritative references used for Discord-specific behavior statements in the documentation.

## Discord API Sources

1. Gateway Events overview
   - https://docs.discord.com/developers/events/gateway-events

2. Guild Member Update event
   - https://docs.discord.com/developers/events/gateway-events#guild-member-update

3. Guild Resource and Guild Member object
   - https://docs.discord.com/developers/resources/guild

4. Guild Member flags including onboarding-related flags
   - https://docs.discord.com/developers/resources/guild#guild-member-object-guild-member-flags

5. Membership screening `pending` behavior
   - https://docs.discord.com/developers/resources/guild#membership-screening-object

6. Guild onboarding object and prompts
   - https://docs.discord.com/developers/resources/guild#guild-onboarding-object

7. Message timestamp formatting in Discord messages
   - https://docs.discord.com/developers/reference#message-formatting

## Discord.js Sources

1. Discord.js guide and docs entrypoint
   - https://discord.js.org

2. Events reference including guild member updates
   - https://discord.js.org/docs/packages/discord.js/main/Events:Enum

3. `GuildMember` structure and role/member fields
   - https://discord.js.org/docs/packages/discord.js/main/GuildMember:Class

## How to Use These Sources in This Project

1. If a behavior claim depends on Discord platform event semantics, cite a Discord API source above.
2. If a behavior claim depends on discord.js runtime object shape or event names in code, cite a Discord.js source above.
3. For ambiguous platform behavior, rely on observed runtime tests in development and document the result in project docs.

## Project-Level GitHub Sources

Repository and issue references are maintained in:

- [GitHub Sources](github-sources.md)
