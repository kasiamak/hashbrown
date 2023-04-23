// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers, PageProps } from '$fresh/server.ts';
import { getHashtags } from '@/utils/hashtags.ts';
import Head from '@/components/Head.tsx';
import HashtagList from '@/islands/HashtagList.tsx';
import { DashboardState } from './_middleware.ts';
import Dashboard from '@/components/Dashboard.tsx';
import { Database } from '@/utils/supabase_types.ts';
import { BASE_NOTICE_STYLES } from '@/utils/constants.ts';

interface HashtagsPageData extends DashboardState {
    hashtags: Database['public']['Tables']['hashtags']['Insert'][];
    customer: Database['public']['Tables']['customers']['Row'];
}

export const handler: Handlers<HashtagsPageData, DashboardState> = {
    async GET(_request, ctx) {
        const customer = await ctx.state.createOrGetCustomer();
        const hashtags = await getHashtags(ctx.state.supabaseClient);
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
            <Head title='Hashtags' />
            <Dashboard active='/dashboard/hashtags'>
                {!props.data.customer.is_subscribed && (
                    <div class={BASE_NOTICE_STYLES}>
                        You are on a free subscription. Please{' '}
                        <a
                            href='/dashboard/upgrade-subscription'
                            class='underline'
                        >
                            upgrade
                        </a>{' '}
                        to enable unlimited hashtags
                    </div>
                )}
                <HashtagList
                    isSubscribed={props.data.customer.is_subscribed!}
                    hashtags={props.data.hashtags}
                />
            </Dashboard>
        </>
    );
}
