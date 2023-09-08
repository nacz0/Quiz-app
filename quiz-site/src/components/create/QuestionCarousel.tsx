import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import type {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFormTrigger,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import PlusIcon from "~/svg/plus";
import type { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";

interface QuestionCarouselProps {
  fields: FieldArrayWithId<savedDraftQuizValues, "questions", "id">[];
  setCurrentQuestion: Dispatch<SetStateAction<number>>;
  append: UseFieldArrayAppend<savedDraftQuizValues, "questions">;
  errors: FieldErrors<savedDraftQuizValues>;
  trigger: UseFormTrigger<savedDraftQuizValues>;
  control: Control<savedDraftQuizValues>;
  currentQuestion: number;
}

export default function QuestionCarousel(props: QuestionCarouselProps) {
  const {
    fields,
    setCurrentQuestion,
    append,
    errors,
    trigger,
    control,
    currentQuestion,
  } = props;

  /*const question = useWatch({
    control,
    name: `questions.${currentQuestion}.text`,
  });*/

  const question = useWatch({
    control,
    name: `questions`,
  });

  console.log(errors.questions);
  console.log(errors.questions?.[0]?.answers);
  console.log("carousel");
  return (
    <div className="fixed  bottom-0 z-10 flex h-20 w-full items-center bg-amber-300 px-3   py-1">
      <div className="flex h-full w-full flex-row gap-2 overflow-x-scroll">
        {fields.map((field, index) => (
          <button
            type="button"
            onClick={() => {
              setCurrentQuestion(index);
              void trigger();
            }}
            key={field.id}
            className="relative flex flex-row items-center justify-center gap-2"
          >
            {index}
            <div className="flex h-14 w-20 flex-col items-center justify-center rounded-lg border border-gray-500 p-1 text-sm">
              <div className=" line-clamp-1 break-all">{field.text}</div>
              <div className="relative flex    h-6 w-9 items-center ">
                {field.image && (
                  <Image
                    className=" object-cover"
                    src={field.image}
                    alt={""}
                    fill={true}
                  />
                )}
              </div>
            </div>
            {errors.questions?.[index] && (
              <div className="absolute -right-3 top-0 h-6 w-6 rounded-full border border-teal-700 bg-teal-300 font-black text-teal-700">
                !
              </div>
            )}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="ml-3 rounded-full bg-amber-400 p-2"
        onClick={() => {
          append({
            text: "",
            answers: [
              {
                text: "",
                isCorrect: false,
                image: "",
              },
              {
                text: "",
                isCorrect: false,
                image: "",
              },
              {
                text: "",
                isCorrect: false,
                image: "",
              },
              {
                text: "",
                isCorrect: false,
                image: "",
              },
            ],
            ytLink: "",
            image: "",
            answerTime: "20",
            type: "answers",
          });
          setCurrentQuestion(fields.length);
        }}
      >
        <PlusIcon size={20} />
      </button>
    </div>
  );
}
