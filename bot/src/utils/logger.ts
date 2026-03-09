import chalk from "chalk";
import { version } from "discord.js";

const logger = {
  info(text: string): void {
    console.log(chalk.blue(text));
  },

  warn(text: string, warn?: string): void {
    console.log(chalk.yellow(`${text} ${warn ?? ""}`.trim()));
  },

  error(text: string, err?: string): void {
    console.log(chalk.red(`${text} ${err ?? ""}`.trim()));
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
