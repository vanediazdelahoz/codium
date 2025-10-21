import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { SubmissionStatus, Language } from "@domain/entities/submission.entity"

@Entity("submissions")
export class SubmissionEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "user_id" })
  userId: string

  @Column({ name: "challenge_id" })
  challengeId: string

  @Column({ name: "course_id" })
  courseId: string

  @Column("text")
  code: string

  @Column({
    type: "enum",
    enum: Language,
  })
  language: Language

  @Column({
    type: "enum",
    enum: SubmissionStatus,
    default: SubmissionStatus.QUEUED,
  })
  status: SubmissionStatus

  @Column({ default: 0 })
  score: number

  @Column({ name: "time_ms_total", default: 0 })
  timeMsTotal: number

  @Column({ name: "memory_used_mb", type: "float", default: 0 })
  memoryUsedMb: number

  @Column({ name: "test_case_results", type: "jsonb", default: [] })
  testCaseResults: any[]

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
