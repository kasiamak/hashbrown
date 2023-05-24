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
      where: {
        userId: {
          equals: ctx.session?.user.id,
        },
      },
    });
  }),
});
