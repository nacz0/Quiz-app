import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { quizSchema } from "~/types&schemas/quizSchema";

export const quizRouter = createTRPCRouter({
  createQuiz: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, { message: "Title is required" }),
        description: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      await ctx.prisma.quiz.create({
        data: {
          title: input.title,
          description: input.description,
          image: input.image,
          userId: userId,
        },
      });
    }),
});
