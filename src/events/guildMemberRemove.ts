import { Events, type GuildMember } from "discord.js";

import type { DatadropClient } from "../datadrop.js";

export default {
    name: Events.GuildMemberRemove,
    execute: guildMemberRemove,
};

async function guildMemberRemove(client: DatadropClient, member: GuildMember) {
    if (member.user.bot) return;
    if (member.guild.id !== client.config.guildId) return;
    client.logger.info(
        `L'utilisateur <${member.displayName} a quitté le serveur.`,
    );

    try {
        await client.database.delete(member.id);
    } catch (err: unknown) {
        client.logger.error((<Error>err).message);
    }
}
