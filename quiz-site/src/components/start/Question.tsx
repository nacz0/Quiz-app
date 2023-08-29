import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useCallback,
  useState,
} from "react";
import type { User, question } from "./Start";
import { socket } from "~/socket/socket";
import { type gameStates } from "~/types&schemas/gameStates";
import { Timer } from "../timer";
export function Question(props: {
  question: question;
  pin: string;
  setGameState: Dispatch<SetStateAction<gameStates>>;
  setCurrentQuestion: Dispatch<SetStateAction<number>>;
  setUsers: Dispatch<SetStateAction<User[]>>;
  users: User[];
}) {
  const { question, pin, setGameState, setCurrentQuestion, setUsers, users } =
    props;

  const [time, setTime] = useState<number>(0);
  useEffect(() => {
    setTime(Date.now());
  }, []);

  const handleEndQuestion = useCallback(() => {
    socket.emit("end_question", pin);
    setCurrentQuestion((currentQuestion) => currentQuestion + 1);
    setGameState("waiting");
  }, [pin, setCurrentQuestion, setGameState]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleEndQuestion();
    }, 1000 * 5);
    return () => {
      clearTimeout(timeout);
    };
  }, [handleEndQuestion, pin]);

  useEffect(() => {
    socket.on("answer_sent", (username, answer) => {
      console.log(username, answer);
      const timeElapsed = Math.round((Date.now() - time) / 1000);
      const score = ((20 - timeElapsed) / 20) * 500 + 500;
      console.log("isCorrect");
      console.log(question.answers[answer]?.isCorrect);
      if (question.answers[answer]?.isCorrect) {
        setUsers((users) =>
          users.map((user) =>
            user.name === username
              ? { name: user.name, score: user.score + score }
              : user
          )
        );
      }
    });
    return () => {
      socket.off("answer_sent");
    };
  }, [question, setUsers, time]);

  return (
    <div>
      <Timer seconds={5} />
      <div>{question.text}</div>
      <div>
        {question.answers.map((answer) => (
          <div key={answer.text}>{answer.text}</div>
        ))}
      </div>
      <button onClick={handleEndQuestion}>end question</button>
    </div>
  );
}
