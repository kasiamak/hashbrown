import { env } from "~/env.mjs";
import { getOrCreateStripeCustomerIdForUser } from "~/server/stripe/stripe-webhook-handlers";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getAuth } from "@clerk/nextjs/server";
export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, userId, prisma, req } = ctx;
    const user = getAuth(ctx.req);
    user.user?.firstName;
    user.user?.primaryEmailAddressId?.toString();

    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma,
      stripe,
      userId,
      name: user.user?.firstName ?? "",
      email: user.user?.primaryEmailAddressId?.toString() ?? "",
    });

    if (!customerId) {
      throw new Error("Could not create customer");
    }

    const baseUrl =
      env.NODE_ENV === "development"
        ? `http://${req.headers.host ?? "localhost:3000"}`
        : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: userId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/?checkoutSuccess=true`,
      cancel_url: `${baseUrl}/?checkoutCanceled=true`,
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    if (!checkoutSession) {
      throw new Error("Could not create checkout session");
    }

    return { checkoutUrl: checkoutSession.url };
  }),
  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, userId, prisma, req } = ctx;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma,
      stripe,
      userId,
    });

    if (!customerId) {
      throw new Error("Could not create customer");
    }

    const baseUrl =
      env.NODE_ENV === "development"
        ? `http://${req.headers.host ?? "localhost:3000"}`
        : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;

    const stripeBillingPortalSession =
      await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/dashboard`,
      });

    if (!stripeBillingPortalSession) {
      throw new Error("Could not create billing portal session");
    }

    return { billingPortalUrl: stripeBillingPortalSession.url };
  }),
});
