import { Events, type GuildMember, type PartialGuildMember } from "discord.js";

import type { DatadropClient } from "../datadrop.js";
import { getErrorMessage } from "../helpers.js";
import type { Event } from "../models/index.js";

export default {
    name: Events.GuildMemberRemove,
    execute: guildMemberRemove,
} as Event;

async function guildMemberRemove(
    client: DatadropClient,
    member: GuildMember | PartialGuildMember,
) {
    if (member.user?.bot) return;
    client.logger.info(
        `L'utilisateur <${member.displayName} a quitté le serveur.`,
    );

    try {
        await client.database.delete(member.id);
    } catch (err) {
        client.logger.error(getErrorMessage(err));
    }
}
