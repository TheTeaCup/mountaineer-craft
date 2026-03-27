import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { SlashCommand } from "../types/command";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("map")
    .setDescription("Replies with our Minecraft Server's Online Map"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(
      "🌍 Our Minecraft Server's Online Map: <https://map.mountaineercraft.net>"
    );
  },
};

export default command;
