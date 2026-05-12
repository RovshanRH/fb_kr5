import "dotenv/config";

function readNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const value = Number(raw);
  if (Number.isNaN(value)) {
    throw new Error(`Invalid number in ${name}`);
  }

  return value;
}

export const config = {
  port: readNumber("PORT", 3000),
  rabbitmqUrl: process.env.RABBITMQ_URL ?? "amqp://localhost",
  queueName: process.env.TASKS_QUEUE ?? "tasks.queue",
  deadLetterQueueName: process.env.TASKS_DEAD_LETTER_QUEUE ?? "tasks.dead",
  deadLetterExchangeName: process.env.TASKS_DEAD_LETTER_EXCHANGE ?? "tasks.dlx",
  deadLetterRoutingKey:
    process.env.TASKS_DEAD_LETTER_ROUTING_KEY ?? "tasks.dead",
  maxTaskAttempts: readNumber("MAX_TASK_ATTEMPTS", 3),
  baseRetryDelayMs: readNumber("BASE_RETRY_DELAY_MS", 1000),
  maxRetryDelayMs: readNumber("MAX_RETRY_DELAY_MS", 30000),
};
