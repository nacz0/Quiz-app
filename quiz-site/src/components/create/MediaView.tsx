import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Control, useWatch } from "react-hook-form";
import { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";

export function MediaView(props: {
  currentQuestion: number;
  control: Control<savedDraftQuizValues>;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const { currentQuestion, control, setOpened } = props;
  const questions = useWatch({
    control,
    name: `questions`,
  });

  const question = questions[currentQuestion];
  return (
    <div
      key={`question.${currentQuestion}`}
      className="mt-4 flex w-full  justify-center px-8"
    >
      {!question?.image && !question?.ytLink && (
        <div
          className="flex aspect-[3/2] h-full max-h-[200px] w-full max-w-[300px]  items-center  justify-center 
          bg-opacity-90 bg-[url('/bgMedia.svg')] bg-cover"
        >
          <button
            onClick={() => setOpened(true)}
            className="  bg-teal-200 bg-opacity-40 text-xl font-black    text-teal-700 "
          >
            Wybierz media
          </button>
        </div>
      )}
      {question && (
        <>
          {question.image && (
            <div
              key={`questions.${currentQuestion}.image`}
              className="relative flex aspect-[3/2] h-full max-h-[200px] w-full max-w-[300px]  items-center  justify-center bg-teal-50/50 "
            >
              <Image
                src={question.image}
                alt="zdjęcie"
                fill={true}
                className=" object-contain "
                key={`questions.${currentQuestion}.image`}
              />
            </div>
          )}
          {question.ytLink && (
            <div
              key={`questions.${currentQuestion}.ytLink`}
              className=" relative  aspect-video h-full   w-[60vh]    overflow-hidden "
            >
              <iframe
                src={`https://www.youtube.com/embed/${question.ytLink};showinfo=0&controls=0&modestbranding=0&autoplay=1;`}
                className="h-full w-full" //ml-[-200%] h-full w-[500%] for playing
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                key={`questions.${currentQuestion}.ytLink`}
              ></iframe>
            </div>
          )}
        </>
      )}
    </div>
  );
}
