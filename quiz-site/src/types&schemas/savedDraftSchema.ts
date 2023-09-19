import { z } from "zod";

const savedDraftQuestionSchema = z.object({
  text: z.string().nullish(),
  ytLink: z.string().nullish(),
  image: z.string().nullish(),
  answerTime: z.string().optional(),
  id: z.string().nullish(),
  type: z.enum(["answers", "true_false", "input", "slider"]).nullish(),
  answers: z
    .array(
      z.object({
        text: z.string().nullish(),
        isCorrect: z.boolean().nullish(),
        image: z.string().nullish(),
        id: z.string().nullish(),
      })
    )
    .min(4)
    .max(4),
});

export type savedDraftQuestionValues = z.infer<typeof savedDraftQuestionSchema>;

export const savedDraftQuizSchema = z.object({
  quiz: z.object({
    title: z.string().max(250).nullish(),
    description: z.string().nullish(),
    image: z.string().nullish(),
    id: z.string(),
  }),
  questions: z.array(savedDraftQuestionSchema),
});
export type savedDraftQuizValues = z.infer<typeof savedDraftQuizSchema>;
