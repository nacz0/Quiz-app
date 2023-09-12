import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import CrossIcon from "~/svg/cross";
import { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";
import { Dialog } from "../dialog";
import { ImageInput } from "./ImageInput";
const ytRegexPattern =
  /(?:\?v=|\/embed\/|\/v\/|\/vi\/|\/e\/|youtu\.be\/|\/user\/\S+\/u\/\d+\/|\/attribution_link\?a=|\/playlist\?list=|\/watch\?v=|\/watch\?feature=player_embedded&v=|\/videos\?list=|\/watch\?v%3D)([a-zA-Z0-9_-]{11})/;

export function MediaDialog(props: {
  setValue: UseFormSetValue<savedDraftQuizValues>;
  currentQuestion: number;
  setOpened: Dispatch<SetStateAction<boolean>>;
  register: UseFormRegister<savedDraftQuizValues>;
}) {
  const { setValue, currentQuestion, setOpened, register } = props;
  const [isError, setIsError] = useState(false);

  function onBlurEnter(value: string) {
    const match = value.match(ytRegexPattern);
    if (match) {
      setValue(`questions.${currentQuestion}.ytLink`, match[1], {
        shouldValidate: true,
      });
      setOpened(false);
    } else {
      setIsError(true);
    }
  }

  return (
    <Dialog
      key={`questions.${currentQuestion}`}
      openFn={setOpened}
      dialogClass="bg-teal-50"
    >
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
            onHandleEnd={() => setOpened(false)}
          >
            <div>Wybierz zdjęcie</div>
          </ImageInput>
        </div>
        <div>
          Prześlij film z YouTube{" "}
          <input
            key={`questions.${currentQuestion}.ytLink`}
            type="text"
            className="rounded-lg border border-gray-400"
            onBlur={(e) => onBlurEnter(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onBlurEnter(e.currentTarget.value);
              }
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
