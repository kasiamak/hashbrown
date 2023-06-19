import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

export default function Profile() {
  const { data } = api.stripe.createCheckoutSession.useQuery();
  const { push } = useRouter();
  useEffect(() => {
    if (!data?.checkoutUrl) return;
    void push(data?.checkoutUrl);
  }, [data?.checkoutUrl, push]);

  return <div></div>;
}
