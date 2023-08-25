import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SingleAnswer } from "./SingleAnswer";
import { useState } from "react";
import { type QuizFormValues, quizSchema } from "./zodSchema";
export function QuestionWizard() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<QuizFormValues>({
    defaultValues: {
      quiz: {
        title: "",
        description: "",
        image: "",
      },
      questions: [
        {
          question: "",
          answers: [
            {
              text: "",
              correct: false,
              image: "",
            },
            {
              text: "",
              correct: false,
              image: "",
            },
            {
              text: "",
              correct: false,
              image: "",
            },
            {
              text: "",
              correct: false,
              image: "",
            },
          ],
        },
      ],
    },
    resolver: zodResolver(quizSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  console.log(watch());

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
        <div className="flex gap-4">
          <div className="flex flex-col bg-yellow-300 p-3">
            {fields.map((field, index) => (
              <button onClick={() => setCurrentQuestion(index)} key={field.id}>
                {index}
              </button>
            ))}
            <button onClick={() => append({ question: "", answers: [] })}>
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
