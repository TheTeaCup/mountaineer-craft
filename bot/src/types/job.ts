export interface Job {
  name: string;
  interval?: number;
  runOnStart?: boolean;
  run(client: import("discord.js").Client): Promise<void>; // pass the client
  schedule?: string;
}
