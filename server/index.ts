import * as http from "http";
import { Server } from "socket.io";

const PORT = 8081;
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(`socket.io server at port ${PORT}`);
});

const io = new Server(server, { cors: { origin: true } });
io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(PORT, () => {
  console.log(`starting server on *:${PORT}`);
});
