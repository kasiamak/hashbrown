import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const hashtagGroups = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hashtagGroup.findMany();
  }),

  createHashtagGroup: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input: { name } }) => {
      await ctx.prisma.hashtagGroup.create({
        data: { name },
      });
    }),

  deleteHashtagGroup: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.prisma.hashtagGroup.delete({
        where: { id },
      });
    }),

  addHashtagToHashtagGroup: protectedProcedure
    .input(z.object({ hashtagGroupId: z.string(), hashtag: z.string() }))
    .mutation(async ({ ctx, input: { hashtagGroupId, hashtag } }) => {
      const existingHashtag = await ctx.prisma.hashtag.findUnique({
        where: { name: hashtag },
      });

      let hashtagId: string;

      // If the hashtag already exists, use its id
      if (existingHashtag) {
        hashtagId = existingHashtag.id;
      }
      // Otherwise, create it and use the new id
      else {
        const { id } = await ctx.prisma.hashtag.create({
          data: { name: hashtag },
        });
        hashtagId = id;
      }

      // Add the hashtag to the hashtag group
      await ctx.prisma.hashtagGroup.update({
        where: { id: hashtagGroupId },
        data: {
          hashtags: {
            connect: {
              hashtagId_hashtagGroupId: {
                hashtagGroupId: hashtagGroupId,
                hashtagId: hashtagId,
              },
            },
          },
        },
      });
    }),

  removeHashtagFromHashtagGroup: protectedProcedure
    .input(z.object({ hashtagGroupId: z.string(), hashtag: z.string() }))
    .mutation(async ({ ctx, input: { hashtagGroupId, hashtag } }) => {
      const foundHashtag = await ctx.prisma.hashtag.findUnique({
        where: { name: hashtag },
      });

      if (!foundHashtag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "An unexpected error occurred, please try again later.",
        });
      }

      // disconnect the hashtag from the hashtag group
      await ctx.prisma.hashtagGroup.update({
        where: { id: hashtagGroupId },
        data: {
          hashtags: {
            disconnect: {
              hashtagId_hashtagGroupId: {
                hashtagGroupId: hashtagGroupId,
                hashtagId: foundHashtag.id,
              },
            },
          },
        },
      });
    }),
});
