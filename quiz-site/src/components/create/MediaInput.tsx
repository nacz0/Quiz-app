import { useState } from "react";
import {
  UseFormRegister,
  type Control,
  type UseFormSetValue,
} from "react-hook-form";
import type { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";
import { MediaDialog } from "./MediaDialog";
import { MediaView } from "./MediaView";

export function MediaInput(props: {
  setValue: UseFormSetValue<savedDraftQuizValues>;
  currentQuestion: number;
  control: Control<savedDraftQuizValues>;
  register: UseFormRegister<savedDraftQuizValues>;
}) {
  const { setValue, currentQuestion, control, register } = props;
  const [opened, setOpened] = useState(false);

  return (
    <>
      {!opened && (
        <MediaView
          currentQuestion={currentQuestion}
          control={control}
          setOpened={setOpened}
        />
      )}
      {opened && (
        <MediaDialog
          setValue={setValue}
          currentQuestion={currentQuestion}
          setOpened={setOpened}
          register={register}
        />
      )}
    </>
  );
}
