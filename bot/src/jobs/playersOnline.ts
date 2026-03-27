import { Job } from "../types/job";
import logger from "../utils/logger";
import playerAnalyticsClient from "../utils/playerAnalyticsClient";

const job: Job = {
  name: "playersOnline",
  interval: 60000, // every minute
  runOnStart: true,

  async run(client) {
    const res = await playerAnalyticsClient.request("/v1/playersOnline");

    const players = await res.json();

    const guild = await client.guilds.fetch("1465492057408802846");
    const role = await guild.roles.fetch("1479960688146256124");

    if (!role) {
      logger.error("Online role not found");
      return;
    }

    if (players.length === 0) {
      return;
    }

    const onlineNames = players.map((p: any) => p.name);
    logger.info("players online: " + onlineNames);

    await guild.members.fetch();

    for (const member of guild.members.cache.values()) {
      const nameLower = member.displayName.toLowerCase();
      const hasRole = member.roles.cache.has(role.id);
      const isOnline = onlineNames.includes(nameLower);

      if (isOnline && !hasRole) {
        await member.roles.add(role);
        logger.info(`Added online role to ${member.displayName}`);
      } else if (!isOnline && hasRole) {
        await member.roles.remove(role);
        logger.info(`Removed online role from ${member.displayName}`);
      }
    }
  },
};

export default job;
