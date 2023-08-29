import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { type gameStates } from "~/types&schemas/gameStates";
import { socket } from "~/socket/socket";
export function Play() {
  const [username, setUsername] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [gameState, setGameState] = useState<gameStates>("lobby");
  useEffect(() => {
    socket.on("game_started_client", () => {
      console.log("game_started_client");
    });
    socket.on("next_question_client", () => {
      setGameState("loading");
    });
    socket.on("next_data_client", () => {
      setGameState("playing");
    });
    socket.on("end_question_client", () => {
      setGameState("waiting");
    });
    socket.on("game_ended_client", () => {
      setGameState("finished");
    });
    socket.on("user_exists", () => {
      console.log("user_exists");
    });
    socket.on("disconnect", () => {
      console.log("disconnect");
    });
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
    return () => {
      socket.off("game_started_client");
      socket.off("next_question_client");
      socket.off("next_data_client");
      socket.off("end_question_client");
      socket.off("game_ended_client");
    };
  }, []);

  console.log("gameState " + gameState);
  function sendAnswer(answer: number) {
    socket.emit("send_answer", pin, username, answer);
  }
  return (
    <div>
      <div>
        <div>pin</div>
        <input onChange={(e) => setPin(e.target.value)} value={pin}></input>
        <div>username</div>
        <input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        ></input>
        <button
          onClick={() => {
            socket.emit("join_game", pin, username);
          }}
        >
          join
        </button>
      </div>
      {gameState === "loading" && <div>loading</div>}
      {gameState === "playing" && (
        <div>
          <button onClick={() => sendAnswer(0)}>0</button>
          <button onClick={() => sendAnswer(1)}>1</button>
          <button onClick={() => sendAnswer(2)}>2</button>
          <button onClick={() => sendAnswer(3)}>3</button>
        </div>
      )}
      {gameState === "waiting" && <div>waiting</div>}
      {gameState === "finished" && <div>finished</div>}
    </div>
  );
}
