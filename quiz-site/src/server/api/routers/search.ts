import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
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
});
