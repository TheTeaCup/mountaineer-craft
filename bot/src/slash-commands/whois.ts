import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types/command";
import playerAnalyticsClient from "../utils/playerAnalyticsClient";
import logger from "../utils/logger";

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("whois")
        .setDescription("Look up a player")
        .addStringOption(option =>
            option
                .setName("player")
                .setDescription("Player username")
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const player = interaction.options.getString("player", true);
        await interaction.deferReply();
        const res = await playerAnalyticsClient.request(`/v1/player?player=${player}`);
        const playerData = await res.json();

        if (playerData.error) {
            if (playerData.error === "Given 'player' was not found in the database.") {
                await interaction.reply(`❌ Player not found.`);
                return;
            }
            await interaction.reply(`❌ An error occurred while fetching player data.`);
            logger.error(`Error fetching player data for ${player}: ${playerData.error}`);
            return;
        }

        console.log(playerData);

        const embed = new EmbedBuilder()
            .setTitle(`Player Info: ${playerData.info.name}`)
            .setThumbnail("https://crafthead.net/helm/" + playerData.info.name)
            .setDescription(`Currently In-Game: ${playerData.info.inGame ? "Yes" : "No"}
            Deaths: ${playerData.info.death_count}
            Sessions: ${playerData.info.session_count}`)
            .setFooter({ text: "This command is still a Work In Progress" })
            .setTimestamp();

        await interaction.editReply({
            embeds: [embed],
        });

    },
};

export default command;
