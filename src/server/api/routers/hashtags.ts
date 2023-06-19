import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
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
      try {
        const foundHashtags = (
          await ctx.prisma.hashtag.findMany({
            where: { name: { in: hashtags } },
          })
        ).map((hashtag) => hashtag.name);

        await ctx.prisma.hashtag.createMany({
          skipDuplicates: true,
          // filter out hashtags that already exist
          data: hashtags
            .filter((hashtag) => !foundHashtags.includes(hashtag))
            .map((hashtag) => ({ name: hashtag })),
        });
      } catch (error: unknown) {
        if ((error as PrismaClientKnownRequestError).code === "P2002") {
        } else {
          throw error;
        }
      }
    }),
});
