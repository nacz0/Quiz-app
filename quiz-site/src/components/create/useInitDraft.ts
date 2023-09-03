import deepEqual from "deep-equal";
import { type MutableRefObject, useEffect, useState } from "react";
import type { UseFormGetValues } from "react-hook-form";
import { defaultQuizValues } from "./defaultQuizValues";
import { api } from "~/utils/api";
import { draftQuizSchema } from "~/types&schemas/draftSchema";
import type { savedDraftQuizValues } from "~/types&schemas/savedDraftSchema";

export function useInitDraft(
  getValuesRef: MutableRefObject<null | UseFormGetValues<savedDraftQuizValues>>,
  alreadySaved: boolean
) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { mutate } = api.quiz.createDraftQuiz.useMutation({
    onSuccess: (quizId) => history.pushState({}, "", "/create/" + quizId),
  });
  //we are using ref here, so we can't have it as a dependency, sooo no deps at all, but no infinite loop here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isInitialized && !alreadySaved) {
      console.log("mutate1");
      if (getValuesRef.current) {
        console.log("mutate2");
        const values = getValuesRef.current();
        if (!deepEqual(values, defaultQuizValues)) {
          console.log("mutate3");
          mutate(values);
          setIsInitialized(true);
        }
      }
    }
  });
}
