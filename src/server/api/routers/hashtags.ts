import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const hashtagsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hashtag.findMany();
  }),

  createHashtag: protectedProcedure
    .input(
      z.object({
        hashtag: z
          .string()
          .regex(/^#[\p{L}\p{Mn}\p{Pc}0-9_]+$/u, "Invalid hashtag format"),
      })
    )
    .mutation(async ({ ctx, input: { hashtag } }) => {
      await ctx.prisma.hashtag.create({
        data: { name: hashtag },
      });
    }),

  createHashtags: protectedProcedure
    .input(z.object({ hashtags: z.string().array() }))
    .mutation(async ({ ctx, input: { hashtags } }) => {
      await ctx.prisma.hashtag.createMany({
        data: hashtags.map((hashtag) => ({ name: hashtag })),
      });
    }),
});
