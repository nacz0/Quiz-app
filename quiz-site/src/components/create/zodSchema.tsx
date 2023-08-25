import { z } from "zod";

export const quizSchema = z.object({
  quiz: z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    image: z.string().optional(),
  }),
  questions: z.array(
    z.object({
      question: z.string().min(1, { message: "Question is required" }),
      answers: z
        .array(
          z.object({
            text: z.string().min(1, { message: "Answer is required" }),
            correct: z.boolean().nullish(),
            image: z.string().optional(),
          })
        )
        .min(4)
        .max(4),
    })
  ),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
