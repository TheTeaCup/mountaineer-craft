import { Job } from "../types/job";
import logger from "../utils/logger";
import playerAnalyticsClient from "../utils/playerAnalyticsClient";

const job: Job = {
  name: "playersOnline",
  interval: 60000, // every minute
  runOnStart: true,

  async run() {
    logger.info("Fetching online players list...");

    const res = await playerAnalyticsClient.request("/v1/playersOnline");

    const data = await res.json();

    console.log("players online:", data.map((p: any) => p.name).join(", "));

    // Example: query minecraft server
    // add a role to a user or remove it based on whether they are online or not
  },
};

export default job;
