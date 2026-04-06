import { ButtonInteraction } from "discord.js";
import handleRoleSelect from "./roleSelect.js";

export async function handleButton(interaction: ButtonInteraction) {
  const { customId } = interaction;

  // ANY ROLE BUTTON (ends with _role)
  if (customId.endsWith("_role")) {
    return handleRoleSelect(interaction);
  }
}
