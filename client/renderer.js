const _LOBBY_LIST_TEMPLATE = document.getElementById("lobby-list-template");
const _GAME_TEMPLATE = document.getElementById("game-template");
const _ERROR_TEMPLATE = document.getElementById("error-template");

const _SERVER_STATUS_DIV = document.getElementById("server-status");
const _LOBBY_LIST_DIV = document.getElementById("lobby-list");
const _GAME_DIV = document.getElementById("game");
const _ERROR_DIV = document.getElementById("error");

const _CLEAR_ALL = () => {
  _LOBBY_LIST_DIV.innerHTML = "";
  _GAME_DIV.innerHTML = "";
  _ERROR_DIV.innerHTML = "";
};

const RENDER_SERVER_STATUS = (connected, latency) => {
  _SERVER_STATUS_DIV.innerText = `STATUS: ${
    connected ? "connected" : "disconnected"
  } - LATENCY (ms): ${latency}`;

  _SERVER_STATUS_DIV.style.backgroundColor = connected ? "green" : "red";
};

const RENDER_LOBBY_LIST = (lobbies, newGameCB, joinGameCB) => {
  _CLEAR_ALL();

  const canvas = _LOBBY_LIST_TEMPLATE.content.cloneNode(true);

  const form = canvas.querySelector("form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const color = form.querySelector(
      'input[name="new-game-color"]:checked'
    ).value;
    const name = form.querySelector(".new-game-name").value;
    const variant = form.querySelector(
      'input[name="new-game-variant"]:checked'
    ).value;

    newGameCB(color, name, variant);
  });

  for (const lobby of lobbies) {
    const div = document.createElement("div");
    const button = document.createElement("button");
    const text = document.createTextNode(
      `${lobby.state} - ${lobby.variant} - ${lobby.name}`
    );

    div.style.paddingTop = "16px";

    button.innerText = "Join";
    button.style.marginRight = "16px";
    button.style.height = "40px";
    button.style.width = "100px";

    button.onclick = (e) => {
      e.preventDefault();
      joinGameCB(lobby.id);
    };

    div.appendChild(button);
    div.appendChild(text);
    canvas.querySelector(".lobby-list").appendChild(div);
  }

  _LOBBY_LIST_DIV.appendChild(canvas);
};

const RENDER_GAME = (data, leaveLobby, makeMove) => {
  _CLEAR_ALL();

  const isYourTurn =
    (data.state === "RED_TURN" && data.isRedPlayer) ||
    (data.state === "YELLOW_TURN" && data.isYellowPlayer);

  const canvas = _GAME_TEMPLATE.content.cloneNode(true);

  canvas.querySelector(".leave-button-container button").onclick = leaveLobby;

  const stateIndicator = canvas.querySelector(".state-indicator");
  const stateText = canvas.querySelector(".state-text");

  if (data.state === "WAITING_FOR_OPPONENT") {
    stateText.innerText = "WAITING FOR OPPONENT";
    stateIndicator.style.backgroundColor = "gray";
    stateIndicator.style.color = "white";
  }

  if (data.state === "RED_TURN") {
    stateText.innerText = data.isRedPlayer ? "YOUR TURN" : "RED TURN";
    stateIndicator.style.backgroundColor = "red";
    stateIndicator.style.color = "white";
  }

  if (data.state === "YELLOW_TURN") {
    stateText.innerText = data.isYellowPlayer ? "YOUR TURN" : "YELLOW TURN";
    stateIndicator.style.backgroundColor = "yellow";
    stateIndicator.style.color = "black";
  }

  if (data.state === "DONE") {
    if (data.winner === "RED" && data.isRedPlayer) {
      stateText.innerText = "WIN";
      stateIndicator.style.backgroundColor = "green";
      stateIndicator.style.color = "white";
    } else if (data.winner === "YELLOW" && data.isYellowPlayer) {
      stateText.innerText = "WIN";
      stateIndicator.style.backgroundColor = "green";
      stateIndicator.style.color = "white";
    } else if (data.winner === "DRAW") {
      stateText.innerText = "DRAW";
      stateIndicator.style.backgroundColor = "orange";
      stateIndicator.style.color = "white";
    } else {
      stateText.innerText = "LOSS";
      stateIndicator.style.backgroundColor = "black";
      stateIndicator.style.color = "white";
    }
  }

  canvas.querySelector(".playing-as").style.backgroundColor = data.isRedPlayer
    ? "red"
    : "yellow";

  if (isYourTurn) {
    const getColumnSize = (column) => {
      let sum = 0;
      for (const slot of column) if (slot !== "-") sum += 1;
      return sum;
    };

    let i = 0;
    for (column of data.board) {
      const size = getColumnSize(column);

      if (size === 6) canvas.querySelector(`.add-${i}`).disabled = true;
      else
        canvas.querySelector(`.add-${i}`).onclick = ((n) => (e) => {
          e.preventDefault();
          makeMove("MoveAdd", n);
        })(i);

      if (data.boardType === "BoardPopOut") {
        if (size === 0) canvas.querySelector(`.pop-${i}`).disabled = true;
        else
          canvas.querySelector(`.pop-${i}`).onclick = ((n) => (e) => {
            e.preventDefault();
            makeMove("MovePopOut", n);
          })(i);
      }

      ++i;
    }
  } else {
    canvas.querySelectorAll(".add-pop-button").forEach((element) => {
      element.disabled = true;
    });
  }

  if (data.boardType === "BoardStandard")
    canvas.querySelector(".pop-buttons").remove();

  for (const c in data.board)
    for (const r in data.board[c])
      canvas.querySelector(`.s${c}-${r}`).style.backgroundColor =
        data.board[c][r] === "-"
          ? ""
          : data.board[c][r] === "R"
          ? "red"
          : "yellow";

  _GAME_DIV.appendChild(canvas);
};

const RENDER_ERROR = (msg, err) => {
  _CLEAR_ALL();

  const canvas = _ERROR_TEMPLATE.content.cloneNode(true);

  canvas.querySelector(".message").innerText = msg;
  canvas.querySelector(".stacktrace").innerText = err
    ? JSON.stringify(err)
    : "";

  _ERROR_DIV.appendChild(canvas);
};
