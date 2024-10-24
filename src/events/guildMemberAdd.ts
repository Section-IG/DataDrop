import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Events,
    type GuildMember,
} from "discord.js";

import type { DatadropClient } from "../datadrop.js";
import type { AnnounceConfiguration } from "../models/Configuration.js";

export default {
    name: Events.GuildMemberAdd,
    execute: guildMemberAdd,
};

async function guildMemberAdd(client: DatadropClient, member: GuildMember) {
    if (member.user.bot) return;
    client.logger.info(
        `L'utilisateur <${member.displayName} a rejoint le serveur.`,
    );

    const {
        announce,
        informationsChannelid,
        faqChannelid,
        rolesChannelid,
        comiteeChannelid,
    } = client.config;
    const annoncesRole = await member.guild.roles.fetch(announce.roleid);

    const userFromDatabase = await client.database.read(member.id);
    if (userFromDatabase?.isDeleted) {
        await client.database.undoDelete(member.id);
    }

    const embed = generateEmbed(
        informationsChannelid,
        faqChannelid,
        comiteeChannelid,
        rolesChannelid,
        announce,
    );
    const linkAccountButton = new ButtonBuilder()
        .setLabel("Lier son compte")
        .setEmoji("🔗")
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`lae${member.id}`);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        linkAccountButton,
    );

    try {
        if (annoncesRole) {
            await member.roles.add(annoncesRole);
            client.logger.info(
                `Le rôle <${annoncesRole.name}> a été ajouté à <${member.user.tag}> à l'entrée de la guilde`,
            );
        }

        await member.send({ embeds: [embed], components: [row] });
        client.logger.info(
            `Un DM a été envoyé à <${member.user.tag}> à son entrée dans la guilde`,
        );
    } catch (err: unknown) {
        client.logger.error((<Error>err).message);
    }
}

function generateEmbed(
    informationsChannelid: string,
    faqChannelid: string,
    comiteeChannelid: string,
    rolesChannelid: string,
    announce: AnnounceConfiguration,
) {
    const fields = [
        {
            name: "1. Lie ton compte",
            value: `Pour accéder au serveur, tu dois lier ton compte Discord avec ton adresse Hénallux. Pour se faire, rien de plus simple que de cliquer sur le bouton ci-dessous et remplir le formulaire! Tu recevras un code par email qu'il faudra envoyer ici!`,
        },
        {
            name: "2. Change ton pseudo",
            value: `Sur Discord, tu peux changer ton pseudo sur chaque serveur (tu as donc un pseudo différent par serveur!). Pour cela, fais un clic-droit sur l'icône du serveur en question et sélectionne **Changer le pseudo**.`,
        },
        {
            name: "3. Lis les canaux importants",
            value: `En arrivant, tu vas être un peu perdu. C'est normal, il y a beaucoup de choses et c'est pas forcément simple à suivre.\nOn te conseille d'abord de jeter un oeil aux différents canaux listés ci-dessous :\n- <#${informationsChannelid}>\n- <#${faqChannelid}>\n- <#${comiteeChannelid}>\n- <#${rolesChannelid}>\n- <#${announce.channelid}>`,
        },
    ];

    return new EmbedBuilder()
        .setColor(0x117da3)
        .setThumbnail(
            "https://cdn.discordapp.com/icons/288659194737983489/6d9aa353290265c6587ac75fd4247f71.png",
        )
        .setTitle("Salut toi!")
        .setDescription(
            `Bienvenue sur le serveur Discord non-officiel de la section **Informatique Orientation _Développement d'Application_** de l'IESN. Ce serveur est une initiative étudiante et n'est donc pas une plateforme de communication officielle de la Haute-École Namur-Liège-Luxembourg.\n\nPour bien commencer l'année, on te recommande de suivre les quelques étapes suivantes :`,
        )
        .addFields(fields)
        .setFooter({
            text: "Le Comité IODA",
            iconURL:
                "https://cdn.discordapp.com/icons/491312065785364482/c9d724c34519c57d3cc1c28f79813f73.png",
        })
        .setTimestamp();
}
