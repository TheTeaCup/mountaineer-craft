import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { SlashCommand } from "../types/command";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("connect")
    .setDescription("Replies with connection info for our Minecraft Server"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(
      `To connect to our Minecraft Server, use the following address: \`play.mountaineercraft.net\`
        For bedrock edition, use: \`bedrock.mountaineercraft.net:19132\`
        `,
    );
  },
};

export default command;
