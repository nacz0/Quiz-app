import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
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
  const questions = await Promise.all(
    input.questions.map(async (question, i) => {
      const q = await ctx.prisma.question.upsert({
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
          answerTime: Number(question.answerTime),
          type: "answers",
        },
        create: {
          text: question.text,
          ytLink: question.ytLink,
          image: question.image,
          answerTime: Number(question.answerTime),
          type: "answers",
          quizId: input.quiz.id,
          index: i,
        },
      });
      return q;
    })
  );

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

      const questions = await Promise.all(
        input.questions.map(async (question, i) => {
          const q = await ctx.prisma.question.upsert({
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
              answerTime: Number(question.answerTime),
              type: "answers",
            },
            create: {
              text: question.text,
              ytLink: question.ytLink,
              image: question.image,
              answerTime: Number(question.answerTime),
              type: "answers",
              quizId: input.quiz.id,
              index: i,
            },
          });
          return q;
        })
      );

      console.log("QUESTIONS");
      console.log(questions);
      input.questions.map((question, index) => {
        console.log("QuestionnnnnnnnnnNNNNNNNNNNN");
        console.log(question);
        console.log(index);
        question.answers.map(async (answer, i) => {
          if (questions[index]) {
            console.log("ANSWERRRRRRRRRRRR");
            console.log(answer);
            console.log(questions[index]!.id);
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
        });
      });
      return input.quiz.id;
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
          answerTime: Number(question.answerTime),
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
                text: answer.text,
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
  getDraftQuizById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const quiz = await ctx.prisma.quiz.findFirst({
        where: {
          id: input,
          IsDraft: true,
        },
        select: {
          image: true,
          title: true,
          description: true,
          id: true,
        },
      });
      if (!quiz) {
        throw new Error("Draft not found");
      }
      const questions = await ctx.prisma.question.findMany({
        where: {
          quizId: input,
        },
        select: {
          text: true,
          ytLink: true,
          image: true,
          answerTime: true,
          type: true,
          answers: {
            select: {
              text: true,
              image: true,
              isCorrect: true,
            },
          },
        },
      });
      const questionsWithStringNums = questions.map((question) => ({
        ...question,
        answerTime: question.answerTime.toString(),
      }));
      return { quiz, questions: questionsWithStringNums };
    }),
});
