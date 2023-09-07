import Image from "next/image";
import { type Dispatch, type SetStateAction } from "react";
import { useWatch } from "react-hook-form";
import { BgIcon } from "~/svg/bg";
import CrossIcon from "~/svg/cross";
import { LogoIcon } from "~/svg/logo";
import { quizMaxLength } from "~/types&schemas/quizMaxLength";
import type { FormProps } from "./CreateNavbar";
import { ImageInput } from "./ImageInput";
import { MaxLengthGuidance } from "./MaxLengthGuidance";

export function QuizSettings(
  props: FormProps & { setOpened: Dispatch<SetStateAction<boolean>> }
) {
  const { errors, register, setValue, setOpened, control } = props;
  const quizValues = useWatch({ control, name: "quiz" });

  return (
    <div className="fixed top-0 z-40  flex  h-screen  w-screen flex-col  bg-white p-4">
      <div className="flex justify-end">
        <button type="button" onClick={() => setOpened((prev) => !prev)}>
          <CrossIcon size={20} />
        </button>
      </div>
      <div>
        <div className="flex flex-col gap-4">
          <div
            className="flex  h-14 flex-row items-center justify-between    rounded-3xl bg-teal-50  px-10 
          font-semibold no-underline shadow-lg  transition duration-200  focus-within:bg-teal-50/70"
          >
            <div className="relative flex w-full flex-col  justify-center ">
              {quizValues.title && <div className="text-sm">Tytuł</div>}
              <input
                maxLength={quizMaxLength.quiz.title}
                className=" w-5/6 bg-transparent"
                {...register("quiz.title")}
                placeholder="Tytuł"
              ></input>
            </div>
            <MaxLengthGuidance
              text={quizValues.title}
              maxLength={quizMaxLength.quiz.title}
            />
          </div>
          <div
            className=" relative flex h-36 flex-row justify-between    rounded-3xl bg-teal-50  px-10 py-3 
          font-semibold no-underline shadow-lg  transition duration-200  focus-within:bg-teal-50/70"
          >
            <div className="relative flex w-full flex-col  justify-center ">
              {quizValues.description && <div className="text-sm">Opis</div>}
              <textarea
                className="h-full w-5/6  resize-none bg-teal-50 pr-5 outline-none transition duration-200  focus:bg-teal-50/70 "
                maxLength={quizMaxLength.quiz.description}
                {...register("quiz.description")}
                placeholder="Opis"
              ></textarea>
            </div>
            <MaxLengthGuidance
              text={quizValues.description}
              maxLength={quizMaxLength.quiz.description}
            />
          </div>
          <div className="flex flex-col gap-3 ">
            <div className="font-bold">Zdjęcie tytułowe</div>

            {quizValues.image ? (
              <div className="relative  flex h-40 w-40 items-center ">
                <Image
                  className=" object-cover"
                  src={quizValues.image}
                  alt={""}
                  fill={true}
                />
              </div>
            ) : (
              <div className="relative  flex h-40 w-40 items-center overflow-hidden opacity-70">
                <BgIcon />
                <div className="absolute flex h-full w-full items-center justify-center">
                  <div>
                    <LogoIcon size={128} />
                  </div>
                </div>
              </div>
            )}

            <ImageInput input="quiz.image" setValue={setValue} />
          </div>
        </div>
      </div>
    </div>
  );
}
