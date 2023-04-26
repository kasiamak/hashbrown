// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase_types.ts";

const TABLE_NAME = "hashtags";

export type Hashtag = Database["public"]["Tables"]["hashtags"]["Insert"];

export async function getHashtags(client: SupabaseClient<Database>) {
  const { data } = await client
    .from(TABLE_NAME)
    .select("id, name")
    .throwOnError();
  return data!;
}

export async function createHashtag(
  client: SupabaseClient<Database>,
  hashtag: Hashtag
) {
  const { error } = await client.from(TABLE_NAME).insert(hashtag);

  if (error) {
    // for error `uplicate key value violates unique constraint "hashtags_name_key"`
    // we want to ignore as its a valid error
    if (error?.code == "23505") return;
    throw error;
  }
}

export async function createManyHashtag(
  client: SupabaseClient<Database>,
  hashtag: Hashtag[]
) {
  const { error } = await client.from(TABLE_NAME).insert(hashtag);

  if (error) {
    // for error `uplicate key value violates unique constraint "hashtags_name_key"`
    // we want to ignore as its a valid error
    if (error?.code == "23505") return;
    throw error;
  }
}

export async function deleteHashtag(
  client: SupabaseClient<Database>,
  id: Hashtag["id"]
) {
  await client.from(TABLE_NAME).delete().eq("id", id).throwOnError();
}
