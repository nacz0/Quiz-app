import { MouseEvent, useEffect, useState } from "react";
import { socket } from "~/socket/socket";
import { type gameStates } from "~/types&schemas/gameStates";
type joinStates = "pin" | "username";
export function Play(props: { pin?: string }) {
  const [username, setUsername] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [gameState, setGameState] = useState<gameStates | joinStates>("pin");

  useEffect(() => {
    if (props.pin) {
      setPin(props.pin);
      setGameState("username");
    }
  }, [props.pin]);

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
      socket.off("disconnect");
    };
  }, []);

  console.log("gameState " + gameState);
  function sendAnswer(answer: number) {
    socket.emit("send_answer", pin, username, answer);
  }

  function handlePin(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    e.preventDefault();
    if (pin.length !== 6) return;
    //check if pin exists TODO
    setGameState("username");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[url('/PlayBg.svg')] bg-cover">
      {gameState === "pin" && (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <div className="flex h-52  w-4/5 flex-col items-center justify-center gap-4 rounded-2xl bg-amber-50/80 p-4 text-4xl">
            <div className="font-black">Wpisz pin</div>
            <input
              className=" w-[155px] rounded-full bg-white/50 px-3 py-1 font-semibold  no-underline shadow-lg transition  
          duration-200 hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 active:shadow-md"
              onChange={(e) => {
                if (e.target.value.length > 6) return;
                setPin(e.target.value);
              }}
              value={pin}
              type="number"
              spellCheck={false}
            ></input>
          </div>
          <button
            className="h-16 w-2/5 rounded-lg bg-amber-300 p-2 text-4xl font-bold [box-shadow:8px_7px_22px_4px_#3f3f46] 
            focus-visible:outline focus-visible:outline-4 focus-visible:outline-red-900"
            onClick={handlePin}
          >
            DALEJ
          </button>
        </div>
      )}
      {gameState === "username" && (
        <UsernameInput
          username={username}
          setUsername={setUsername}
          pin={pin}
          setGameState={setGameState}
        />
      )}
      {gameState === "lobby" && (
        <div>
          <div>Poczekaj na rozpoczęcie gry...</div>
        </div>
      )}
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
    </main>
  );
}

function UsernameInput(props: {
  username: string;
  setUsername: (username: string) => void;
  pin: string;
  setGameState: (gameState: gameStates) => void;
}) {
  const { username, setUsername, setGameState, pin } = props;
  const [isInvalidUser, setIsInvalidUser] = useState<boolean>(false);
  useEffect(() => {
    socket.on("is_valid_user", (b) => {
      if (!b) setIsInvalidUser(true);
      if (b) setGameState("lobby");
    });
    return () => {
      socket.off("is_valid_user");
    };
  }, [setGameState]);
  function handleUsername(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    if (!username) return;
    e.preventDefault();
    socket.emit("join_game", pin, username);
  }
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex h-52  w-4/5 flex-col items-center justify-center gap-4 rounded-2xl bg-amber-50/80 p-4 text-2xl">
        <div className="text-3xl font-black">Wpisz swój nick</div>
        {isInvalidUser && <div>Użytkownik o podanym nicku już istnieje</div>}
        <input
          className="w-full rounded-full bg-white/50 px-3 py-1 font-semibold  no-underline shadow-lg   
      transition duration-200 hover:bg-white/90  focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 active:shadow-md"
          onChange={(e) => {
            if (e.target.value.length > 25) return;
            setUsername(e.target.value);
          }}
          value={username}
          spellCheck={false}
        ></input>
      </div>
      <button
        className="h-16 w-2/5 rounded-lg bg-amber-300 p-2 text-4xl font-bold [box-shadow:8px_7px_22px_4px_#3f3f46]
        focus-visible:outline focus-visible:outline-4 focus-visible:outline-red-900"
        onClick={handleUsername}
      >
        Dołącz
      </button>
    </div>
  );
}
