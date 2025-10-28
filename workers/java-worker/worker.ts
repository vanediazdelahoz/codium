import Bull from "bull"

const REDIS_HOST = process.env.REDIS_HOST || "localhost"
const REDIS_PORT = Number.parseInt(process.env.REDIS_PORT || "6379")

const submissionQueue = new Bull("submissions", {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
})

console.log(`[Java Worker] Conectado a Redis en ${REDIS_HOST}:${REDIS_PORT}`)
console.log("[Java Worker] Esperando trabajos...")

submissionQueue.process("process-submission", async (job) => {
  const { submissionId, language } = job.data

  if (language !== "JAVA") {
    return
  }

  console.log(`[Java Worker] Procesando submission ${submissionId}`)

  // STUB: Simulación de procesamiento
  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.log(`[Java Worker] Submission ${submissionId} procesado (STUB)`)

  return {
    submissionId,
    status: "PROCESSED",
    worker: "java",
  }
})

submissionQueue.on("completed", (job) => {
  console.log(`[Java Worker] Job ${job.id} completado`)
})

submissionQueue.on("failed", (job, err) => {
  console.error(`[Java Worker] Job ${job.id} falló:`, err.message)
})

process.on("SIGTERM", async () => {
  console.log("[Java Worker] Cerrando...")
  await submissionQueue.close()
  process.exit(0)
})
