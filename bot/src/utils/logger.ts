import chalk from "chalk";
import { version, WebhookClient } from "discord.js";
import { config } from "../config";

const webhook = new WebhookClient({
  url: config.DISCORD_LOG_WEBHOOK_URL,
});

const logger = {
  info(text: string): void {
    console.log(chalk.blue(text));
  },

  warn(text: string, warn?: string): void {
    console.log(chalk.yellow(`${text} ${warn ?? ""}`.trim()));
  },

  async error(text: string, err?: string): Promise<void> {
    console.log(chalk.red(`${text} ${err ?? ""}`.trim()));

    try {
      await webhook.send({
        content: `❌ ${text} ${err ?? ""}`.trim(),
      });
    } catch {
      console.log(chalk.red("Failed to send webhook log"));
    }
  },

  async toDiscord(text: string): Promise<void> {
    try {
      await webhook.send({
        content: text,
      });
    } catch (err) {
      console.log(chalk.red("Failed to send webhook log"));
    }
  },

  start(): void {
    console.log(
      chalk.hex("#228B22")(
        `
        
         __  __                        _        _                           
        |  \\/  |                      | |      (_)                          
        | \\  / | ___  _   _ _ __   ___| |_ __ _ _ _ __   ___  ___ _ __      
        | |\\/| |/ _ \\| | | | '_ \\ / __| __/ _\` | | '_ \\ / _ \\/ _ \\ '__|     
        | |  | | (_) | |_| | | | | (__| || (_| | | | | |  __/  __/ |        
        |_|  |_|\\___/ \\__,_|_| |_|\\___|\\__\\__,_|_|_| |_|\\___|\\___|_|        
                                                                            
              Mountaineer Helper - Minecraft Server Assistant
              "Helping Mountaineers One Command at a Time"
        
              Node Version: ${process.version}
              Discord.js Version: ${version}
        
        `,
      ),
    );
  },
};

export default logger;
