import {
  Control,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import type { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";
import { ResizableInput } from "./resizableInput";

export function SingleAnswer(props: {
  currentQuestion: number;
  register: UseFormRegister<savedDraftQuizValues>;
  setValue: UseFormSetValue<savedDraftQuizValues>;
  control: Control<savedDraftQuizValues>;
}) {
  const { currentQuestion, register, setValue, control } = props;
  const numOfAnswers = [0, 1, 2, 3];

  return (
    <div className="flex h-full w-full flex-col items-center ">
      <ResizableInput
        control={control}
        currentQuestion={currentQuestion}
        register={register}
      />
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
                `questions.${currentQuestion}.answers.${answer}.isCorrect`
              )}
              key={`questions.${currentQuestion}.answers.${answer}.isCorrect`}
            ></input>
          </div>
        ))}
      </div>
    </div>
  );
}
