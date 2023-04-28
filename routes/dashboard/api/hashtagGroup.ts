import type { Handlers } from "$fresh/server.ts";
import { AuthError } from "@supabase/supabase-js";
import type { DashboardState } from "@/routes/dashboard/_middleware.ts";
import {
  addHashtagToGroup,
  removeHashtagFromGroup,
} from "../../../utils/hashtagGroups.ts";

export const handler: Handlers<null, DashboardState> = {
  async POST(request, ctx) {
    try {
      const { hashtagGroupId, hashtag } = await request.json();
      await addHashtagToGroup(
        ctx.state.supabaseClient,
        hashtagGroupId,
        hashtag
      );

      return Response.json(null, { status: 201 });
    } catch (error) {
      console.error(error);
      const status = error instanceof AuthError ? 401 : 400;

      return new Response(error.message, { status });
    }
  },
  // TODO: implement
  async DELETE(request, ctx) {
    try {
      const { hashtagGroupId, hashtag } = await request.json();
      await removeHashtagFromGroup(
        ctx.state.supabaseClient,
        hashtagGroupId,
        hashtag
      );

      return new Response(null, { status: 202 });
    } catch (error) {
      const status = error instanceof AuthError ? 401 : 400;

      return new Response(error, { status });
    }
  },
};
