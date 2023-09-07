import { zodResolver } from "@hookform/resolvers/zod";
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
  const { alreadySaved } = props;
  const { mutate, isLoading, isSuccess } = api.quiz.createQuiz.useMutation({
    onSuccess: (data) => console.log(data),
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [dummy, setDummy] = useState(0);
  const {
    register,
    reset,
    setValue,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<savedDraftQuizValues>({
    defaultValues: defaultQuizValues,
    resolver: zodResolver(quizSchema),
  });
  control;
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
    <form
      onSubmit={handleSubmit((data) => {
        console.log(quizSchema);
        const quiz = quizSchema.parse(data);
        console.log("submit");
        console.log(quiz);
        mutate(quiz);
      })}
      className=" h-screen w-full overflow-hidden bg-[url('/bgCreate.svg')] 	"
    >
      <CreateNavBar
        errors={errors}
        register={register}
        setValue={setValue}
        control={control}
      />
      <div className="mt-8 flex  h-full w-full flex-col items-center  px-4">
        <SingleAnswer
          setValue={setValue}
          register={register}
          currentQuestion={currentQuestion}
          control={control}
        />
      </div>
      <QuestionCarousel
        fields={fields}
        setCurrentQuestion={setCurrentQuestion}
        append={append}
      />
    </form>
  );
}
