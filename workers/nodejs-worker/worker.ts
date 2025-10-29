import Bull, { Job } from "bull";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = Number.parseInt(process.env.REDIS_PORT || "6379");

const submissionQueue = new Bull("submissions", {
  redis: { host: REDIS_HOST, port: REDIS_PORT },
});

console.log(`[NodeJS Worker] Conectado a Redis en ${REDIS_HOST}:${REDIS_PORT}`);
console.log("[NodeJS Worker] Esperando trabajos...");

interface SubmissionJobData {
  submissionId: string;
  language: string;
}

submissionQueue.process("process-submission", async (job: Job<SubmissionJobData>) => {
  const { submissionId, language } = job.data;

  if (language !== "NODEJS") {
    return;
  }

  console.log(`[NodeJS Worker] Procesando submission ${submissionId}`);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(`[NodeJS Worker] Submission ${submissionId} procesado (STUB)`);

  return { status: "PROCESSED", worker: "nodejs" };
});

submissionQueue.on("completed", (job: Job) => {
  console.log(`[NodeJS Worker] Job ${job.id} completado`);
});

submissionQueue.on("failed", (job: Job, err: Error) => {
  console.error(`[NodeJS Worker] Job ${job.id} falló:`, err.message);
});

process.on("SIGTERM", async () => {
  console.log("[NodeJS Worker] Cerrando...");
  await submissionQueue.close();
  process.exit(0);
});