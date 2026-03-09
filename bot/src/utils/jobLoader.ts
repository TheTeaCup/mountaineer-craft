import fs from "fs";
import path from "path";
import cron from "node-cron";
import { Job } from "../types/job";
import { pathToFileURL } from "url";
import logger from "./logger";

export async function loadJobs() {
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
      job.run().catch(console.error);
    }

    // cron schedule
    if (job.schedule) {
      cron.schedule(job.schedule, async () => {
        try {
          await job.run();
        } catch (err) {
          logger.error(`Job failed: ${job.name} \n ${err}`);
        }
      });
    }

    // interval
    if (job.interval) {
      setInterval(async () => {
        try {
          await job.run();
        } catch (err) {
          logger.error(`Job failed: ${job.name} \n ${err}`);
        }
      }, job.interval);
    }
  }
}
