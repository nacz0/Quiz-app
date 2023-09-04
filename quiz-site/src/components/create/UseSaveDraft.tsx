import { useEffect } from "react";
import { api } from "~/utils/api";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useInitDraft } from "./useInitDraft";
import {
  type savedDraftQuizValues,
  savedDraftQuizSchema,
} from "~/types&schemas/savedDraftSchema";
import debounce from "debounce";

export function UseSaveDraft(
  isLoading: boolean,
  isSuccess: boolean,
  alreadySaved: boolean,
  watch: UseFormWatch<savedDraftQuizValues>,
  setValue: UseFormSetValue<savedDraftQuizValues>
) {
  const { mutate } = api.quiz.updateDraftQuiz.useMutation();
  useEffect(() => {
    if (isLoading || isSuccess) return;
    const debounced = debounce((formValue: unknown) => {
      const parsed = savedDraftQuizSchema.parse(formValue);
      console.log(parsed);
      mutate(parsed);
    }, 5000);
    const subscription = watch(debounced);
    return () => subscription.unsubscribe();
  }, [alreadySaved, isLoading, isSuccess, mutate, watch]);

  useInitDraft(watch(), alreadySaved, setValue);
}
