import { use, useEffect, useRef, useState } from "react";
import { type Socket, io } from "socket.io-client";
import { type RouterOutputs } from "~/utils/api";
import { Question } from "./Question";
import { socket } from "~/socket/socket";
import { type gameStates } from "~/types&schemas/gameStates";
import { Timer } from "../timer";
type data = RouterOutputs["quiz"]["getQuizById"];

export type question = data["questions"][number];

export type User = {
  name: string;
  score: number;
};

export function Start(props: { quizId: string; data: data }) {
  const [pin, setPin] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [gameState, setGameState] = useState<gameStates>("lobby");
  const { quizId, data } = props;
  useEffect(() => {
    console.log("start_game");
    socket.emit("start_game", quizId);
    return () => {
      socket.off("start_game");
    };
  }, []);

  useEffect(() => {
    socket.on("game_started", (pin) => {
      console.log(pin);
      setPin(pin);
    });
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
    return () => {
      socket.off("game_started");
    };
  }, []);

  useEffect(() => {
    socket.on("user_joined", (username) => {
      console.log(username);
      setUsers((users) => [...users, { name: username, score: 0 }]);
    });
    socket.on("user_left", (username) => {
      console.log(username);
      setUsers((users) => users.filter((user) => user.name !== username));
    });

    return () => {
      socket.off("user_joined");
      socket.off("user_left");
    };
  }, [users]);

  function handlePlay() {
    setGameState("loading");
    socket.emit("next_question", pin);
    const delay = 1000 * 1.5;

    if (currentQuestion <= data.questions.length - 1) {
      const timeout = setTimeout(() => {
        socket.emit("next_data", pin, data.questions[currentQuestion]!);
        setGameState("playing");
      }, delay);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      socket.timeout(delay).emit("end_game", pin);
      setGameState("finished");
    }
  }

  function startGame() {
    handlePlay();
  }
  return (
    <div>
      {gameState === "lobby" && <button onClick={startGame}>start</button>}
      <div>{pin}</div>
      <div>
        {users.map((user) => (
          <div key={user.name}>{user.name}</div>
        ))}
      </div>
      {gameState === "playing" && data.questions[currentQuestion] && (
        <Question
          setGameState={setGameState}
          pin={pin}
          question={data.questions[currentQuestion]!}
          setCurrentQuestion={setCurrentQuestion}
          setUsers={setUsers}
          users={users}
        />
      )}
      {gameState === "loading" && <div>loading</div>}
      {gameState === "waiting" && (
        <>
          <div>
            {users.map((user) => (
              <div key={user.name}>
                <div>{user.name}</div>
                <div>Score: {user.score}</div>
              </div>
            ))}
          </div>
          <button onClick={handlePlay}>next question</button>
        </>
      )}
      {gameState === "finished" && <div>game finished</div>}
    </div>
  );
}
