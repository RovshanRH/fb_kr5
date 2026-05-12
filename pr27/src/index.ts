import { config } from "./config.js";
import { assertTaskTopology, connectRabbitMQ } from "./rabbitmq.js";
import { createApp } from "./app.js";

async function main(): Promise<void> {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();
  await assertTaskTopology(channel);

  const app = createApp(channel);

  app.listen(config.port, () => {
    console.log(`[api] listening on http://localhost:${config.port}`);
  });

  const shutdown = async () => {
    await channel.close().catch(() => undefined);
    await connection.close().catch(() => undefined);
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

void main().catch((error) => {
  console.error("[api] failed to start", error);
  process.exit(1);
});
