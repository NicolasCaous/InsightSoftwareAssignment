const IO = io("http://localhost:8081/");

let serverConnected = false;
let playingGame = false;

// Lobby List
const createNewGame = (color, name, variant) => {
  IO.emit("message", { type: "CreateLobby", color, name, variant });
  playingGame = true;
};

const joinGame = (id) => {
  IO.emit("message", { type: "JoinLobby", id });
  playingGame = true;
};

IO.on("ErrorLobbyFull", (msg) => {
  alert(msg);
  IO.emit("message", { type: "ListLobbies" });
});

IO.on("UpdateLobbyList", () => {
  if (!playingGame) IO.emit("message", { type: "ListLobbies" });
});

IO.on("ListLobbies", (lobbies) => {
  RENDER_LOBBY_LIST(lobbies, createNewGame, joinGame);
});

// Game
IO.on("GameUpdate", (data) => {
  RENDER_GAME(
    {
      ...data,
      isRedPlayer: IO.id === data.redPlayerID,
      isYellowPlayer: IO.id === data.yellowPlayerID,
    },
    () => {
      IO.emit("message", {
        type: "LeaveLobby",
        id: data.hostID,
      });
    },
    (type, column) => {
      IO.emit("message", {
        type: "MakeMove",
        id: data.hostID,
        moveType: type,
        column,
      });
    }
  );
});

IO.on("ErrorHostConnectionLost", (msg) => {
  alert(msg);
  playingGame = false;
  IO.emit("message", { type: "ListLobbies" });
});

IO.on("LeaveLobby", () => {
  playingGame = false;
  IO.emit("message", { type: "ListLobbies" });
});

// Errors
IO.on("ErrorServerFull", (msg) => {
  RENDER_ERROR(msg);
  alert(msg);
});

[
  "ErrorMessageType",
  "ErrorMessageInvalid",
  "ErrorCreateLobbyLimit",
  "ErrorLobbyNotFound",
  "ErrorSelfPlayNotAllowed",
].forEach((errName) => {
  IO.on(errName, (msg, err) => {
    playingGame = false;
    RENDER_ERROR(msg, err);
  });
});

// Connection related stuff from now on
IO.on("connect", () => {
  serverConnected = true;

  RENDER_SERVER_STATUS(true, "-");
  RENDER_LOBBY_LIST([], createNewGame, joinGame);

  IO.emit("message", { type: "ListLobbies" });
});

IO.on("disconnect", (reason) => {
  serverConnected = false;
  playingGame = false;

  RENDER_SERVER_STATUS(false, `N/A - ${reason}`);
  RENDER_ERROR(reason);
});

IO.on("connect_error", (error) => {
  RENDER_ERROR(error);
});

setInterval(() => {
  const start = Date.now();

  IO.volatile.emit("ping", () => {
    const latency = Date.now() - start;
    RENDER_SERVER_STATUS(serverConnected, latency);
  });
}, 100);
