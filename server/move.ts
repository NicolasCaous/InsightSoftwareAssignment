export interface Move {
  readonly __type: "MoveAdd" | "MovePopOut"; // This is needed because javascript reflection is poor
  readonly column: number;
}

export class MoveAdd implements Move {
  public readonly __type = "MoveAdd";

  constructor(public readonly column: number) {}
}

export class MovePopOut implements Move {
  public readonly __type = "MovePopOut";

  constructor(public readonly column: number) {}
}
