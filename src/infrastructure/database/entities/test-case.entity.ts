import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"

@Entity("test_cases")
export class TestCaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "challenge_id" })
  challengeId: string

  @Column("text")
  input: string

  @Column("text", { name: "expected_output" })
  expectedOutput: string

  @Column({ name: "is_hidden", default: false })
  isHidden: boolean

  @Column({ default: 10 })
  points: number

  @Column({ default: 0 })
  order: number

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date
}
