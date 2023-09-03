import { z } from "zod";

const questionSchema = z
  .object({
    text: z.string(),
    ytLink: z.string().optional(),
    image: z.string().optional(),
    answerTime: z.number(),
    type: z.enum(["answers", "true_false", "input", "slider"]),
    id: z.string().optional(),
    answers: z
      .array(
        z
          .object({
            text: z.string().optional(),
            isCorrect: z.boolean().optional(),
            image: z.string().optional(),
            id: z.string().optional(),
          })
          .superRefine(({ text, image }, ctx) => {
            if (
              text !== undefined &&
              text !== "" &&
              image !== undefined &&
              image !== ""
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Answer must not have an image and text",
                path: ["text", "image"],
              });
            }
            if (
              (text === undefined || text === "") &&
              (image === undefined || image === "")
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Answer must have an image or some text",
                path: ["text", "image"],
              });
            }
          })
      )
      .min(4)
      .max(4)
      .superRefine((answers, ctx) => {
        if (answers.find((answer) => answer.isCorrect) === undefined) {
          console.log("must have correct answer");
          console.log("no correct answer");
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Question must have a correct answer",
            path: ["answers"],
          });
        }
      }),
  })
  .superRefine(({ image, ytLink }, ctx) => {
    if (
      image !== undefined &&
      image !== "" &&
      ytLink !== undefined &&
      ytLink !== ""
    ) {
      console.log("must not have image and yt link");
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Question must not have an image and a yt link",
        path: ["image", "ytLink"],
      });
    }
  });

export const quizSchema = z.object({
  quiz: z.object({
    title: z.string().min(1, { message: "Title is required" }).max(250),
    description: z.string().optional(),
    image: z.string().optional(),
    id: z.string(),
  }),
  questions: z.array(questionSchema),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
