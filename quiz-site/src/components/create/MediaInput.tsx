import Image from "next/image";
import { useState } from "react";
import {
  UseFormRegister,
  useWatch,
  type Control,
  type UseFormSetValue,
} from "react-hook-form";
import CrossIcon from "~/svg/cross";
import type { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";
import { Dialog } from "../dialog";
import { ImageInput } from "./ImageInput";

export function MediaInput(props: {
  setValue: UseFormSetValue<savedDraftQuizValues>;
  currentQuestion: number;
  control: Control<savedDraftQuizValues>;
  register: UseFormRegister<savedDraftQuizValues>;
}) {
  const { setValue, currentQuestion, control, register } = props;
  const [opened, setOpened] = useState(false);
  const question = useWatch({
    control,
    name: `questions.${currentQuestion}`,
  });
  function MediaDialog() {
    return (
      <Dialog openFn={setOpened} dialogClass="bg-teal-50">
        <div className="flex flex-col text-xl font-semibold">
          <div className="flex justify-end">
            <button onClick={() => setOpened(false)}>
              <CrossIcon size={18} />
            </button>
          </div>
          <div>
            Prześlij zdjęcie{" "}
            <ImageInput
              setValue={setValue}
              input={`questions.${currentQuestion}.image`}
            />
          </div>
          <div>
            Prześlij film z YouTube{" "}
            <input
              key={`questions.${currentQuestion}.ytLink`}
              type="text"
              className="rounded-lg border border-gray-400"
              {...register(`questions.${currentQuestion}.ytLink`)}
            />
          </div>
        </div>
      </Dialog>
    );
  }
  console.log(currentQuestion);
  return (
    <>
      <div
        key={`question.${currentQuestion}`}
        className="mt-4 flex w-full  justify-center px-8"
      >
        {!question.image && !question.ytLink && (
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
        {question.image && (
          <div
            key={`questions.${currentQuestion}.image`}
            className="relative flex aspect-[3/2] h-full max-h-[200px] w-full max-w-[300px]  items-center  justify-center "
          >
            <Image
              src={question.image}
              alt="zdjęcie"
              fill={true}
              className=" object-cover "
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
      </div>
      {opened && <MediaDialog />}
    </>
  );
}
