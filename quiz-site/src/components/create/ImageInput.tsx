import { type UseFormSetValue } from "react-hook-form";
import { compressFileInputImg } from "~/lib/functions/compressFileInputImg";
import type { DraftQuizValues } from "~/types&schemas/draftSchema";

export function ImageInput(props: {
  setValue: UseFormSetValue<DraftQuizValues>;
  input: "quiz.image" | `questions.${number}.image`;
}) {
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
      <label htmlFor="fileInput" className=" cursor-pointer">
        <div className="">
          <span className="text-xs font-semibold">IMAGE</span>
        </div>
      </label>
      <input
        id="fileInput"
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileInput}
        className="hidden"
      />
    </>
  );
}
