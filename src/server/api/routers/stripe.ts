import { env } from "~/env.mjs";
import { getOrCreateStripeCustomerIdForUser } from "~/server/stripe/stripe-webhook-handlers";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getAuth } from "@clerk/nextjs/server";
export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.query(async ({ ctx }) => {
    const { stripe, prisma, req, auth } = ctx;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma,
      stripe,
      userId: auth.userId,
      name: auth.user?.firstName ?? "",
      email: auth.user?.primaryEmailAddressId?.toString() ?? "",
    });

    if (!customerId) {
      throw new Error("Could not create customer");
    }

    const baseUrl =
      env.NODE_ENV === "development"
        ? `http://${req.headers.host ?? "localhost:3000"}`
        : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      customer: customerId,
      client_reference_id: auth.userId ?? "",
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard/?checkoutSuccess=true`,
      cancel_url: `${baseUrl}/?checkoutCanceled=true`,
      subscription_data: {
        // trial_from_plan: true,
        trial_period_days: 7,
        metadata: {
          userId: auth.userId ?? "",
        },
      },
    });

    if (!checkoutSession) {
      throw new Error("Could not create checkout session");
    }

    return { checkoutUrl: checkoutSession.url };
  }),
  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, prisma, req, auth } = ctx;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma,
      stripe,
      userId: auth.userId ?? "",
      name: auth.user?.firstName ?? "",
      email: auth.user?.primaryEmailAddressId?.toString() ?? "",
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
