import { Board } from "./board";
import { Move } from "./move";

export class BoardPopOut implements Board {
  public readonly __type = "BoardPopOut";
  public readonly invalid: boolean;
  public readonly slots: ("R" | "Y" | "-")[][];
  public readonly winner?: "RED" | "YELLOW" | "DRAW";

  public readonly COLUMNS = 7;
  public readonly ROWS = 6;
  public readonly WIN_STREAK = 4;

  constructor(
    invalid?: boolean,
    slots?: ("R" | "Y" | "-")[][],
    winner?: "RED" | "YELLOW" | "DRAW"
  ) {
    this.invalid = invalid ?? false;
    this.slots = slots ?? Array(this.COLUMNS).fill(Array(this.ROWS).fill("-"));
    this.winner = winner;
  }

  private _cloneSlots(): ("R" | "Y" | "-")[][] {
    return JSON.parse(JSON.stringify(this.slots));
  }

  private _getSizeOfColumn(column: ("R" | "Y" | "-")[]): number {
    for (let r = 0; r < this.ROWS; ++r) if (column[r] === "-") return r;
    return this.ROWS;
  }

  applyMove(
    move: Move,
    turn: "RED_TURN" | "YELLOW_TURN",
    dryrun: boolean = false
  ): Board {
    let newSlots;

    if (dryrun) {
      newSlots = this._cloneSlots();
    } else {
      if (move.column < 0 || move.column >= this.COLUMNS)
        return new BoardPopOut(true); // This move is not allowed

      const columnSize = this._getSizeOfColumn(this.slots[move.column]);

      if (columnSize === 0 && move.__type === "MovePopOut")
        return new BoardPopOut(true); // Can't remove from a empty column
      if (columnSize === this.ROWS && move.__type === "MoveAdd")
        return new BoardPopOut(true); // Can't add to a full column

      newSlots = this._cloneSlots();

      if (move.__type === "MovePopOut") {
        newSlots[move.column].shift();
        newSlots[move.column].push("-");
      } else {
        newSlots[move.column][columnSize] = turn === "RED_TURN" ? "R" : "Y";
      }
    }

    // Check for winners
    let redWin = false;
    let yellowWin = false;

    let c: number;
    let r: number;
    let redStreak: number;
    let yellowStreak: number;

    const isInside = (c: number, r: number) =>
      c >= 0 && c < this.COLUMNS && r >= 0 && r < this.ROWS;

    // UL -> Upper Left
    // BL -> Bottom Left
    // UR -> Upper Right
    // BR -> Bottom Left

    // Diagonal UL to BR - Left starting point
    c = 0;
    r = this.WIN_STREAK - 1; // Optimization
    redStreak = yellowStreak = 0;
    while (r < this.ROWS) {
      // Optimization
      if (redWin && yellowWin) break;

      redStreak = yellowStreak = 0;
      c = 0;
      const oldR = r;
      while (isInside(c, r)) {
        if (newSlots[c][r] === "R") {
          redStreak += 1;
          yellowStreak = 0;
        } else if (newSlots[c][r] === "Y") {
          redStreak = 0;
          yellowStreak += 1;
        } else if (newSlots[c][r] === "-") {
          redStreak = yellowStreak = 0;
        }

        if (redStreak >= this.WIN_STREAK) redWin = true;
        if (yellowStreak >= this.WIN_STREAK) yellowWin = true;

        // Optimization
        if (redWin && yellowWin) break;

        c += 1;
        r -= 1;
      }
      r = oldR + 1;
    }

    // Diagonal UL to BR - Top starting point
    c = 1; // Optimization
    r = this.ROWS - 1;
    redStreak = yellowStreak = 0;
    // Optimization (should be c < this.COLUMNS)
    while (c < this.COLUMNS - this.WIN_STREAK + 1) {
      // Optimization
      if (redWin && yellowWin) break;

      redStreak = yellowStreak = 0;
      r = this.ROWS - 1;
      const oldC = c;
      while (isInside(c, r)) {
        if (newSlots[c][r] === "R") {
          redStreak += 1;
          yellowStreak = 0;
        } else if (newSlots[c][r] === "Y") {
          redStreak = 0;
          yellowStreak += 1;
        } else if (newSlots[c][r] === "-") {
          redStreak = yellowStreak = 0;
        }

        if (redStreak >= this.WIN_STREAK) redWin = true;
        if (yellowStreak >= this.WIN_STREAK) yellowWin = true;

        // Optimization
        if (redWin && yellowWin) break;

        c += 1;
        r -= 1;
      }
      c = oldC + 1;
    }

    // Diagonal UR to BL - Right starting point
    c = this.COLUMNS - 1;
    r = this.WIN_STREAK - 1; // Optimization
    redStreak = yellowStreak = 0;
    while (r < this.ROWS) {
      // Optimization
      if (redWin && yellowWin) break;

      redStreak = yellowStreak = 0;
      c = this.COLUMNS - 1;
      const oldR = r;
      while (isInside(c, r)) {
        if (newSlots[c][r] === "R") {
          redStreak += 1;
          yellowStreak = 0;
        } else if (newSlots[c][r] === "Y") {
          redStreak = 0;
          yellowStreak += 1;
        } else if (newSlots[c][r] === "-") {
          redStreak = yellowStreak = 0;
        }

        if (redStreak >= this.WIN_STREAK) redWin = true;
        if (yellowStreak >= this.WIN_STREAK) yellowWin = true;

        // Optimization
        if (redWin && yellowWin) break;

        c -= 1;
        r -= 1;
      }
      r = oldR + 1;
    }

    // Diagonal UR to BL - Top starting point
    c = this.COLUMNS - 2; // Optimization
    r = this.ROWS - 1;
    redStreak = yellowStreak = 0;
    // Optimization (should be c >= 0)
    while (c >= this.WIN_STREAK - 1) {
      // Optimization
      if (redWin && yellowWin) break;

      redStreak = yellowStreak = 0;
      r = this.ROWS - 1;
      const oldC = c;
      while (isInside(c, r)) {
        if (newSlots[c][r] === "R") {
          redStreak += 1;
          yellowStreak = 0;
        } else if (newSlots[c][r] === "Y") {
          redStreak = 0;
          yellowStreak += 1;
        } else if (newSlots[c][r] === "-") {
          redStreak = yellowStreak = 0;
        }

        if (redStreak >= this.WIN_STREAK) redWin = true;
        if (yellowStreak >= this.WIN_STREAK) yellowWin = true;

        // Optimization
        if (redWin && yellowWin) break;

        c -= 1;
        r -= 1;
      }
      c = oldC - 1;
    }

    // Horizontal
    c = 0;
    r = 0;
    redStreak = yellowStreak = 0;
    while (r < this.ROWS) {
      // Optimization
      if (redWin && yellowWin) break;

      redStreak = yellowStreak = 0;
      c = 0;
      while (isInside(c, r)) {
        if (newSlots[c][r] === "R") {
          redStreak += 1;
          yellowStreak = 0;
        } else if (newSlots[c][r] === "Y") {
          redStreak = 0;
          yellowStreak += 1;
        } else if (newSlots[c][r] === "-") {
          redStreak = yellowStreak = 0;
        }

        if (redStreak >= this.WIN_STREAK) redWin = true;
        if (yellowStreak >= this.WIN_STREAK) yellowWin = true;

        // Optimization
        if (redWin && yellowWin) break;

        c += 1;
      }
      r += 1;
    }

    // Vertical
    c = 0;
    r = 0;
    redStreak = yellowStreak = 0;
    while (c < this.COLUMNS) {
      // Optimization
      if (redWin && yellowWin) break;

      redStreak = yellowStreak = 0;
      r = 0;
      while (isInside(c, r)) {
        if (newSlots[c][r] === "R") {
          redStreak += 1;
          yellowStreak = 0;
        } else if (newSlots[c][r] === "Y") {
          redStreak = 0;
          yellowStreak += 1;
        } else if (newSlots[c][r] === "-") {
          redStreak = yellowStreak = 0;
        }

        if (redStreak >= this.WIN_STREAK) redWin = true;
        if (yellowStreak >= this.WIN_STREAK) yellowWin = true;

        // Optimization
        if (redWin && yellowWin) break;

        r += 1;
      }
      c += 1;
    }

    // If a move causes both to "win", then it is a draw
    if (redWin && yellowWin) return new BoardPopOut(false, newSlots, "DRAW");
    if (redWin) return new BoardPopOut(false, newSlots, "RED");
    if (yellowWin) return new BoardPopOut(false, newSlots, "YELLOW");

    // Check for endgame draw
    let usedSlots = 0;
    for (const column of newSlots) usedSlots += this._getSizeOfColumn(column);
    if (usedSlots === this.COLUMNS * this.ROWS)
      return new BoardPopOut(false, newSlots, "DRAW");

    // If not invalid, no winners and no draws, then everything is OK
    return new BoardPopOut(false, newSlots);
  }
}
