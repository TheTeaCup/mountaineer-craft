import { ClientEvents } from "discord.js";
import { ExtendedClient } from "./client";

export interface Event {
  name: keyof ClientEvents;
  once?: boolean;
  execute: (...args: any[]) => void | Promise<void>;
}
