import { z } from "zod";

const draftQuestionSchema = z.object({
  text: z.string().nullish(),
  ytLink: z.string().nullish(),
  image: z.string().nullish(),
  answerTime: z.number().optional(),
  type: z.enum(["answers", "true_false", "input", "slider"]).nullish(),
  answers: z
    .array(
      z.object({
        text: z.string().nullish(),
        isCorrect: z.boolean().nullish(),
        image: z.string().nullish(),
      })
    )
    .min(4)
    .max(4),
});

export const draftQuizSchema = z.object({
  quiz: z.object({
    title: z.string().max(250).nullish(),
    description: z.string().nullish(),
    image: z.string().nullish(),
    id: z.string(),
  }),
  questions: z.array(draftQuestionSchema),
});
export type DraftQuizValues = z.infer<typeof draftQuizSchema>;
