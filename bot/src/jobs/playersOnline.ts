import { Job } from "../types/job";
import logger from "../utils/logger";

const job: Job = {
  name: "playersOnline",
  interval: 60000, // every minute
  runOnStart: true,

  async run() {
    logger.info("Fetching online players list...");

    // Example: query minecraft server
    // add a role to a user or remove it based on whether they are online or not
  },
};

export default job;
