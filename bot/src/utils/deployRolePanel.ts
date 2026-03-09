import { TextChannel } from "discord.js";
import { rolePanel } from "../data/rolePanel.js";
import { buildRolePanel } from "./buildRolePanel.js";

export async function deployRolePanel(client: any) {

  const channel = await client.channels.fetch(rolePanel.channelId) as TextChannel;

  const { embed, row } = buildRolePanel();

  try {

    const message = await channel.messages.fetch(rolePanel.messageId);

    await message.edit({
      embeds: [embed],
      components: [row]
    });

  } catch {

    const message = await channel.send({
      embeds: [embed],
      components: [row]
    });

    console.log("New role panel created:", message.id);
  }
}