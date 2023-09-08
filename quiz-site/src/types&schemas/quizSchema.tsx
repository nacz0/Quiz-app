import { z } from "zod";
import { quizMaxLength } from "./quizMaxLength";
const questionSchema = z
  .object({
    text: z
      .string()
      .max(quizMaxLength.question.text)
      .min(1, { message: "Question is required" }),
    ytLink: z.string().optional(),
    image: z.string().nullish(),
    answerTime: z.string().optional(),
    type: z.enum(["answers", "true_false", "input", "slider"]),
    id: z.string().optional(),
    answers: z
      .array(
        z
          .object({
            text: z.string().max(quizMaxLength.answer.text).optional(),
            isCorrect: z.boolean().optional(),
            image: z.string().nullish(),
            id: z.string().optional(),
          })

          .superRefine(({ text, image }, ctx) => {
            if (
              text != undefined &&
              text !== "" &&
              image != undefined &&
              image !== ""
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Answer must not have an image and text",
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
          });
        }
        for (let i = 0; i < 2; i++) {
          if (answers[i]) {
            if (
              (answers[i]!.text === undefined || answers[i]!.text === "") &&
              (answers[i]!.image === undefined || answers[i]!.image === "")
            ) {
              console.log(`${i}'s answer must not be empty`);
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Question must have at least two answers",
                path: [`${i}`],
              });
            }
          } else {
            console.log("must have at least two answers");
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Question must have at least two answers",
              path: ["answers"],
            });
          }
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
    title: z
      .string()
      .min(1, { message: "Title is required" })
      .max(quizMaxLength.quiz.title),
    description: z.string().max(quizMaxLength.quiz.description).optional(),
    image: z.string().optional(),
    id: z.string(),
  }),
  questions: z.array(questionSchema),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
