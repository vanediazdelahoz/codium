export class TestCase {
  constructor(
    public readonly id: string,
    public readonly challengeId: string,
    public readonly input: string,
    public readonly expectedOutput: string,
    public readonly isHidden: boolean,
    public readonly points: number,
    public readonly order: number,
  ) {}

  isVisible(): boolean {
    return !this.isHidden
  }
}
