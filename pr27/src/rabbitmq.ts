import amqplib, { type Channel, type ConsumeMessage } from "amqplib";
import { config } from "./config.js";
import type { TaskMessage } from "./types.js";

export type RabbitConnection = Awaited<ReturnType<typeof amqplib.connect>>;
export async function connectRabbitMQ(): Promise<RabbitConnection> {
  return amqplib.connect(config.rabbitmqUrl);
}

export async function assertTaskTopology(channel: Channel): Promise<void> {
  await channel.assertExchange(config.deadLetterExchangeName, "direct", {
    durable: true,
  });

  await channel.assertQueue(config.deadLetterQueueName, { durable: true });
  await channel.bindQueue(
    config.deadLetterQueueName,
    config.deadLetterExchangeName,
    config.deadLetterRoutingKey,
  );

  await channel.assertQueue(config.queueName, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": config.deadLetterExchangeName,
      "x-dead-letter-routing-key": config.deadLetterRoutingKey,
    },
  });
}

export function encodeTaskMessage(message: TaskMessage): Buffer {
  return Buffer.from(JSON.stringify(message));
}

export function decodeTaskMessage(message: ConsumeMessage): TaskMessage {
  return JSON.parse(message.content.toString()) as TaskMessage;
}

export async function enqueueTask(
  channel: Channel,
  message: TaskMessage,
): Promise<void> {
  const payload = encodeTaskMessage(message);

  const accepted = channel.sendToQueue(config.queueName, payload, {
    persistent: true,
    contentType: "application/json",
    messageId: message.id,
    headers: {
      "x-task-attempt": message.attempt,
      "x-task-id": message.id,
    },
  });

  if (!accepted) {
    await new Promise<void>((resolve) => {
      channel.once("drain", resolve);
    });
  }
}
