import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const workerCount = Number(process.env.WORKER_COUNT ?? 2);
const childProcesses: ReturnType<typeof spawn>[] = [];
const currentDir = dirname(fileURLToPath(import.meta.url));
const workerScriptPath = resolve(currentDir, "worker.ts");

function createChildEnv(workerName: string): NodeJS.ProcessEnv {
  const childEnv: NodeJS.ProcessEnv = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      childEnv[key] = value;
    }
  }

  childEnv.WORKER_NAME = workerName;

  return childEnv;
}

function stopChildren(exitCode = 0): void {
  for (const childProcess of childProcesses) {
    childProcess.kill();
  }

  process.exit(exitCode);
}

for (let index = 0; index < workerCount; index += 1) {
  const workerName = `worker-${index + 1}`;
  const childProcess = spawn(
    process.execPath,
    ["--import", "tsx", workerScriptPath],
    {
      stdio: "inherit",
      env: createChildEnv(workerName),
    },
  );

  childProcesses.push(childProcess);

  childProcess.on("exit", (code) => {
    console.log(`[launcher] ${workerName} exited with code ${code ?? 0}`);
  });
}

process.on("SIGINT", () => stopChildren(0));
process.on("SIGTERM", () => stopChildren(0));

console.log(`[launcher] started ${workerCount} worker processes`);
