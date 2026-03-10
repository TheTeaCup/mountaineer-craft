import { Events, ActivityType } from "discord.js";
import { ExtendedClient } from "../types/client";
import { deployRolePanel } from "../utils/deployRolePanel.js";
import chalk from "chalk";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: ExtendedClient) {
    console.log(
      chalk.green.bold(`[Mountaineer Helper] Bot is up and ready to go!`),
    );

    await deployRolePanel(client);

    const statuses = [
      { name: "Watching you play...", type: ActivityType.Watching },
      {
        name: "Watching the chat for commands...",
        type: ActivityType.Watching,
      },
    ];

    let index = 0;

    const updateStatus = () => {
      const status = statuses[index];

      client.user?.setPresence({
        activities: [{ name: status.name, type: status.type }],
        status: "online",
      });

      index = (index + 1) % statuses.length;
    };

    updateStatus(); // set immediately
    setInterval(updateStatus, 5 * 60 * 1000); // every 5 minutes
  },
};
