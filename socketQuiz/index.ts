const http = require("http").createServer();
import type { Socket } from "socket.io";
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
  socket.on("start_game", async (data) => {
    const randomPIN = Math.floor(Math.random() * 1000000).toString();
    socket.join(randomPIN);
  });
  socket.on("join_game", (pin) => {
    //pin
    socket.join(pin);
  });
});

http.listen(8000, () => console.log("Server is running..."));
