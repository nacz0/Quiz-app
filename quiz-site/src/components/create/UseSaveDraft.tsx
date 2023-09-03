import { useEffect, useRef } from "react";
import { api } from "~/utils/api";
import type { UseFormGetValues } from "react-hook-form";
import deepEqual from "deep-equal";
import { defaultQuizValues } from "./defaultQuizValues";
import { useInitDraft } from "./useInitDraft";
import type { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";

export function UseSaveDraft(
  isLoading: boolean,
  isSuccess: boolean,
  alreadySaved: boolean
) {
  const { mutate } = api.quiz.updateDraftQuiz.useMutation();
  const getValuesRef = useRef<null | UseFormGetValues<savedDraftQuizValues>>(
    null
  );
  useEffect(() => {
    function saveDraft() {
      if (isLoading || isSuccess) {
        return;
      }
      if (getValuesRef.current && document.visibilityState === "hidden") {
        const values = getValuesRef.current();
        if (!deepEqual(values, defaultQuizValues)) {
          mutate(values);
          setTimeout(() => {
            console.log("saved");
          }, 1000);
        }
      }
    }

    document.addEventListener("visibilitychange", saveDraft);
    return () => {
      document.removeEventListener("visibilitychange", saveDraft);
    };
  }, [isLoading, isSuccess, mutate]);

  function setValues(getValues: UseFormGetValues<savedDraftQuizValues>) {
    getValuesRef.current = getValues;
  }
  useInitDraft(getValuesRef, alreadySaved);
  return setValues;
}
