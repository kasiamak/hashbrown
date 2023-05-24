import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Button } from "./Button";
import { IconCoins } from "@tabler/icons-react";

export const ManageBillingButton = () => {
  const { mutateAsync: createBillingPortalSession } =
    api.stripe.createBillingPortalSession.useMutation();
  const { push } = useRouter();
  return (
    <Button
      icon={<IconCoins />}
      variant="ghost"
      onClick={async () => {
        const { billingPortalUrl } = await createBillingPortalSession();
        if (billingPortalUrl) {
          void push(billingPortalUrl);
        }
      }}
    >
      Manage subscription and billing
    </Button>
  );
};
