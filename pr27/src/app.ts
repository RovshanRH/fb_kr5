import express from "express";
import { randomUUID } from "node:crypto";
import type { Channel } from "amqplib";
import { enqueueTask } from "./rabbitmq.js";
import type { TaskRequestBody, TaskMessage } from "./types.js";
import { isPlainObject } from "./utils.js";

function normalizeTaskRequest(body: unknown): TaskRequestBody {
  if (!isPlainObject(body)) {
    throw new Error("Request body must be an object");
  }

  const { type, payload, simulation } = body as Record<string, unknown>;

  if (typeof type !== "string" || type.trim().length === 0) {
    throw new Error('Field "type" must be a non-empty string');
  }

  if (!isPlainObject(payload)) {
    throw new Error('Field "payload" must be an object');
  }

  if (simulation !== undefined && !isPlainObject(simulation)) {
    throw new Error('Field "simulation" must be an object when provided');
  }

  return {
    type: type.trim(),
    payload,
    simulation: simulation as TaskRequestBody["simulation"] | undefined,
  };
}

export function createApp(channel: Channel) {
  const app = express();

  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.post("/tasks", async (request, response, next) => {
    try {
      const taskRequest = normalizeTaskRequest(request.body);
      const message: TaskMessage = {
        id: randomUUID(),
        type: taskRequest.type,
        payload: taskRequest.payload,
        simulation: taskRequest.simulation,
        attempt: 1,
        createdAt: new Date().toISOString(),
      };

      await enqueueTask(channel, message);

      response.status(202).json({
        accepted: true,
        task: message,
      });
    } catch (error) {
      next(error);
    }
  });

  app.use(
    (
      error: unknown,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction,
    ) => {
      const message = error instanceof Error ? error.message : "Unknown error";
      response.status(400).json({
        error: message,
      });
    },
  );

  return app;
}
