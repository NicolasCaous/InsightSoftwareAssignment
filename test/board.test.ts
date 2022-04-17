import { BoardPopOut } from "../server/board-pop-out";
import { BoardStandard } from "../server/board-standard";
import { MoveAdd } from "../server/move";

const generateBoard = (
  color: "R" | "Y",
  column: number,
  row: number,
  columnPace: number,
  rowPace: number,
  from?: ("R" | "Y" | "-")[][],
  columnCount: number = 7,
  rowCount: number = 6,
  streak: number = 4
): ("R" | "Y" | "-")[][] => {
  let ret;
  if (from) ret = from;
  else ret = Array.from(Array(columnCount), () => Array(rowCount).fill("-"));

  let c = column;
  let r = row;
  for (let s = 0; s < streak; ++s) {
    ret[c][r] = color;
    c += columnPace;
    r += rowPace;
  }

  return ret;
};

const boardHasWinner = (board: ("R" | "Y" | "-")[][]) => {
  const a = new BoardPopOut(false, board).applyMove(
    new MoveAdd(0),
    "RED_TURN",
    true
  ).winner;
  const b = new BoardStandard(false, board).applyMove(
    new MoveAdd(0),
    "RED_TURN",
    true
  ).winner;
  return a !== undefined && a !== "DRAW" && b !== undefined && b !== "DRAW";
};

describe("Board winning cases", () => {
  //  UL to BR starting points
  //  streak: 4
  //  pace: 1c -1r
  //  x x x x - - -
  //  x x x x - - -
  //  x x x x - - -
  //  - - - - - - -
  //  - - - - - - -
  //  - - - - - - -
  it("should work for diagonal UL to BR wins", () => {
    for (let c = 0; c < 4; ++c)
      for (let r = 3; r < 6; ++r)
        expect(boardHasWinner(generateBoard("R", c, r, 1, -1))).toBe(true);
  });

  //  UR to BL starting points
  //  streak: 4
  //  pace: -1c -1r
  //  - - - x x x x
  //  - - - x x x x
  //  - - - x x x x
  //  - - - - - - -
  //  - - - - - - -
  //  - - - - - - -
  it("should work for diagonal UR to BL wins", () => {
    for (let c = 3; c < 7; ++c)
      for (let r = 3; r < 6; ++r)
        expect(boardHasWinner(generateBoard("R", c, r, -1, -1))).toBe(true);
  });

  //  vertical starting points
  //  streak: 4
  //  pace: 0c -1r
  //  x x x x x x x
  //  x x x x x x x
  //  x x x x x x x
  //  - - - - - - -
  //  - - - - - - -
  //  - - - - - - -
  it("should work for vertical wins", () => {
    for (let c = 0; c < 7; ++c)
      for (let r = 3; r < 6; ++r)
        expect(boardHasWinner(generateBoard("R", c, r, 0, -1))).toBe(true);
  });

  //  horizontal starting points
  //  streak: 4
  //  pace: 1c 0r
  //  x x x x - - -
  //  x x x x - - -
  //  x x x x - - -
  //  x x x x - - -
  //  x x x x - - -
  //  x x x x - - -
  it("should work for horizontal wins", () => {
    for (let c = 0; c < 4; ++c)
      for (let r = 0; r < 6; ++r)
        expect(boardHasWinner(generateBoard("R", c, r, 1, 0))).toBe(true);
  });
});
