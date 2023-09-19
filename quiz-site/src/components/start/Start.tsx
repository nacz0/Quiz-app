import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import UseClickOutside from "~/lib/hooks/useClickOutside";
import { socket } from "~/socket/socket";
import { Fish } from "~/svg/fish";
import { ParallelogramBg } from "~/svg/parallelogramBg";
import { type gameStates } from "~/types&schemas/gameStates";
import { type RouterOutputs } from "~/utils/api";
import { Question } from "./Question";

type data = RouterOutputs["game"]["getQuizById"];

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
  }, [quizId]);

  useEffect(() => {
    socket.on("game_started", (pin) => {
      console.log(pin);
      setPin(pin);
    });
    socket.onAny((event, ...args) => {
      /**/
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
    const delay = 1000 * 5.5;

    if (currentQuestion <= data.questions.length - 1) {
      const timeout = setTimeout(() => {
        socket.emit("next_data", pin, data.questions[currentQuestion]!);
        setGameState("playing");
      }, delay);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      socket.emit("end_game", pin);
      setGameState("finished");
    }
  }

  function startGame() {
    handlePlay();
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center bg-[url('/bgStart.svg')] bg-cover ">
      {gameState === "lobby" && (
        <>
          <div className=" left-0 top-0 flex w-screen flex-row items-center justify-center gap-4   p-7">
            <div className="absolute z-0 fill-teal-50">
              <ParallelogramBg height={220} />
            </div>
            <div className="z-10 flex h-48 w-[900px] flex-row items-center justify-between  gap-3 pr-8">
              <div className=" flex h-full flex-col items-center justify-center   text-3xl font-bold">
                <div>Dołącz na</div>
                <div className="mt-5 animate-leftToRight bg-gradient-to-r from-amber-500 to-teal-500 bg-[length:200%] bg-clip-text font-black text-transparent">
                  quizzerquiz.xyz/play
                </div>
              </div>
              <div className="flex h-full flex-col items-center justify-center border-l-2 border-r-2 border-white pl-10 pr-10">
                <div className="text-5xl font-semibold ">Kod PIN</div>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `localhost:3000/play?pin=${pin}`
                    );
                  }}
                  className="px-2 text-6xl font-black text-black hover:bg-gray-300
                  focus-visible:outline focus-visible:outline-4 focus-visible:outline-gray-700"
                >
                  {pin}
                </button>
              </div>

              <QrCode pin={pin} />
            </div>
          </div>
          <div className="flex w-[880px] items-center justify-center  rounded-2xl  bg-amber-50/80 p-4">
            <button
              className=" rounded-lg bg-amber-300 px-4 py-2 text-3xl font-semibold shadow-md transition duration-200 
              hover:bg-amber-400 focus-visible:outline focus-visible:outline-4 focus-visible:outline-red-900 disabled:cursor-not-allowed
              disabled:bg-amber-600 disabled:text-gray-500 disabled:opacity-80"
              disabled={users.length < 0}
              onClick={startGame}
            >
              Start
            </button>
          </div>
          <div className="mt-6 font-semibold">
            {users.length === 0 && (
              <div className="flex flex-row bg-amber-200  p-4 text-2xl">
                Czekanie na graczy
                <span className=" flex animate-fadeIn1 ">.</span>
                <span className=" flex animate-fadeIn2 ">.</span>
                <span className=" flex animate-fadeIn3 ">.</span>
              </div>
            )}
            {users.length !== 0 && (
              <div className="mb-5 w-[1188px] rounded-2xl bg-amber-100/80 px-4 py-2 text-2xl text-black">
                Uczestniczący w grze:
              </div>
            )}
            <div className="grid grid-cols-4 gap-3">
              {users.map(
                (
                  user //25 chars
                ) => (
                  <div
                    className="w-72 rounded-md bg-white py-2 text-center text-xl text-black"
                    key={user.name}
                  >
                    {user.name}
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
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
      {gameState === "loading" && (
        <div className="mb-24 flex h-full w-[1000px] flex-col  justify-center">
          <div className=" flex h-14  w-full  items-center justify-center bg-white text-4xl font-semibold">
            {data.questions[currentQuestion]?.text}
          </div>
          <div className=" flex items-center justify-center ">
            <div className="relative  flex h-32 w-[1000px] flex-row">
              <div className="h-24 w-[90%] animate-width0to90  "></div>
              <div className="z-20 mt-8 h-24  w-[10%] animate-fishJump   ">
                <Fish />
              </div>
              <div className="absolute  h-full w-full animate-width10to100 bg-blue-400/30"></div>
            </div>
          </div>
          <div className=" flex h-14  w-full animate-width10to100    bg-white text-4xl font-semibold"></div>
        </div>
      )}
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
          <button onClick={handlePlay}>
            {currentQuestion === data.questions.length
              ? "finish"
              : "next question"}
          </button>
        </>
      )}
      {gameState === "finished" && <div>game finished</div>}
    </main>
  );
}

function QrCode(props: { pin: string }) {
  const [isOpened, setIsOpened] = useState(false);
  const qrRef = useRef<HTMLButtonElement | null>(null);
  UseClickOutside(qrRef, () => setIsOpened(false));

  return (
    <>
      <div
        className={`${
          isOpened
            ? "fixed left-0 top-0 z-40 h-screen w-screen backdrop-blur-sm "
            : ""
        } `}
      ></div>
      <button
        ref={qrRef}
        onClick={() => setIsOpened(!isOpened)}
        className={`${
          isOpened
            ? " z-50 ml-7 -translate-x-[323px] translate-y-[300px] scale-[225%]"
            : ""
        } flex max-h-[12rem] max-w-[12rem]   shadow-md shadow-gray-600 transition-[transform] duration-500 ease-in-out
        focus-visible:outline focus-visible:outline-4 focus-visible:outline-amber-500  `}
      >
        <QRCode
          size={512}
          className="h-auto w-full max-w-full transition-all duration-500 ease-in-out"
          value={`http://localhost:3000/play?pin=${props.pin}`}
          viewBox={`0 0 512 512`}
        />
      </button>
    </>
  );
}
