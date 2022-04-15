import { Board } from "./board";
import { Move } from "./move";

export class BoardPopOut implements Board {
  public readonly __type = "BoardPopOut";
  public readonly invalid: boolean;
  public readonly slots: ("R" | "Y" | "-")[][];
  public readonly winner?: "RED" | "YELLOW" | "DRAW";

  applyMove(move: Move, turn: "RED_TURN" | "YELLOW_TURN"): Board {
    const future = new BoardPopOut();
    return future;
  }
}
