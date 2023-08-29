import { useForm, useFieldArray, UseFormGetValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SingleAnswer } from "./SingleAnswer";
import { useEffect, useRef, useState } from "react";
import {
  type QuizFormValues,
  quizSchema,
} from "../../types&schemas/quizSchema";
import {
  UseLocalStorageGet,
  UseLocalStorageSet,
} from "~/hooks/useLocalStorage";
import { api } from "~/utils/api";
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
        question: "",
        ytLink: "",
        image: "",
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
    reset,
    formState: { errors },
  } = useForm<QuizFormValues>({
    defaultValues: defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });
  console.log("render");

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
              onClick={() => append({ text: "", answers: [] })}
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
            <input {...register("quiz.image")}></input>
            {errors.quiz?.image && <p>{errors.quiz.image.message}</p>}
          </div>
          <button type="submit">submit</button>
          <SingleAnswer register={register} currentQuestion={currentQuestion} />
        </div>
      </form>
    </div>
  );
}
