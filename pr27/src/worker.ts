import { config } from "./config.js";
import {
  assertTaskTopology,
  connectRabbitMQ,
  decodeTaskMessage,
  enqueueTask,
} from "./rabbitmq.js";
import { clampDelay } from "./utils.js";
import { processTask } from "./processor.js";
import type { Channel, ConsumeMessage } from "amqplib";

async function handleMessage(
  channel: Channel,
  message: ConsumeMessage,
  workerName: string,
): Promise<void> {
  const task = decodeTaskMessage(message);
  const currentAttempt = message.properties.headers?.["x-task-attempt"];
  const attempt =
    typeof currentAttempt === "number" ? currentAttempt : task.attempt;

  const normalizedTask = {
    ...task,
    attempt,
  };

  try {
    await processTask(normalizedTask, workerName);
    channel.ack(message);
    return;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (attempt < config.maxTaskAttempts) {
      const nextAttempt = attempt + 1;
      const delayMs = clampDelay(
        config.baseRetryDelayMs,
        attempt,
        config.maxRetryDelayMs,
      );

      console.warn(
        `[${workerName}] retry task ${normalizedTask.id} after ${delayMs}ms (attempt ${attempt}/${config.maxTaskAttempts}): ${errorMessage}`,
      );

      await new Promise<void>((resolve) => {
        setTimeout(resolve, delayMs);
      });

      await enqueueTask(channel, {
        ...task,
        attempt: nextAttempt,
      });

      channel.ack(message);
      return;
    }

    console.error(
      `[${workerName}] dead-letter task ${normalizedTask.id}: ${errorMessage}`,
    );
    channel.nack(message, false, false);
  }
}

async function startWorker(workerName: string): Promise<void> {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();
  await assertTaskTopology(channel);
  await channel.prefetch(1);

  await channel.consume(config.queueName, (message: ConsumeMessage | null) => {
    if (!message) {
      return;
    }

    void handleMessage(channel, message, workerName).catch((error) => {
      console.error(`[${workerName}] unexpected failure`, error);
      channel.nack(message, false, true);
    });
  });

  console.log(`[${workerName}] waiting for messages from ${config.queueName}`);

  const shutdown = async () => {
    await channel.close().catch(() => undefined);
    await connection.close().catch(() => undefined);
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

const workerName = process.env.WORKER_NAME ?? `worker-${process.pid}`;

void startWorker(workerName).catch((error) => {
  console.error(`[${workerName}] failed to start`, error);
  process.exit(1);
});
