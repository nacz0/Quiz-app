import { type UseFormRegister } from "react-hook-form";
import { type QuizFormValues } from "./zodSchema";

export function SingleAnswer(props: {
  currentQuestion: number;
  register: UseFormRegister<QuizFormValues>;
}) {
  const { currentQuestion, register } = props;
  const numOfAnswers = [0, 1, 2, 3];
  return (
    <div>
      <input
        key={`questions.${currentQuestion}.question`}
        {...register(`questions.${currentQuestion}.question`)}
      ></input>

      <div className="flex flex-col gap-4 bg-red-400 p-4">
        {numOfAnswers.map((answer) => (
          <div className="flex flex-row gap-3" key={answer}>
            <input
              defaultValue={""}
              {...register(
                `questions.${currentQuestion}.answers.${answer}.text`
              )}
              key={`questions.${currentQuestion}.answers.${answer}.text`}
            ></input>

            <input
              type="checkbox"
              {...register(
                `questions.${currentQuestion}.answers.${answer}.correct`
              )}
              key={`questions.${currentQuestion}.answers.${answer}.correct`}
            ></input>
          </div>
        ))}
      </div>
    </div>
  );
}
