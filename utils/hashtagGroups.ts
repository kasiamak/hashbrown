// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase_types.ts";

const TABLE_NAME = "hashtag_group";

export type HashtagGroup =
  Database["public"]["Tables"]["hashtag_group"]["Insert"];

export async function getHashtagGroups(client: SupabaseClient<Database>) {
  const { data } = await client
    .from(TABLE_NAME)
    .select("id, name")
    .throwOnError();
  return data!;
}

export async function getHashtagGroup(
  client: SupabaseClient<Database>,
  hashtagGroupId: HashtagGroup["id"]
) {
  const { data } = await client
    .from(TABLE_NAME)
    .select("id, name, hashtags")
    .eq("id", hashtagGroupId)
    .throwOnError();
  return data?.[0]!;
}

export async function createHashtagGroup(
  client: SupabaseClient<Database>,
  hashtag: HashtagGroup
) {
  const { error } = await client.from(TABLE_NAME).insert(hashtag);

  if (error) {
    // for error `uplicate key value violates unique constraint "hashtags_name_key"`
    // we want to ignore as its a valid error
    if (error?.code == "23505") return;
    throw error;
  }
}

export async function addHashtagToGroup(
  client: SupabaseClient<Database>,
  hashtagGroupId: HashtagGroup["id"],
  hashtag: string
) {
  const { hashtags } = (
    await client.from(TABLE_NAME).select("hashtags").eq("id", hashtagGroupId)
  ).data?.[0]!;

  const { error } = await client
    .from(TABLE_NAME)
    .upsert({ id: hashtagGroupId, hashtags: [...(hashtags ?? []), hashtag] });

  if (error) {
    // for error `uplicate key value violates unique constraint "hashtags_name_key"`
    // we want to ignore as its a valid error
    if (error?.code == "23505") return;
    throw error;
  }
}

export async function removeHashtagFromGroup(
  client: SupabaseClient<Database>,
  hashtagGroupId: HashtagGroup["id"],
  hashtag: string
) {
  const { hashtags } = (
    await client.from(TABLE_NAME).select("hashtags").eq("id", hashtagGroupId)
  ).data?.[0]!;

  const { error } = await client.from(TABLE_NAME).upsert({
    id: hashtagGroupId,
    hashtags: hashtags?.filter((h) => h !== hashtag),
  });

  if (error) {
    // for error `uplicate key value violates unique constraint "hashtags_name_key"`
    // we want to ignore as its a valid error
    if (error?.code == "23505") return;
    throw error;
  }
}

export async function deleteHashtagGroup(
  client: SupabaseClient<Database>,
  id: HashtagGroup["id"]
) {
  await client.from(TABLE_NAME).delete().eq("id", id).throwOnError();
}
