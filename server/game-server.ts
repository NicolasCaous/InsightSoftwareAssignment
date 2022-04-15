import { Server, Socket } from "socket.io";

import { Lobby } from "./lobby";
import { isMessage, MessageTypeIDs } from "./messages";
import { validateCreateLobbyMessage } from "./messages/create-lobby";
import { validateJoinLobbyMessage } from "./messages/join-lobby";
import { validateLeaveLobbyMessage } from "./messages/leave-lobby";
import { validateListLobbiesMessage } from "./messages/list-lobbies";
import { validateMakeMoveMessage } from "./messages/make-move";
import { MoveAdd, MovePopOut } from "./move";

export class GameServer {
  private readonly MAX_CONNECTIONS: number = 10;
  private readonly _connections: { [key: string]: Socket } = {};

  private readonly _lobbies: { [key: string]: Lobby } = {};

  constructor(server: Server, maxConnections?: number) {
    if (maxConnections !== undefined && maxConnections > 0)
      this.MAX_CONNECTIONS = maxConnections;

    server.on("connection", (socket) => this.onConnection(socket));
  }

  onConnection(socket: Socket) {
    if (Object.keys(this._connections).length >= this.MAX_CONNECTIONS) {
      console.log(
        `MAX_CONNECTIONS (${this.MAX_CONNECTIONS}) reached, dropping socket ${socket.id}`
      );
      socket.emit("ErrorServerFull", "The server connection limit was reached");
      socket.disconnect(true);
      return;
    }

    console.log(`New connection: ${socket.id}`);
    this._connections[socket.id] = socket;

    socket.on("disconnect", (reason) => this.onDisconnect(socket, reason));
    socket.on("message", (msg) => this.onMessage(socket, msg));
  }

  onDisconnect(socket: Socket, reason: string) {
    console.log(`Disconnect: ${socket.id} - ${reason}`);

    for (let id in this._lobbies) this._lobbies[id].connectionLost(socket.id);
    if (socket.id in this._lobbies) delete this._lobbies[socket.id];

    delete this._connections[socket.id];
  }

  onMessage(socket: Socket, msg: unknown) {
    console.debug("New message: ", msg);

    let type: MessageTypeIDs;
    if (isMessage(msg)) {
      type = msg.type;
    } else {
      console.error("Message type not identified: ", msg);
      socket.emit("ErrorMessageType", "Message type not identified", msg);
      return;
    }

    switch (type) {
      case "CreateLobby":
        if (validateCreateLobbyMessage(msg)) {
          if (socket.id in this._lobbies) {
            console.error("Only 1 lobby per user is allowed. ", socket.id);
            socket.emit(
              "ErrorCreateLobbyLimit",
              "Only 1 lobby per user is allowed",
              msg
            );
            return;
          }

          this._lobbies[socket.id] = new Lobby(
            socket,
            msg.color,
            msg.name,
            msg.variant
          );
          socket.broadcast.emit("UpdateLobbyList");
        } else {
          console.error('Message is not a valid "CreateLobby": ', msg);
          socket.emit(
            "ErrorMessageInvalid",
            'Message is not a valid "CreateLobby"',
            msg
          );
        }
        break;
      case "JoinLobby":
        if (validateJoinLobbyMessage(msg)) {
          if (!(msg.id in this._lobbies)) {
            console.error(`The lobby with ID "${msg.id}" does not exist`);
            socket.emit(
              "ErrorLobbyNotFound",
              `The lobby with ID "${msg.id}" does not exist`
            );
            return;
          }
          if (msg.id === socket.id) {
            console.error(`Cannot join your own lobby ${msg.id}`);
            socket.emit(
              "ErrorSelfPlayNotAllowed",
              `The lobby with ID "${msg.id}" is yours and you are not allowed to play yourself.`
            );
            return;
          }

          this._lobbies[msg.id].opponentJoin(socket);
        } else {
          console.error('Message is not a valid "JoinLobby": ', msg);
          socket.emit(
            "ErrorMessageInvalid",
            'Message is not a valid "JoinLobby"',
            msg
          );
        }
        break;
      case "LeaveLobby":
        if (validateLeaveLobbyMessage(msg)) {
          if (!(msg.id in this._lobbies)) {
            console.error(`The lobby with ID "${msg.id}" does not exist`);
            socket.emit(
              "ErrorLobbyNotFound",
              `The lobby with ID "${msg.id}" does not exist`
            );
            return;
          }

          // TODO: Differentiate between loss of connection and lobby leave
          this._lobbies[msg.id].connectionLost(socket.id);
          if (socket.id in this._lobbies) delete this._lobbies[socket.id];
        } else {
          console.error('Message is not a valid "LeaveLobby": ', msg);
          socket.emit(
            "ErrorMessageInvalid",
            'Message is not a valid "LeaveLobby"',
            msg
          );
        }
        break;
      case "ListLobbies":
        if (validateListLobbiesMessage(msg)) {
          const ret = [];

          for (let id in this._lobbies) {
            ret.push({
              id,
              name: this._lobbies[id].name,
              variant: this._lobbies[id].variant,
            });
          }

          socket.emit("ListLobbies", ret);
        } else {
          console.error('Message is not a valid "ListLobbies": ', msg);
          socket.emit(
            "ErrorMessageInvalid",
            'Message is not a valid "ListLobbies"',
            msg
          );
        }
        break;
      case "MakeMove":
        if (validateMakeMoveMessage(msg)) {
          if (!(msg.id in this._lobbies)) {
            console.error(`The lobby with ID "${msg.id}" does not exist`);
            socket.emit(
              "ErrorLobbyNotFound",
              `The lobby with ID "${msg.id}" does not exist`
            );
            return;
          }

          switch (msg.moveType) {
            case "MoveAdd":
              this._lobbies[msg.id].handleMove(
                socket.id,
                new MoveAdd(msg.column, msg.row)
              );
              break;
            case "MovePopOut":
              this._lobbies[msg.id].handleMove(
                socket.id,
                new MovePopOut(msg.column)
              );
              break;
          }
        } else {
          console.error('Message is not a valid "MakeMove": ', msg);
          socket.emit(
            "ErrorMessageInvalid",
            'Message is not a valid "MakeMove"',
            msg
          );
        }
        break;
    }
  }
}
