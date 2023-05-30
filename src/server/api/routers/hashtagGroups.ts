import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const hashtagGroupsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hashtagGroup.findMany({
      select: {
        name: true,
        id: true,
        hashtags: {
          select: {
            hashtag: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        userId: {
          equals: ctx.session?.user.id,
        },
      },
    });
  }),

  createHashtagGroup: protectedProcedure
    .input(z.object({ name: z.string(), hashtags: z.array(z.string()) }))
    .mutation(async ({ ctx, input: { name, hashtags } }) => {
      await ctx.prisma.hashtagGroup.create({
        data: {
          name,
          hashtags: {
            createMany: {
              data: hashtags.map((hashtag) => ({
                hashtagId: hashtag,
              })),
            },
          },
          user: {
            connect: {
              id: ctx.session?.user.id,
            },
          },
        },
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

  updateHashtagGroupName: protectedProcedure
    .input(z.object({ hashtagGroupId: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input: { hashtagGroupId, name } }) => {
      // disconnect the hashtag from the hashtag group
      await ctx.prisma.hashtagGroup.update({
        data: { name },
        where: {
          id: hashtagGroupId,
        },
      });
    }),

  removeHashtagFromHashtagGroup: protectedProcedure
    .input(z.object({ hashtagGroupId: z.string(), hashtagId: z.string() }))
    .mutation(async ({ ctx, input: { hashtagGroupId, hashtagId } }) => {
      // disconnect the hashtag from the hashtag group
      await ctx.prisma.hashtagOnHashtagGroups.delete({
        where: {
          hashtagId_hashtagGroupId: {
            hashtagGroupId,
            hashtagId,
          },
        },
      });
    }),
});
