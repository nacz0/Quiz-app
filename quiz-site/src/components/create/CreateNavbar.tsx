import Link from "next/link";
import { useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { LogoIcon } from "~/svg/logo";
import type { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";
import { QuizSettings } from "./QuizSettings";

export interface FormProps {
  errors: FieldErrors<savedDraftQuizValues>;
  register: UseFormRegister<savedDraftQuizValues>;
  setValue: UseFormSetValue<savedDraftQuizValues>;
  control: Control<savedDraftQuizValues>;
}
export function CreateNavBar(props: FormProps) {
  const { errors, register, setValue, control } = props;
  const [opened, setOpened] = useState(false);

  return (
    <nav className="sticky   top-0 z-20 flex h-14 w-full items-center   bg-teal-300">
      <Link
        href={"/"}
        className="ml-1 flex h-12 w-12 items-center justify-center "
      >
        <LogoIcon />
      </Link>
      <button type="button" onClick={() => setOpened(!opened)}>
        Tytuł, opis...
      </button>
      {!opened && (
        <QuizSettings
          errors={errors}
          register={register}
          setValue={setValue}
          setOpened={setOpened}
          control={control}
        />
      )}
    </nav>
  );
}
