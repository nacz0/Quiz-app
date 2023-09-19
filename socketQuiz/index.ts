const http = require("http").createServer();
type question = {
  answers: {
    id: string;
    text: string;
    isCorrect: boolean;
    image: string | null;
    questionId: string;
  }[];
} & {
  id: string;
  text: string;
  ytLink: string | null;
  image: string | null;
  quizId: string;
};
interface ServerToHostClientEvents {
  user_joined: (username: string) => void;
  user_left: (username: string) => void;
  answer_sent: (username: string, answer: number) => void;
  game_started: (pin: string) => void;
}
interface ServerToUserClientEvents {
  is_valid_user: (b: boolean) => void;
  game_started_client: () => void;
  next_question_client: () => void;
  next_data_client: (question: question) => void;
  end_question_client: () => void;
  game_ended_client: () => void;
  dasdad: () => void;
}
interface HostClientToServerEvents {
  start_game: (quizId: string) => void;
  end_game: (pin: string) => void;
  next_question: (pin: string) => void;
  next_data: (pin: string, question: question) => void;
  end_question: (pin: string) => void;
}

interface UserClientToServerEvents {
  join_game: (pin: string, username: string) => void;
  send_answer: (pin: string, username: string, answer: number) => void;
}
interface Events
  extends ServerToHostClientEvents,
    ServerToUserClientEvents,
    HostClientToServerEvents,
    UserClientToServerEvents {}
import { Server, type Socket } from "socket.io";
const io = new Server<Events>(http, {
  cors: { origin: "*" },
});

function startGame(socket: Socket) {
  const tryRandomPin = Math.floor(Math.random() * 1000000).toString();
  const randomPIN = tryRandomPin.padStart(6, "0");
  /*if (Hosts.has(randomPIN)) {
    return startGame(socket);
  }*/
  Hosts.set(randomPIN, socket.id);
  socket.join(randomPIN);
  socket.emit("game_started", randomPIN);
}

const Users = new Map();
const Hosts = new Map();
const dd = new Map();
io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);
  socket.on("start_game", async (data) => {
    startGame(socket);
  });
  //User to Server
  socket.on("join_game", (pin, username) => {
    dd.set(pin, socket.id);
    if (Users.has(pin)) {
      console.log(Users.get(pin));

      if (
        Users.get(pin).find((user: string) => user === username) ||
        username === ""
      ) {
        socket.emit("is_valid_user", false);
        return;
      } else {
        Users.set(pin, [...Users.get(pin), username]);
        socket.emit("is_valid_user", true);
      }
    } else {
      if (username === "") {
        socket.emit("is_valid_user", false);
        console.log("username" + username);
        console.log(typeof username);
        return;
      }
      Users.set(pin, [username]);
      socket.emit("is_valid_user", true);
    }

    socket.join(pin);
    const host = Hosts.get(pin);
    io.to(host).emit("user_joined", username);
  });
  socket.on("send_answer", (pin, username, answer) => {
    console.log(socket.rooms.values());
    const host = Hosts.get(pin);
    io.to(host).emit("answer_sent", username, answer);
  });
  //Host to Server
  socket.on("next_question", (pin) => {
    socket.to(pin).emit("next_question_client");
  });
  socket.on("end_question", (pin) => {
    console.log(pin);
    console.log("end_question");
    socket.to(pin).emit("end_question_client");
  });
  socket.on("next_data", (pin, question) => {
    socket.to(pin).emit("next_data_client", question);
    setTimeout(() => {
      socket.to(pin).emit("dasdad");
    }, 10000);
  });

  socket.on("end_game", (pin) => {
    socket.to(pin).emit("game_ended_client");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(8000, "192.168.1.42", () => console.log("Server is running..."));
