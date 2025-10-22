import { Injectable } from "@nestjs/common";
import Bull from "bull"; // CORREGIDO: Importar como default export

export interface SubmissionJob {
  submissionId: string;
  challengeId: string;
  userId: string;
  language: string;
  code: string;
}

@Injectable()
export class BullService {
  private submissionsQueue: Bull.Queue; // Usar el tipo Bull.Queue

  constructor() {
    // CORREGIDO: Instanciar usando la importación por defecto
    this.submissionsQueue = new Bull("submissions"); 
  }

  // ... (el resto de los métodos no necesitan cambios)
  async addSubmissionJob(job: SubmissionJob): Promise<void> {
    await this.submissionsQueue.add("process-submission", job, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    });
  }

  async getJobStatus(jobId: string) {
    const job = await this.submissionsQueue.getJob(jobId);
    if (!job) return null;

    return {
      id: job.id,
      state: await job.getState(),
      progress: job.progress(),
      data: job.data,
    };
  }
}