import { z } from "zod";

export const quizSchema = z.object({
  quiz: z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
  questions: z.array(
    z
      .object({
        question: z.string(),
        ytLink: z.string().optional(),
        image: z.string().optional(),
        answers: z
          .array(
            z
              .object({
                text: z.string(),
                isCorrect: z.boolean(),
                image: z.string(),
              })
              .partial()
              .refine(
                ({ text, image }) => {
                  text !== "" || image !== "";
                },
                { message: "Answer must have text or image" }
              )
          )

          .min(4)
          .max(4),
      })
      .refine(
        ({ ytLink, image }) => {
          ytLink !== "" && image !== "";
        },
        { message: "Question must have either a youtube link or an image" }
      )
  ),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
