import deepEqual from "deep-equal";
import { type MutableRefObject, useEffect, useState } from "react";
import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { defaultQuizValues } from "./defaultQuizValues";
import { api } from "~/utils/api";
import { draftQuizSchema } from "~/types&schemas/draftSchema";
import type { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";

export function useInitDraft(
  data: savedDraftQuizValues,
  alreadySaved: boolean,
  setValue: UseFormSetValue<savedDraftQuizValues>
) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { mutate } = api.quiz.createDraftQuiz.useMutation({
    onSuccess: (quizId) => {
      history.pushState({}, "", "/create/" + quizId);
      setValue("quiz.id", quizId);
    },
  });
  useEffect(() => {
    if (!isInitialized && !alreadySaved) {
      if (!deepEqual(data, defaultQuizValues)) {
        mutate(data);
        setIsInitialized(true);
      }
    }
  }, [isInitialized, alreadySaved, data, mutate]);
}
