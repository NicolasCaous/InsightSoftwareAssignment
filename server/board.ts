import { Move } from "./move";

export interface Board {
  readonly __type: "BoardStandard" | "BoardPopOut"; // This is needed because javascript reflection is poor
  readonly invalid: boolean;
  readonly slots: ("R" | "Y" | "-")[][];
  readonly winner?: "RED" | "YELLOW" | "DRAW";

  applyMove(move: Move, turn: "RED_TURN" | "YELLOW_TURN"): Board;
}
