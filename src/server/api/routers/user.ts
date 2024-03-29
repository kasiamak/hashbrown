import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  subscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const { auth, prisma } = ctx;

    const data = await prisma.stripeSubscription.findFirst({
      where: {
        userId: auth.userId,
      },
      select: {
        status: true,
      },
    });

    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No valid subscription found",
      });
    }

    return data.status;
  }),
});
