import { Module } from '@nestjs/common';
import { QueueModule } from './queue/queue.module';
import { RunnerService } from './runners/runner.service';
import { SubmissionProcessor } from './queue/processors/submission.processor';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [QueueModule],
  providers: [RunnerService, SubmissionProcessor, PrismaService],
  exports: [QueueModule, RunnerService, SubmissionProcessor],
})
export class InfrastructureModule {}
