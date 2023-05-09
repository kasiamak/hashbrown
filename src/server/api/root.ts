import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { hashtagsRouter } from "./routers/hashtags";
import { gptRouter } from "./routers/gpt";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  hashtags: hashtagsRouter,
  gpt: gptRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;