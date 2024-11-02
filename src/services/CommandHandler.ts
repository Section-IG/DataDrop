import {
    type AutocompleteInteraction,
    ChannelType,
    type ChatInputCommandInteraction,
    type MessageContextMenuCommandInteraction,
} from "discord.js";

import type { DatadropClient } from "../datadrop.js";
import type { Command } from "../models/Command.js";

type AuthorizationResponse = {
    error?: string;
};

export class CommandHandler<
    T extends
        | ChatInputCommandInteraction
        | MessageContextMenuCommandInteraction
        | AutocompleteInteraction,
> {
    readonly #client: DatadropClient;

    constructor(client: DatadropClient) {
        this.#client = client;
    }

    shouldExecute(interaction: T): boolean {
        return true;
    }

    async execute(interaction: T): Promise<void> {
        const command = this.#client.commands.get(interaction.commandName);
        if (!command) {
            this.#client.logger.error(
                `Commande inexistante employée: ${interaction.commandName}`,
            );
            if ("reply" in interaction)
                await interaction.reply({
                    content: "❌ **Oups!** - Cette commande n'existe pas.",
                    ephemeral: true,
                });
            return;
        }

        const authorizationResponse = await this.#checkAuthorization(
            interaction,
            command,
        );
        this.#logUsage(interaction, command, !authorizationResponse.error);

        if (authorizationResponse.error) {
            if ("reply" in interaction)
                await interaction.reply({
                    content: authorizationResponse.error,
                    ephemeral: true,
                });
            return;
        }

        try {
            if (interaction.isAutocomplete() && command.autocomplete) {
                await command.autocomplete(this.#client, interaction);
            } else if (
                interaction.isChatInputCommand() ||
                interaction.isMessageContextMenuCommand()
            ) {
                await command.execute(this.#client, interaction);
            }
        } catch (err) {
            this.#client.logger.error(
                `Une erreur est survenue lors de l'exécution de la commande <${command.data.name}>: ${JSON.stringify(err)}`,
            );

            if (
                !("deferred" in interaction) ||
                !("replied" in interaction) ||
                !("reply" in interaction) ||
                !("followUp" in interaction) ||
                !("editReply" in interaction)
            )
                return;

            const replyOptions = {
                content:
                    "❌ **Oups!** - Une erreur est survenue en essayant cette commande. Reporte-le à un membre du Staff s'il te plaît!",
                ephemeral: true,
            };
            if (interaction.deferred) {
                await interaction.editReply(replyOptions.content);
            } else if (interaction.replied) {
                await interaction.followUp(replyOptions);
            } else {
                await interaction.reply(replyOptions);
            }
        }
    }

    /**
     * Side-effect function to log the usage of the command.
     * @param message The message
     * @param command The command
     * @param isAuthorized Whether the user responsible of the message is authorized to use the command or not.
     */
    #logUsage(interaction: T, command: Command, isAuthorized: boolean): void {
        let channelInfo: string;
        const channel = interaction.channel;
        if (!channel) {
            channelInfo = "dans un canal inconnu";
        } else {
            channelInfo =
                channel.type === ChannelType.GuildText
                    ? `dans #${channel.name} (${channel.id})`
                    : "en DM";
        }
        const author = interaction.user;
        this.#client.logger.info(
            `${author.tag} (${author.id}) a utilisé '${command.data.name}' ${channelInfo} ${isAuthorized ? "avec" : "sans"} autorisation`,
        );
    }

    async #checkAuthorization(
        interaction: T,
        command: Command,
    ): Promise<AuthorizationResponse> {
        const { ownerIds, communitymanagerRoleid, adminRoleid } =
            this.#client.config;

        const member = await interaction.guild?.members.fetch(
            interaction.user.id,
        );
        if (!member) {
            return {
                error: "❌ **Oups!** - Je n'ai pas pu récupérer vos informations de membre. Réessayez plus tard.",
            };
        }

        const canBypassAuthorization =
            ownerIds.includes(interaction.user.id) ||
            member?.roles.cache.has(communitymanagerRoleid) ||
            member?.roles.cache.has(adminRoleid);
        if (command.ownerOnly && !canBypassAuthorization) {
            return {
                error: "❌ **Oups!** - Cette commande est réservée à un nombre limité de personnes dont vous ne faites pas partie.",
            };
        }

        return {};
    }
}
