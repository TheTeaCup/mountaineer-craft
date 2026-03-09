export interface Job {
  name: string;
  schedule?: string; // cron schedule
  interval?: number; // optional interval in ms
  runOnStart?: boolean;
  run: () => Promise<void>;
}
