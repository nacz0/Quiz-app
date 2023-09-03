import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SingleAnswer } from "./SingleAnswer";
import { useEffect, useState } from "react";
import {
  type QuizFormValues,
  quizSchema,
} from "../../types&schemas/quizSchema";
import { api } from "~/utils/api";
import { ImageInput } from "./ImageInput";
import { UseSaveDraft } from "./UseSaveDraft";
import { defaultQuizValues } from "./defaultQuizValues";

export function QuestionWizard(props: { alreadySaved: boolean }) {
  const { alreadySaved } = props;
  const { mutate, isLoading, isSuccess } = api.quiz.createQuiz.useMutation({
    onSuccess: (data) => console.log(data),
  });
  const setValues = UseSaveDraft(isLoading, isSuccess, alreadySaved);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [dummy, setDummy] = useState(0);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<QuizFormValues>({
    defaultValues: defaultQuizValues,
    resolver: zodResolver(quizSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });
  useEffect(() => {
    setValues(getValues);
  });
  console.log(getValues());

  return (
    <div>
      <button type="button" onClick={() => reset(defaultQuizValues)}>
        reset
      </button>
      <button onClick={() => setDummy(dummy + 1)}>+1</button>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(quizSchema);
          mutate(data);
        })}
      >
        <div className="flex gap-4">
          <div className="flex flex-col bg-yellow-300 p-3">
            {fields.map((field, index) => (
              <button
                type="button"
                onClick={() => setCurrentQuestion(index)}
                key={field.id}
              >
                {index}
              </button>
            ))}
            <button
              type="button"
              onClick={() =>
                append({
                  text: "",
                  answers: [],
                  ytLink: "",
                  image: "",
                  answerTime: 20,
                  type: "answers",
                })
              }
            >
              Add Question
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <input {...register("quiz.title")}></input>
            {errors.quiz?.title && <p>{errors.quiz.title.message}</p>}
            <input {...register("quiz.description")}></input>
            {errors.quiz?.description && (
              <p>{errors.quiz.description.message}</p>
            )}
            <ImageInput input="quiz.image" setValue={setValue} />
            {errors.quiz?.image && <p>{errors.quiz.image.message}</p>}
          </div>
          <button type="submit">submit</button>
          <SingleAnswer
            setValue={setValue}
            register={register}
            currentQuestion={currentQuestion}
          />
        </div>
      </form>
    </div>
  );
}
