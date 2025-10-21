export class TestCase {
  id: string
  challengeId: string
  input: string
  expectedOutput: string
  isHidden: boolean
  points: number
  order: number
  createdAt: Date

  constructor(partial: Partial<TestCase>) {
    Object.assign(this, partial)
  }

  isVisible(): boolean {
    return !this.isHidden
  }
}
