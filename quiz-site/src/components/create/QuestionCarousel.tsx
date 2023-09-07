import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import type { FieldArrayWithId, UseFieldArrayAppend } from "react-hook-form";
import PlusIcon from "~/svg/plus";
import type { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";

interface QuestionCarouselProps {
  fields: FieldArrayWithId<savedDraftQuizValues, "questions", "id">[];
  setCurrentQuestion: Dispatch<SetStateAction<number>>;
  append: UseFieldArrayAppend<savedDraftQuizValues, "questions">;
}

export default function QuestionCarousel(props: QuestionCarouselProps) {
  const { fields, setCurrentQuestion, append } = props;
  return (
    <div className="sticky  bottom-0 z-10 flex h-20 w-full items-center bg-amber-300 px-3   py-1">
      <div className="flex h-full w-full flex-row gap-2 overflow-x-scroll">
        {fields.map((field, index) => (
          <button
            type="button"
            onClick={() => setCurrentQuestion(index)}
            key={field.id}
            className="flex flex-row items-center justify-center gap-2"
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
          </button>
        ))}
      </div>
      <button
        type="button"
        className="ml-3 rounded-full bg-amber-400 p-2"
        onClick={() =>
          append({
            text: "",
            answers: [],
            ytLink: "",
            image: "",
            answerTime: "20",
            type: "answers",
          })
        }
      >
        <PlusIcon size={20} />
      </button>
    </div>
  );
}
