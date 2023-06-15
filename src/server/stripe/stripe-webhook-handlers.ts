import type { PrismaClient } from "@prisma/client";
import type Stripe from "stripe";

// retrieves a Stripe customer id for a given user if it exists or creates a new one
export const getOrCreateStripeCustomerIdForUser = async ({
  stripe,
  prisma,
  userId,
  email,
  name,
}: {
  stripe: Stripe;
  prisma: PrismaClient;
  userId: string;
  email: string;
  name: string;
}) => {
  const stripeSubscription = await prisma.stripeSubscription.findFirst({
    where: {
      userId: userId,
    },
    select: {
      stripeCustomerId: true,
    },
  });

  if (stripeSubscription?.stripeCustomerId) {
    return stripeSubscription.stripeCustomerId;
  }

  // create a new subscription
  const customer = await stripe.customers.create({
    email,
    name,
    // use metadata to link this Stripe customer to internal user id
    metadata: {
      userId,
    },
  });

  // update with new customer id
  const updatedSubscription = await prisma.stripeSubscription.create({
    data: {
      status: "incomplete",
      userId,
      stripeCustomerId: customer.id,
    },
    select: {
      stripeCustomerId: true,
    },
  });

  if (updatedSubscription.stripeCustomerId) {
    return updatedSubscription.stripeCustomerId;
  }
};

export const handleInvoicePaid = async ({
  event,
  stripe,
  prisma,
}: {
  event: Stripe.Event;
  stripe: Stripe;
  prisma: PrismaClient;
}) => {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription;
  const subscription = await stripe.subscriptions.retrieve(
    subscriptionId as string
  );
  const userId = subscription.metadata.userId;

  // update user with subscription data
  await prisma.stripeSubscription.update({
    where: {
      userId: userId,
    },
    data: {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
    },
  });
};

export const handleSubscriptionCreatedOrUpdated = async ({
  event,
  prisma,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;

  // update user with subscription data
  await prisma.stripeSubscription.update({
    where: {
		userId: userId,
    },
    data: {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
    },
  });
};

export const handleSubscriptionCanceled = async ({
  event,
  prisma,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;

  // remove subscription data from user
  await prisma.stripeSubscription.update({
    where: {
      userId: userId,
    },
    data: {
      stripeSubscriptionId: null,
      status: 'canceled',
    },
  });
};
