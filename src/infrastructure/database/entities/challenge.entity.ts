import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Difficulty, ChallengeStatus } from "@domain/entities/challenge.entity"

@Entity("challenges")
export class ChallengeEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column("text")
  description: string

  @Column({
    type: "enum",
    enum: Difficulty,
    default: Difficulty.EASY,
  })
  difficulty: Difficulty

  @Column("simple-array")
  tags: string[]

  @Column({ name: "time_limit", default: 5000 })
  timeLimit: number

  @Column({ name: "memory_limit", default: 256 })
  memoryLimit: number

  @Column({
    type: "enum",
    enum: ChallengeStatus,
    default: ChallengeStatus.DRAFT,
  })
  status: ChallengeStatus

  @Column({ name: "course_id" })
  courseId: string

  @Column({ name: "created_by" })
  createdBy: string

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
