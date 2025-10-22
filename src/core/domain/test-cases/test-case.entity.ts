interface TestCaseProps {
  id: string;
  challengeId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  points: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export class TestCase {
  public readonly id: string;
  public readonly challengeId: string;
  public readonly input: string;
  public readonly expectedOutput: string;
  public readonly isHidden: boolean;
  public readonly points: number;
  public readonly order: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  // CORREGIDO: El constructor ahora acepta un solo objeto de propiedades
  constructor(props: TestCaseProps) {
    this.id = props.id;
    this.challengeId = props.challengeId;
    this.input = props.input;
    this.expectedOutput = props.expectedOutput;
    this.isHidden = props.isHidden;
    this.points = props.points;
    this.order = props.order;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isVisible(): boolean {
    return !this.isHidden;
  }
}