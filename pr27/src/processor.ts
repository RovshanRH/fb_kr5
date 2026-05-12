import { delay } from "./utils.js";
import type { TaskMessage } from "./types.js";

export async function processTask(
  task: TaskMessage,
  workerName: string,
): Promise<void> {
  const processingMs = task.simulation?.processingMs ?? 1000;
  const failForAttempts = task.simulation?.failForAttempts ?? 0;

  console.log(
    `[${workerName}] start task ${task.id} (attempt ${task.attempt})`,
  );
  console.log(`[${workerName}] type=${task.type}`, task.payload);

  await delay(processingMs);

  if (task.attempt <= failForAttempts) {
    throw new Error(`Simulated failure for attempt ${task.attempt}`);
  }

  console.log(`[${workerName}] finished task ${task.id}`);
}
