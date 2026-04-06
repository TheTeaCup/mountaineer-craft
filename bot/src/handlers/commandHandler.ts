import { Interaction, MessageFlags } from "discord.js";
import { ExtendedClient } from "../types/client";

async function handleCommand(interaction: Interaction, client: ExtendedClient) {
  if (!interaction.guild) return;

  // Only handle slash commands
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "❌ Error executing command.",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "❌ Error executing command.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}

export default handleCommand;
