// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers, PageProps } from "$fresh/server.ts";
import Head from "@/components/Head.tsx";
import HashtagGroupsList from "@/islands/HashtagGroupsList.tsx";
import { DashboardState } from "./_middleware.ts";
import Dashboard from "@/components/Dashboard.tsx";
import { Database } from "@/utils/supabase_types.ts";
import { BASE_NOTICE_STYLES } from "@/utils/constants.ts";
import { getHashtagGroups } from "../../utils/hashtagGroups.ts";

interface HashtagsPageData extends DashboardState {
  hashtags: Database["public"]["Tables"]["hashtag_group"]["Insert"][];
  customer: Database["public"]["Tables"]["customers"]["Row"];
}

export const handler: Handlers<HashtagsPageData, DashboardState> = {
  async GET(_request, ctx) {
    const customer = await ctx.state.createOrGetCustomer();
    const hashtags = await getHashtagGroups(ctx.state.supabaseClient);
    return ctx.render({
      ...ctx.state,
      hashtags,
      customer,
    });
  },
};

export default function HashtagsPage(props: PageProps<HashtagsPageData>) {
  return (
    <>
      <Head title="Hashtag Groups" />
      <Dashboard active="/dashboard/hashtagGroups">
        {!props.data.customer.is_subscribed && (
          <div class={BASE_NOTICE_STYLES}>
            You are on a free subscription. Please{" "}
            <a href="/dashboard/upgrade-subscription" class="underline">
              upgrade
            </a>{" "}
            to enable unlimited hashtags
          </div>
        )}
        <HashtagGroupsList
          isSubscribed={props.data.customer.is_subscribed!}
          hashtagGroups={props.data.hashtags}
        />
      </Dashboard>
    </>
  );
}
