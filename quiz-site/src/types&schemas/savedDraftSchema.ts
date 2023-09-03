import { z } from "zod";

const savedDraftQuestionSchema = z.object({
  text: z.string().optional(),
  ytLink: z.string().optional(),
  image: z.string().optional(),
  answerTime: z.number().optional(),
  id: z.string().optional(),
  type: z.enum(["answers", "true_false", "input", "slider"]).optional(),
  answers: z
    .array(
      z.object({
        text: z.string().optional(),
        isCorrect: z.boolean().optional(),
        image: z.string().optional(),
        id: z.string().optional(),
      })
    )
    .min(4)
    .max(4),
});

export const savedDraftQuizSchema = z.object({
  quiz: z.object({
    title: z.string().max(250).optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    id: z.string(),
  }),
  questions: z.array(savedDraftQuestionSchema),
});
export type savedDraftQuizValues = z.infer<typeof savedDraftQuizSchema>;
