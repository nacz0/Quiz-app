import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { draftQuizSchema } from "~/types&schemas/draftSchema";
import { quizSchema, type QuizFormValues } from "~/types&schemas/quizSchema";
import {
  savedDraftQuizSchema,
  type savedDraftQuizValues,
} from "~/types&schemas/savedDraftSchema";

async function saveQuiz(
  input: savedDraftQuizValues | QuizFormValues,
  ctx: { prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> },
  saveAsDraft: boolean
) {
  await ctx.prisma.quiz.update({
    where: {
      id: input.quiz.id,
    },
    data: {
      title: input.quiz.title,
      description: input.quiz.description,
      image: input.quiz.image,
      IsDraft: saveAsDraft,
    },
  });
  input.questions.map(async (question, i) => {
    await ctx.prisma.question.upsert({
      where: {
        unique_quiz_index: {
          index: i,
          quizId: input.quiz.id,
        },
      },
      update: {
        text: question.text,
        ytLink: question.ytLink,
        image: question.image,
        answerTime: question.answerTime,
        type: "answers",
      },
      create: {
        text: question.text,
        ytLink: question.ytLink,
        image: question.image,
        answerTime: question.answerTime,
        type: "answers",
        quizId: input.quiz.id,
        index: i,
      },
    });
  });

  const questions = await ctx.prisma.question.findMany({
    where: {
      quizId: input.quiz.id,
    },
  });

  input.questions.map((question, index) =>
    question.answers.map(async (answer, i) => {
      if (questions[index]) {
        await ctx.prisma.answer.upsert({
          where: {
            unique_question_index: {
              index: i,
              questionId: questions[index]!.id,
            },
          },
          update: {
            image: answer.image,
            text: answer.text,
            isCorrect: answer.isCorrect ?? false,
          },
          create: {
            text: answer.text,
            image: answer.image,
            isCorrect: answer.isCorrect ?? false,
            questionId: questions[index]!.id,
            index: i,
          },
        });
      }
    })
  );
}

export const quizRouter = createTRPCRouter({
  createQuiz: protectedProcedure
    .input(quizSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.quiz.update({
        where: {
          id: input.quiz.id,
        },
        data: {
          title: input.quiz.title,
          description: input.quiz.description,
          image: input.quiz.image,
          IsDraft: false,
        },
      });
      input.questions.map(async (question, i) => {
        await ctx.prisma.question.upsert({
          where: {
            unique_quiz_index: {
              index: i,
              quizId: input.quiz.id,
            },
          },
          update: {
            text: question.text,
            ytLink: question.ytLink,
            image: question.image,
            answerTime: question.answerTime,
            type: "answers",
          },
          create: {
            text: question.text,
            ytLink: question.ytLink,
            image: question.image,
            answerTime: question.answerTime,
            type: "answers",
            quizId: input.quiz.id,
            index: i,
          },
        });
      });

      const questions = await ctx.prisma.question.findMany({
        where: {
          quizId: input.quiz.id,
        },
      });

      input.questions.map((question, index) =>
        question.answers.map(async (answer, i) => {
          if (questions[index]) {
            await ctx.prisma.answer.upsert({
              where: {
                unique_question_index: {
                  index: i,
                  questionId: questions[index]!.id,
                },
              },
              update: {
                image: answer.image,
                text: answer.text,
                isCorrect: answer.isCorrect ?? false,
              },
              create: {
                text: answer.text,
                image: answer.image,
                isCorrect: answer.isCorrect ?? false,
                questionId: questions[index]!.id,
                index: i,
              },
            });
          }
        })
      );
      return;
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
  createDraftQuiz: protectedProcedure
    .input(draftQuizSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      console.log(input);
      const quiz = await ctx.prisma.quiz.create({
        data: {
          title: input.quiz.title,
          description: input.quiz.description,
          image: input.quiz.image,
          userId: userId,
          IsDraft: true,
        },
      });
      await ctx.prisma.question.createMany({
        data: input.questions.map((question, i) => ({
          text: question.text,
          ytLink: question.ytLink,
          image: question.image,
          quizId: quiz.id,
          answerTime: question.answerTime,
          type: "answers",
          index: i,
        })),
      });
      const questions = await ctx.prisma.question.findMany({
        where: {
          quizId: quiz.id,
        },
      });

      input.questions.map((question, index) =>
        question.answers.map(async (answer, i) => {
          if (questions[index]) {
            await ctx.prisma.answer.create({
              data: {
                text: answer.text ?? "ddd",
                isCorrect: answer.isCorrect ?? false,
                questionId: questions[index]!.id,
                index: i,
              },
            });
          }
        })
      );
      return quiz.id;
    }),
  updateDraftQuiz: protectedProcedure
    .input(savedDraftQuizSchema)
    .mutation(async ({ input, ctx }) => {
      await saveQuiz(input, ctx, true);
      return;
    }),
});
