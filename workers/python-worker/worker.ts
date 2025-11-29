import Bull, { Job } from "bull";
import { PrismaClient } from "@prisma/client";
import Docker from "dockerode";

const prisma = new PrismaClient();
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = Number.parseInt(process.env.REDIS_PORT || "6379");

const submissionQueue = new Bull("submissions", {
  redis: { host: REDIS_HOST, port: REDIS_PORT },
});

console.log(`[Python Worker] Conectado a Redis en ${REDIS_HOST}:${REDIS_PORT}`);
console.log("[Python Worker] Esperando trabajos...");

interface SubmissionJobData {
  submissionId: string;
  userId?: string;
  challengeId?: string;
  code?: string;
  language?: string;
  testCases?: Array<{ testCaseId: string; input: string; expectedOutput: string }>;
}

async function executeContainer(params: {
  image: string;
  cmd: string[];
  code?: string;
  input: string;
  limits: { timeout: number; memory: number; cpus: number };
  fileName?: string;
  skipWrite?: boolean;
}): Promise<{ output: string; error?: string; timeMs: number; exitCode: number }> {
  const startTime = Date.now();
  let container: any;

  try {
    container = await docker.createContainer({
      Image: params.image,
      Cmd: params.cmd,
      OpenStdin: true,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      StdinOnce: false,
      HostConfig: {
        NetworkMode: "none",
        Memory: params.limits.memory * 1024 * 1024,
        MemorySwap: params.limits.memory * 1024 * 1024,
        CpuQuota: Math.floor(params.limits.cpus * 100000),
        PidsLimit: 10,
        ReadonlyRootfs: false,
        CapDrop: ["ALL"],
        SecurityOpt: ["no-new-privileges:true"],
      },
    });

    if (params.code && !params.skipWrite && params.fileName) {
      const tarBuffer = createTarBuffer(params.fileName, params.code);
      try {
        await container.putArchive(tarBuffer, { path: "/tmp" });
      } catch (e: any) {
        console.warn("Could not write file into container:", e.message);
      }
    }

    await container.start();

    const stream = await container.attach({ stream: true, stdin: true, stdout: true, stderr: true });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    stream.on("data", (chunk: Buffer) => {
      if (chunk.length > 8) {
        const streamType = chunk[0];
        const data = chunk.slice(8);
        if (streamType === 1) stdoutChunks.push(data);
        if (streamType === 2) stderrChunks.push(data);
      }
    });

    // send input
    stream.write(params.input || "");
    stream.end();

    const output = await Promise.race([
      new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
        stream.on("end", () => {
          resolve({ stdout: Buffer.concat(stdoutChunks).toString(), stderr: Buffer.concat(stderrChunks).toString() });
        });
        stream.on("error", reject);
      }),
      new Promise<{ stdout: string; stderr: string }>((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT")), params.limits.timeout),
      ),
    ]);

    const timeMs = Date.now() - startTime;

    const exitData = await container.wait();
    const exitCode = exitData.StatusCode || 0;

    return { output: output.stdout, error: output.stderr || undefined, timeMs, exitCode };
  } catch (error: any) {
    const timeMs = Date.now() - startTime;
    if (error.message === "TIMEOUT") {
      return { output: "", error: "TIME_LIMIT_EXCEEDED", timeMs, exitCode: -1 };
    }
    return { output: "", error: `RUNTIME_ERROR: ${error.message}`, timeMs, exitCode: 1 };
  } finally {
    if (container) {
      try {
        await container.remove({ force: true });
      } catch (e: any) {
        console.warn("Failed to remove container:", e.message);
      }
    }
  }
}

function createTarBuffer(fileName: string, content: string): Buffer {
  const fileContent = Buffer.from(content);
  const fileNameBytes = Buffer.from(fileName);
  const header = Buffer.alloc(512);
  fileNameBytes.copy(header, 0);
  header.write('0000644\0', 100);
  header.write('0000000\0', 108);
  header.write('0000000\0', 116);
  header.write((fileContent.length).toString(8).padStart(11, '0') + '\0', 124);
  header.write(Math.floor(Date.now() / 1000).toString(8).padStart(11, '0') + '\0', 136);
  let checksum = 0;
  for (let i = 0; i < 512; i++) {
    if (i >= 148 && i < 156) checksum += 32; else checksum += header[i];
  }
  header.write(checksum.toString(8).padStart(6, '0') + '\0', 148);
  const padding = Buffer.alloc((512 - (fileContent.length % 512)) % 512);
  const endOfArchive = Buffer.alloc(1024);
  return Buffer.concat([header, fileContent, padding, endOfArchive]);
}

function compareOutput(actual: string, expected: string): string {
  if (actual == null) actual = '';
  if (expected == null) expected = '';
  const actualTrimmed = actual.trim();
  const expectedTrimmed = expected.trim();

  if (actualTrimmed === expectedTrimmed) return 'ACCEPTED';

  const actualLines = actualTrimmed.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const expectedLines = expectedTrimmed.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (actualLines.length === expectedLines.length && actualLines.every((ln, i) => ln === expectedLines[i])) return 'ACCEPTED';

  const actualNum = parseFloat(actualTrimmed);
  const expectedNum = parseFloat(expectedTrimmed);
  if (!isNaN(actualNum) && !isNaN(expectedNum) && actualNum === expectedNum) return 'ACCEPTED';

  return 'WRONG_ANSWER';
}

submissionQueue.process('process-submission', async (job: Job<SubmissionJobData>) => {
  const data = job.data;
  const submissionId = data.submissionId;
  const language = (data.language || '').toString().toUpperCase();

  if (!submissionId) {
    throw new Error('No submissionId in job');
  }

  if (!['PYTHON', 'PY'].includes(language) && language !== 'PYTHON') {
    // This worker only handles Python in this implementation
    console.log(`[Python Worker] Ignorando submission ${submissionId} (language=${language})`);
    return;
  }

  console.log(`[Python Worker] Procesando submission ${submissionId}`);

  // Marcar RUNNING
  try {
    await prisma.submission.update({ where: { id: submissionId }, data: { status: 'RUNNING' } as any });
  } catch (e: any) {
    console.warn('Could not mark submission RUNNING:', e.message);
  }

  const testCases = data.testCases || [];
  let passedCount = 0;
  let totalTime = 0;
  const resultsToCreate: any[] = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    try {
      const runResult = await executeContainer({
        image: 'python:3.11-alpine',
        cmd: ['python', '/tmp/solution.py'],
        code: data.code || '',
        input: tc.input || '',
        limits: { timeout: 5000, memory: 256, cpus: 1 },
        fileName: 'solution.py',
      });

      const status = compareOutput(runResult.output, tc.expectedOutput);

      resultsToCreate.push({
        submissionId,
        testCaseId: tc.testCaseId,
        status: status === 'ACCEPTED' ? 'ACCEPTED' : 'WRONG_ANSWER',
        timeMs: runResult.timeMs,
        memoryMb: 0,
        output: runResult.output,
        error: runResult.error || null,
      });

      if (status === 'ACCEPTED') passedCount++;
      totalTime += runResult.timeMs;
      console.log(`[Python Worker] TC ${i + 1}/${testCases.length}: ${status} (${runResult.timeMs}ms)`);
    } catch (err: any) {
      console.error(`[Python Worker] Error ejecutando test case ${i + 1}:`, err.message);
      resultsToCreate.push({ submissionId, testCaseId: tc.testCaseId, status: 'RUNTIME_ERROR', timeMs: 0, memoryMb: 0, output: null, error: err.message });
    }
  }

  // Persistir resultados y actualizar submission
  try {
    if (resultsToCreate.length > 0) {
      try {
        await prisma.testCaseResult.createMany({ data: resultsToCreate as any, skipDuplicates: true });
      } catch (e) {
        for (const r of resultsToCreate) {
          await prisma.testCaseResult.create({ data: r });
        }
      }
    }

    const allPassed = passedCount === testCases.length && testCases.length > 0;
    const finalStatus = allPassed ? 'ACCEPTED' : 'WRONG_ANSWER';
    const score = allPassed ? 100 : Math.round((passedCount / Math.max(1, testCases.length)) * 100);

    await prisma.submission.update({ where: { id: submissionId }, data: { status: finalStatus as any, score, timeMsTotal: totalTime } as any });

    console.log(`[Python Worker] Submission ${submissionId} finalizado: ${finalStatus} (${passedCount}/${testCases.length} passed, ${totalTime}ms total)`);
    return { submissionId, finalStatus, passedCount, totalTestCases: testCases.length, totalTimeMs: totalTime };
  } catch (e: any) {
    console.error('[Python Worker] Error guardando resultados:', e.message);
    try {
      await prisma.submission.update({ where: { id: submissionId }, data: { status: 'RUNTIME_ERROR' } as any });
    } catch (err: any) {
      console.warn('Could not mark submission RUNTIME_ERROR:', err.message);
    }
    throw e;
  }
});

submissionQueue.on('completed', (job: Job) => {
  console.log(`[Python Worker] Job ${job.id} completado`);
});

submissionQueue.on('failed', (job: Job, err: Error) => {
  console.error(`[Python Worker] Job ${job.id} falló:`, err.message);
});

process.on('SIGTERM', async () => {
  console.log('[Python Worker] Cerrando...');
  await submissionQueue.close();
  process.exit(0);
});