import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Button } from "./Button";
import { IconCreditCard } from "@tabler/icons-react";

export const UpgradeButton = () => {
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();
  const { push } = useRouter();
  return (
    <Button
      icon={<IconCreditCard />}
      onClick={async () => {
        const { checkoutUrl } = await createCheckoutSession();
        if (checkoutUrl) {
          void push(checkoutUrl);
        }
      }}
    >
      Upgrade account
    </Button>
  );
};
