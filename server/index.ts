import * as http from "http";
import { Server } from "socket.io";

import { GameServer } from "./game-server";

const PORT = 8081;
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(`socket.io server at port ${PORT}`);
});

const io = new Server(server, { cors: { origin: true }, pingInterval: 500 });
const gameServer = new GameServer(io);

server.listen(PORT, () => {
  console.log(`starting server on *:${PORT}`);
});
