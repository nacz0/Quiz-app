import { useEffect, useRef } from "react";
import { api } from "~/utils/api";
import type { UseFormGetValues } from "react-hook-form";
import deepEqual from "deep-equal";
import { defaultQuizValues } from "./defaultQuizValues";
import { useInitDraft } from "./useInitDraft";
import type { DraftQuizValues } from "~/types&schemas/draftSchema";

export function UseSaveDraft(
  isLoading: boolean,
  isSuccess: boolean,
  alreadySaved: boolean
) {
  const { mutate } = api.quiz.createDraftQuiz.useMutation();
  const getValuesRef = useRef<null | UseFormGetValues<DraftQuizValues>>(null);
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

  function setValues(getValues: UseFormGetValues<DraftQuizValues>) {
    getValuesRef.current = getValues;
  }
  useInitDraft(getValuesRef, alreadySaved);
  return setValues;
}
