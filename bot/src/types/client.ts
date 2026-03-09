import { Client, Collection } from "discord.js";
import { SlashCommand } from "./command";

export class ExtendedClient extends Client {
  public commands: Collection<string, SlashCommand>;

  constructor(options: any) {
    super(options);
    this.commands = new Collection();
  }
}
