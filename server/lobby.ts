import { Socket } from "socket.io";
import { Board } from "./board";
import { BoardPopOut } from "./board-pop-out";
import { BoardStandard } from "./board-standard";
import { Move } from "./move";

enum LobbyState {
  WAITING_FOR_OPPONENT = "WAITING_FOR_OPPONENT",
  RED_TURN = "RED_TURN",
  YELLOW_TURN = "YELLOW_TURN",
  DONE = "DONE",
}

export class Lobby {
  private state: LobbyState = LobbyState.WAITING_FOR_OPPONENT;
  private board: Board;

  public readonly name: string;
  public readonly variant: string;

  private host: Socket;
  private opponent?: Socket;

  private redPlayer?: Socket;
  private yellowPlayer?: Socket;

  private lastMove?: "RED" | "YELLOW";

  constructor(
    host: Socket,
    color: "RED" | "YELLOW",
    name: string,
    variant: "Standard" | "PopOut"
  ) {
    if (color === "RED") this.redPlayer = host;
    else this.yellowPlayer = host;

    this.host = host;
    this.name = name;
    this.variant = variant;

    switch (variant) {
      case "Standard":
        this.board = new BoardStandard();
        break;
      case "PopOut":
        this.board = new BoardPopOut();
        break;
    }

    this._update(this.host);
  }

  private _update(to: Socket, msg?: string) {
    to.emit("GameUpdate", {
      state: this.state,
      board: this.board.slots,
      boardType: this.board.__type,
      winner: this.board.winner,
      hostID: this.host.id,
      redPlayerID: this.redPlayer?.id,
      yellowPlayerID: this.yellowPlayer?.id,
    });
  }

  public connectionLost(by: string) {
    if (by !== this.redPlayer?.id && by !== this.yellowPlayer?.id) return; // Ignore

    if (by === this.host.id) {
      this.opponent?.emit(
        "ErrorHostConnectionLost",
        "The host connection was lost"
      );
      this.state = LobbyState.DONE;
      return;
    }

    if (by === this.opponent?.id) {
      if (this.state !== LobbyState.DONE)
        this.state = LobbyState.WAITING_FOR_OPPONENT;

      if (this.redPlayer?.id === by) this.redPlayer = undefined;
      if (this.yellowPlayer?.id === by) this.yellowPlayer = undefined;
      this.opponent = undefined;

      this._update(this.host);
      return;
    }
  }

  public handleMove(by: string, move: Move) {
    if (
      this.state !== LobbyState.RED_TURN &&
      this.state !== LobbyState.YELLOW_TURN
    ) {
      console.debug("Not accepting moves", move);
      return;
    }

    let isMoverTurn;
    if (this.state === LobbyState.RED_TURN)
      isMoverTurn = this.redPlayer!.id === by;
    if (this.state === LobbyState.YELLOW_TURN)
      isMoverTurn = this.yellowPlayer!.id === by;

    if (!isMoverTurn) {
      console.debug("Incorrect turn", move);
      return;
    }

    const future = this.board.applyMove(move, this.state);

    if (future.invalid) {
      console.debug("Invalid move", move);
      return;
    }

    this.board = future;
    this.lastMove = this.state === LobbyState.RED_TURN ? "RED" : "YELLOW";

    if (this.board.winner !== undefined) {
      this.state = LobbyState.DONE;
    } else {
      this.state =
        this.state === LobbyState.RED_TURN
          ? LobbyState.YELLOW_TURN
          : LobbyState.RED_TURN;
    }

    this._update(this.host);
    this._update(this.opponent!);
  }

  public getState() {
    return this.state;
  }

  public opponentJoin(opponent: Socket) {
    if (this.state !== LobbyState.WAITING_FOR_OPPONENT) {
      opponent.emit("ErrorLobbyFull", "Lobby is full");
      return;
    }

    this.opponent = opponent;

    if (this.redPlayer === undefined) this.redPlayer = opponent;
    else this.yellowPlayer = opponent;

    if (this.lastMove !== undefined)
      this.state =
        this.lastMove === "RED" ? LobbyState.YELLOW_TURN : LobbyState.RED_TURN;
    else
      this.state = [LobbyState.RED_TURN, LobbyState.YELLOW_TURN][
        Math.floor(Math.random() * 2)
      ];

    this._update(this.host);
    this._update(this.opponent);
  }
}
