import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const hashtagSearchesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.hashtagSearch.findMany({
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
        hidden: false,
        userId: {
          equals: ctx.auth.userId,
        },
      },
    });
  }),
  hide: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        hidden: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input: { id, hidden } }) => {
      await ctx.prisma.hashtagSearch.update({
        where: {
          id,
        },
        data: { hidden },
      });
    }),
  hideAll: protectedProcedure
    .input(
      z.object({
        ids: z.string().array(),
        hidden: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input: { ids, hidden } }) => {
      await ctx.prisma.hashtagSearch.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: { hidden },
      });
    }),
});
