const http = require("http").createServer();
import type { Socket } from "socket.io";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
  socket.on("start_game", async (data) => {
    const game = new Game(data.quizId);
    game.id = nanoid();
    game.data = await prisma.quiz
      .findFirst({
        where: { id: game.quizId },
        include: {
          questions: {
            include: { answers: true },
          },
        },
      })
      .then(() => {
        socket.join(game.id);
        socket.emit("pin");
        console.log(game.data);
      });
  });
});

http.listen(8000, () => console.log("Server is running..."));

class Game {
  quizId: string;
  id!: string;
  data: any;
  pin: string;
  constructor(quizId: string) {
    this.quizId = quizId;
    this.pin = Math.floor(Math.random() * 1000000).toString();
  }
}
