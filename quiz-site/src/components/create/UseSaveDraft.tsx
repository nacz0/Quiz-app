import { useEffect, useRef } from "react";
import { api } from "~/utils/api";
import type { UseFormGetValues } from "react-hook-form";
import { type QuizFormValues } from "../../types&schemas/quizSchema";
import deepEqual from "deep-equal";
import { defaultQuizValues } from "./defaultQuizValues";
import { useInitDraft } from "./useInitDraft";

export function UseSaveDraft(
  isLoading: boolean,
  isSuccess: boolean,
  alreadySaved: boolean
) {
  const { mutate } = api.quiz.createDraftQuiz.useMutation();
  const getValuesRef = useRef<null | UseFormGetValues<QuizFormValues>>(null);
  useEffect(() => {
    function saveDraft() {
      if (isLoading || isSuccess) {
        return;
      }
      if (getValuesRef.current) {
        const values = getValuesRef.current();
        if (!deepEqual(values, defaultQuizValues)) {
          mutate(values);
        }
      }
    }

    window.addEventListener("beforeunload", saveDraft);
    return () => {
      window.removeEventListener("beforeunload", saveDraft);
    };
  }, [isLoading, isSuccess, mutate]);

  function setValues(getValues: UseFormGetValues<QuizFormValues>) {
    getValuesRef.current = getValues;
  }
  useInitDraft(getValuesRef, alreadySaved);
  return setValues;
}
