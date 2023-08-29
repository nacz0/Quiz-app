import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { quizSchema } from "~/types&schemas/quizSchema";

export const quizRouter = createTRPCRouter({
  createQuiz: protectedProcedure
    .input(quizSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const quiz = await ctx.prisma.quiz.create({
        data: {
          title: input.quiz.title,
          description: input.quiz.description,
          image: input.quiz.image,
          userId: userId,
        },
      });
      /*const questions = input.questions.map(
        async (question) =>
          await ctx.prisma.question.create({
            data: {
              title: question.question,
              quizId: quiz.id,
            },
          })
      );*/
      await ctx.prisma.question.createMany({
        data: input.questions.map((question) => ({
          text: question.text,
          ytLink: question.ytLink,
          image: question.image,
          quizId: quiz.id,
        })),
      });
      const questions = await ctx.prisma.question.findMany({
        where: {
          quizId: quiz.id,
        },
      });

      input.questions.map((question, index) =>
        question.answers.map(async (answer) => {
          if (questions[index]) {
            await ctx.prisma.answer.create({
              data: {
                text: answer.text ?? "ddd",
                isCorrect: answer.isCorrect ?? false,
                // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
                questionId: questions[index]?.id as string,
              },
            });
          }
        })
      );
    }),
  getQuizById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const quiz = await ctx.prisma.quiz.findFirst({
        where: {
          id: input,
        },
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
        },
      });
      if (!quiz) {
        throw new Error("Quiz not found");
      }
      return quiz;
    }),
});
