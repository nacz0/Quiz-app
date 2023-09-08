import { type UseFormSetValue } from "react-hook-form";
import { compressFileInputImg } from "~/lib/functions/compressFileInputImg";
import type { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";

export function ImageInput(props: {
  setValue: UseFormSetValue<savedDraftQuizValues>;
  input: "quiz.image" | `questions.${number}.image`;
}) {
  console.log(props.input);
  const { setValue, input } = props;
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    const compressedImg = await compressFileInputImg(file, 720, 0.5);
    console.log(compressedImg);
    if (!compressedImg) return;

    setValue(input, compressedImg);
  };
  return (
    <>
      <label htmlFor="fileInput" className=" w-fit cursor-pointer">
        <div className="">
          <span className=" rounded-lg border-2 border-amber-300 bg-amber-200 p-1 text-sm font-semibold">
            Zmień
          </span>
        </div>
      </label>
      <input
        key={input}
        id="fileInput"
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileInput}
        className="hidden"
      />
    </>
  );
}
