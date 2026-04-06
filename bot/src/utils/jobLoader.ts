import fs from "fs";
import path, { dirname } from "path";
import cron from "node-cron";
import { Job } from "../types/job.js";
import { fileURLToPath, pathToFileURL } from "url";
import logger from "./logger.js";

export async function loadJobs(client: import("discord.js").Client) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const jobsPath = path.join(__dirname, "../jobs");
  const files = fs.readdirSync(jobsPath);

  for (const file of files) {
    if (!file.endsWith(".js") && !file.endsWith(".ts")) continue;

    const moduleUrl = pathToFileURL(path.join(jobsPath, file)).href;
    const jobModule = await import(moduleUrl);
    const job: Job = jobModule.default;

    logger.info(`Loaded job: ${job.name}`);

    // run immediately if configured
    if (job.runOnStart) {
      logger.info(`Running ${job.name} on startup`);
      job.run(client).catch(console.error);
    }

    // cron schedule
    if (job.schedule) {
      cron.schedule(job.schedule, async () => {
        try {
          await job.run(client);
        } catch (err) {
          logger.error(`Job failed: ${job.name} \n ${err}`);
        }
      });
    }

    // interval
    if (job.interval) {
      setInterval(async () => {
        try {
          await job.run(client);
        } catch (err) {
          logger.error(`Job failed: ${job.name} \n ${err}`);
        }
      }, job.interval);
    }
  }
}
