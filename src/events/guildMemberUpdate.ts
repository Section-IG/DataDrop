import { Events, type GuildMember } from "discord.js";

import type { DatadropClient } from "../datadrop.js";
import type { Event } from "../models/index.js";

export default {
    name: Events.GuildMemberUpdate,
    execute: guildMemberUpdate,
} as Event;

async function guildMemberUpdate(
    client: DatadropClient,
    oldMember: GuildMember,
    newMember: GuildMember,
) {
    if (newMember.user.bot) return;

    const { first, second, third, roleToSelectRoleId, pseudoToChangeRoleId } =
        client.config;

    const hasYearRole =
        newMember.roles.resolve(first.roleid) ||
        newMember.roles.resolve(second.roleid) ||
        newMember.roles.resolve(third.roleid);

    const displayNameParts = newMember.displayName.trim().split(/\s+/);
    const hasDisplayNameChanged =
        oldMember.displayName !== newMember.displayName;
    const hasValidDisplayName = displayNameParts.length >= 2;

    const roleToSelectRole =
        await newMember.guild.roles.fetch(roleToSelectRoleId);

    const pseudoToChangeRole =
        await newMember.guild.roles.fetch(pseudoToChangeRoleId);

    if (hasYearRole && newMember.roles.cache.has(roleToSelectRoleId)) {
        await newMember.roles.remove(roleToSelectRoleId);
        client.logger.info(
            `Le rôle <${roleToSelectRole?.name}> a été retiré à <${newMember.user.tag}>`,
        );
    }

    if (
        hasDisplayNameChanged &&
        hasValidDisplayName &&
        newMember.roles.cache.has(pseudoToChangeRoleId)
    ) {
        await newMember.roles.remove(pseudoToChangeRoleId);
        client.logger.info(
            `Le rôle <${pseudoToChangeRole?.name}> a été retiré à <${newMember.user.tag}>`,
        );
    }
}
