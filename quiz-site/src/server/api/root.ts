import { quizRouter } from "~/server/api/routers/quiz";
import { createTRPCRouter } from "~/server/api/trpc";
import { gameRouter } from "./routers/game";
import { searchRouter } from "./routers/search";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  quiz: quizRouter,
  search: searchRouter,
  game: gameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
