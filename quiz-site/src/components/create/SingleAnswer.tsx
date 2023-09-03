import { type UseFormSetValue, type UseFormRegister } from "react-hook-form";
import { ImageInput } from "./ImageInput";
import type { DraftQuizValues } from "~/types&schemas/draftSchema";

export function SingleAnswer(props: {
  currentQuestion: number;
  register: UseFormRegister<DraftQuizValues>;
  setValue: UseFormSetValue<DraftQuizValues>;
}) {
  const { currentQuestion, register, setValue } = props;
  const numOfAnswers = [0, 1, 2, 3];

  return (
    <div>
      <div className="flex flex-col gap-3">
        <input
          key={`questions.${currentQuestion}.text`}
          {...register(`questions.${currentQuestion}.text`)}
          placeholder="Question text"
        ></input>
        <input
          key={`questions.${currentQuestion}.ytLink`}
          {...register(`questions.${currentQuestion}.ytLink`)}
          placeholder="Youtube link"
        ></input>
        <ImageInput
          input={`questions.${currentQuestion}.image`}
          setValue={setValue}
        />
        <input
          type="number"
          min={0}
          max={40}
          key={`questions.${currentQuestion}.anwerTime`}
          {...register(`questions.${currentQuestion}.answerTime`)}
          placeholder="Answer time"
        ></input>
        <select
          key={`questions.${currentQuestion}.type`}
          {...register(`questions.${currentQuestion}.type`)}
          placeholder="type"
        >
          <option value="answers">Answers</option>
          <option value="true_false">Text</option>
          <option value="input">Image</option>
          <option value="slider">Youtube</option>
        </select>
      </div>
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
