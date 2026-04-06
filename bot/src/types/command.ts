import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  ChatInputCommandInteraction,
} from "discord.js";

export interface SlashCommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
