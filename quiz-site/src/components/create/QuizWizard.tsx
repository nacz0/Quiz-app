import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";
import { api } from "~/utils/api";
import { quizSchema } from "../../types&schemas/quizSchema";
import { CreateNavBar } from "./CreateNavbar";
import QuestionCarousel from "./QuestionCarousel";
import { SingleAnswer } from "./SingleAnswer";
import { UseSaveDraft } from "./UseSaveDraft";
import { defaultQuizValues } from "./defaultQuizValues";

export function QuizWizard(props: {
  alreadySaved: boolean;
  draftData?: savedDraftQuizValues;
}) {
  const router = useRouter();
  const { alreadySaved } = props;
  const { mutate, isLoading, isSuccess } = api.quiz.createQuiz.useMutation({
    onSuccess: (id) => void router.push(`/quiz/${id}`),
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const {
    register,
    reset,
    setValue,
    control,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<savedDraftQuizValues>({
    defaultValues: defaultQuizValues,
    resolver: zodResolver(quizSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });
  UseSaveDraft(isLoading, isSuccess, alreadySaved, watch, setValue);
  useEffect(() => {
    if (props.draftData) {
      reset(props.draftData);
    }
  }, [props.draftData, reset]);
  return (
    <main className="relative h-full min-h-[92vh]  w-full overflow-x-hidden  bg-[url('/bgCreate.svg')] ">
      <form
        onSubmit={handleSubmit((data) => {
          console.log(quizSchema);
          const quiz = quizSchema.parse(data);
          console.log("submit");
          console.log(quiz);
          mutate(quiz);
        })}
        className="	overflow-x-hidden"
      >
        <CreateNavBar
          errors={errors}
          register={register}
          setValue={setValue}
          control={control}
        />
        <div className=" flex w-full  flex-col    items-center overflow-y-auto overflow-x-hidden px-4 pb-24   pt-4">
          <SingleAnswer
            setValue={setValue}
            register={register}
            currentQuestion={currentQuestion}
            control={control}
            trigger={trigger}
          />
        </div>
        <QuestionCarousel
          fields={fields}
          setCurrentQuestion={setCurrentQuestion}
          append={append}
          errors={errors}
          trigger={trigger}
          control={control}
          currentQuestion={currentQuestion}
        />
      </form>
    </main>
  );
}
