import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const searchRouter = createTRPCRouter({
  getUserQuizzes: protectedProcedure.query(async ({ ctx }) => {
    const quizzes = await ctx.prisma.quiz.findMany({
      where: {
        userId: ctx.session.user.id,
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
  }),
});
