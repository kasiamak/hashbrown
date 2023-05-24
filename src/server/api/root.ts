import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { hashtagsRouter } from "./routers/hashtags";
import { gptRouter } from "./routers/gpt";
import { stripeRouter } from "./routers/stripe";
import { userRouter } from "./routers/user";
import { hashtagSearchesRouter } from "./routers/hashtagSearches";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  hashtags: hashtagsRouter,
  gpt: gptRouter,
  stripe: stripeRouter,
  user: userRouter,
  hashtagSearches: hashtagSearchesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
