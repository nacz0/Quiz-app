import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { ctx } from "~/types&schemas/ctx";

async function getQuiz(ctx: ctx, isDraft: boolean) {
  const quizzes = await ctx.prisma.quiz.findMany({
    where: {
      userId: ctx.session.user.id,
      IsDraft: isDraft,
    },
    select: {
      _count: {
        select: {
          questions: true,
        },
      },
      id: true,
      title: true,
      description: true,
      image: true,
    },
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });
  return quizzes;
}

export const searchRouter = createTRPCRouter({
  getUserQuizzes: protectedProcedure.query(async ({ ctx }) => {
    const quizzes = await getQuiz(ctx, false);
    return quizzes;
  }),
  getUserDrafts: protectedProcedure.query(async ({ ctx }) => {
    const quizzes = await getQuiz(ctx, true);
    return quizzes;
  }),
  getRecentQuizzes: publicProcedure.query(async ({ ctx }) => {
    const quizzes = await ctx.prisma.quiz.findMany({
      where: {
        IsDraft: false,
      },
      select: {
        _count: {
          select: {
            questions: true,
          },
        },
        id: true,
        title: true,
        description: true,
        image: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
    });
    return quizzes;
  }),
  getQuizById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input: { id } }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          id,
          IsDraft: false,
        },
        select: {
          _count: {
            select: {
              questions: true,
            },
          },
          id: true,
          title: true,
          description: true,
          image: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      return quiz;
    }),
});
