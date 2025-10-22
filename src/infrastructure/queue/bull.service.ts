import { Injectable } from "@nestjs/common";
import { Queue } from "bull"; // Asegúrate de que no diga 'import type'

export interface SubmissionJob {
  submissionId: string;
  challengeId: string;
  userId: string;
  language: string;
  code: string;
}

@Injectable()
export class BullService {
  private submissionsQueue: Queue;

  constructor() {
    this.submissionsQueue = new Queue("submissions");
  }

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