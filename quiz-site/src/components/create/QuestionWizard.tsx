import { useForm, useFieldArray, UseFormGetValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SingleAnswer } from "./SingleAnswer";
import { useEffect, useState } from "react";
import {
  type QuizFormValues,
  quizSchema,
} from "../../types&schemas/quizSchema";
import {
  UseLocalStorageGet,
  UseLocalStorageSet,
} from "~/lib/hooks/useLocalStorage";
import { api } from "~/utils/api";
import { ImageInput } from "./ImageInput";
export function QuestionWizard() {
  const { mutate } = api.quiz.createQuiz.useMutation({
    onSuccess: (data) => console.log(data),
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const setValues = UseLocalStorageSet("quiz");

  const defaultValues = {
    quiz: {
      title: "",
      description: "",
      image: "",
    },
    questions: [
      {
        text: "",
        ytLink: "",
        image: "",
        answerTime: 20,

        answers: [
          {
            text: "",
            isCorrect: false,
            image: "",
          },
          {
            text: "",
            isCorrect: false,
            image: "",
          },
          {
            text: "",
            isCorrect: false,
            image: "",
          },
          {
            text: "",
            isCorrect: false,
            image: "",
          },
        ],
      },
    ],
  };
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<QuizFormValues>({
    defaultValues: defaultValues,
    resolver: zodResolver(quizSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });
  console.log("render");
  console.log(getValues());
  console.log(errors);

  useEffect(() => {
    setValues(getValues);
  });
  UseLocalStorageGet("quiz", reset, quizSchema);

  return (
    <div>
      <button type="button" onClick={() => reset(defaultValues)}>
        reset
      </button>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
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
