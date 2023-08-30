import { type UseFormSetValue, type UseFormRegister } from "react-hook-form";
import { type QuizFormValues } from "../../types&schemas/quizSchema";
import { compressFileInputImg } from "~/lib/functions/compressFileInputImg";

export function SingleAnswer(props: {
  currentQuestion: number;
  register: UseFormRegister<QuizFormValues>;
  setValue: UseFormSetValue<QuizFormValues>;
}) {
  const { currentQuestion, register, setValue } = props;
  const numOfAnswers = [0, 1, 2, 3];

  function ImageInput() {
    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const file = e.target.files[0];
      if (!file) return;
      const compressedImg = await compressFileInputImg(file, 720, 0.5);
      if (!compressedImg) return;
      setValue(`questions.${currentQuestion}.image`, compressedImg);
    };
    return (
      <>
        <label htmlFor="fileInput" className=" cursor-pointer">
          <div className="">
            <span className="text-xs font-semibold">IMAGE</span>
          </div>
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleFileInput}
          className="hidden"
        />
      </>
    );
  }
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
        <ImageInput />
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
