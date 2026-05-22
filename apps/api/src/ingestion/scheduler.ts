import { runOpenAQIngestion } from "./openaq.js";

const INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

export function startScheduler(): void {
  runOpenAQIngestion().catch(console.error);
  setInterval(() => {
    runOpenAQIngestion().catch(console.error);
  }, INTERVAL_MS);
}
