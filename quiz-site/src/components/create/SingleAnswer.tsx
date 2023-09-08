import { useEffect } from "react";
import {
  Control,
  UseFormTrigger,
  useWatch,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { quizMaxLength } from "~/types&schemas/quizMaxLength";
import type { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";
import { MediaInput } from "./MediaInput";
import { ResizableInput } from "./resizableInput";

export function SingleAnswer(props: {
  currentQuestion: number;
  register: UseFormRegister<savedDraftQuizValues>;
  setValue: UseFormSetValue<savedDraftQuizValues>;
  control: Control<savedDraftQuizValues>;
  trigger: UseFormTrigger<savedDraftQuizValues>;
}) {
  const { currentQuestion, register, setValue, control, trigger } = props;
  const question = useWatch({
    control,
    name: `questions.${currentQuestion}`,
  });

  useEffect(() => {
    void trigger(`questions.${currentQuestion}`);
  }, [currentQuestion, question, trigger]);

  const numOfAnswers = [0, 1, 2, 3];
  const colors = ["bg-red-600", "bg-green-600", "bg-blue-600", "bg-yellow-500"];
  const border = [
    "border-red-700",
    "border-green-700",
    "border-blue-700",
    "border-yellow-600",
  ];

  return (
    <div className="flex h-full w-full flex-col items-center ">
      <ResizableInput
        control={control}
        currentQuestion={currentQuestion}
        register={register}
      />
      <MediaInput
        control={control}
        setValue={setValue}
        currentQuestion={currentQuestion}
        register={register}
      />
      <div className=" mt-5 grid grid-cols-2 gap-2">
        {numOfAnswers.map((answer) => (
          <div
            className={`${colors[answer]} ${border[answer]} relative flex h-24 w-40 flex-row rounded-lg border-b-4 p-2 `}
            key={answer}
          >
            <textarea
              defaultValue={""}
              spellCheck={false}
              maxLength={quizMaxLength.answer.text}
              {...register(
                `questions.${currentQuestion}.answers.${answer}.text`
              )}
              placeholder={`Dodaj odpowiedź ${answer + 1}. `}
              key={`questions.${currentQuestion}.answers.${answer}.text`}
              className="mt-2 h-full w-full   resize-none bg-transparent text-xs font-semibold text-white outline-none placeholder:text-white "
            ></textarea>
            <div className="absolute right-0 top-0">
              <input
                type="checkbox"
                className="relative h-4 w-4 appearance-none rounded-full border-2 border-white  bg-transparent outline-none  transition-colors 
                duration-300 before:absolute before:left-[1.5px] before:top-[1.5px] 
                before:w-[9px] before:bg-white before:content-[''] before:[clip-path:polygon(14%_44%,_0_65%,_50%_100%,_100%_16%,_80%_0%,_43%_62%)]
                 checked:bg-green-400  checked:before:h-[9px]"
                {...register(
                  `questions.${currentQuestion}.answers.${answer}.isCorrect`
                )}
                key={`questions.${currentQuestion}.answers.${answer}.isCorrect`}
              ></input>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
