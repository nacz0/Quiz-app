import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
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
          questions: {
            select: {
              id: true,
              text: true,
              answers: {
                select: {
                  id: true,
                  text: true,
                  isCorrect: true,
                },
              },
            },
          },
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
      if (!quiz) {
        throw new Error("Quiz not found");
      }
      return quiz;
    }),
});
