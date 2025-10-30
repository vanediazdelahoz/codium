import Bull, { Job } from "bull";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = Number.parseInt(process.env.REDIS_PORT || "6379");

const submissionQueue = new Bull("submissions", {
  redis: { host: REDIS_HOST, port: REDIS_PORT },
});

console.log(`[C++ Worker] Conectado a Redis en ${REDIS_HOST}:${REDIS_PORT}`);
console.log("[C++ Worker] Esperando trabajos...");

interface SubmissionJobData {
  submissionId: string;
  language: string;
}

submissionQueue.process("process-submission", async (job: Job<SubmissionJobData>) => {
  const { submissionId, language } = job.data;

  if (language !== "CPP") {
    return;
  }

  console.log(`[C++ Worker] Procesando submission ${submissionId}`);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(`[C++ Worker] Submission ${submissionId} procesado (STUB)`);

  return { status: "PROCESSED", worker: "cpp" };
});

submissionQueue.on("completed", (job: Job) => {
  console.log(`[C++ Worker] Job ${job.id} completado`);
});

submissionQueue.on("failed", (job: Job, err: Error) => {
  console.error(`[C++ Worker] Job ${job.id} falló:`, err.message);
});

process.on("SIGTERM", async () => {
  console.log("[C++ Worker] Cerrando...");
  await submissionQueue.close();
  process.exit(0);
});