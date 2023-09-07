import { useEffect, useRef, useState } from "react";
import { useWatch, type Control, type UseFormRegister } from "react-hook-form";
import { quizMaxLength } from "~/types&schemas/quizMaxLength";
import { type savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";
import { MaxLengthGuidance } from "./MaxLengthGuidance";

export function ResizableInput(props: {
  control: Control<savedDraftQuizValues>;
  currentQuestion: number;
  register: UseFormRegister<savedDraftQuizValues>;
}) {
  const { control, currentQuestion, register } = props;
  const { ref, ...rest } = register(`questions.${currentQuestion}.text`);
  const question = useWatch({
    control,
    name: `questions.${currentQuestion}.text`,
  });
  const [rows, setRows] = useState(1);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      if (textAreaRef.current.scrollHeight > textAreaRef.current.offsetHeight) {
        console.log("overflow");
        setRows((prev) => prev + 1);
      }
    }
  }, [question]);
  return (
    <div
      className=" flex h-fit w-full flex-row items-center justify-between rounded-3xl   bg-teal-50 px-10  py-2 
          font-semibold no-underline shadow-lg  transition duration-200  focus-within:bg-teal-50/70"
    >
      <textarea
        {...rest}
        name={`questions.${currentQuestion}.text`}
        ref={(e) => {
          ref(e);
          textAreaRef.current = e;
        }}
        key={`questions.${currentQuestion}.text`}
        placeholder="Wpisz pytanie..."
        className=" w-11/12 resize-none  bg-transparent outline-none "
        rows={rows}
        maxLength={quizMaxLength.question.text}
      ></textarea>
      <div className="flex h-full  w-1/12 flex-col items-end justify-start pt-1">
        <MaxLengthGuidance
          text={question}
          maxLength={quizMaxLength.question.text}
        />
      </div>
    </div>
  );
}
