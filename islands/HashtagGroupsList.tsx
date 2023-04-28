import { type Signal, useSignal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import IconHash from "tabler-icons/hash.tsx";
import {
  BASE_BUTTON_STYLES,
  BASE_INPUT_STYLES,
  FREE_PLAN_TODOS_LIMIT,
} from "@/utils/constants.ts";
import IconTrash from "tabler-icons/trash.tsx";
import { assert } from "std/testing/asserts.ts";
import { useRef } from "preact/hooks";
import { HashtagGroup } from "../utils/hashtagGroups.ts";

async function requestCreateHashtagGroup(hashtag: HashtagGroup) {
  const response = await fetch("/dashboard/api/hashtagGroups", {
    method: "POST",
    body: JSON.stringify(hashtag),
  });
  assert(response.ok);
}

function createHashtagInSignal(
  hashtags: Signal<HashtagGroup[]>,
  hashtag: HashtagGroup
) {
  hashtags.value = [...hashtags.value, hashtag];
}

async function createHashtag(hashtags: Signal<HashtagGroup[]>, name: string) {
  const newHashtag: HashtagGroup = {
    name: name.toLowerCase(),
    id: crypto.randomUUID(),
  };
  if (IS_BROWSER) await requestCreateHashtagGroup(newHashtag);
  createHashtagInSignal(hashtags, newHashtag);
}

async function requestDeleteHashtag(id: string) {
  const response = await fetch("/dashboard/api/hashtagGroups", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
  assert(response.ok);
}

function deleteHashtagInSignal(hashtags: Signal<HashtagGroup[]>, id: string) {
  hashtags.value = hashtags.value.filter((hashtag) => hashtag.id !== id);
}

async function deleteHashtag(hashtags: Signal<HashtagGroup[]>, id: string) {
  if (IS_BROWSER) await requestDeleteHashtag(id);
  deleteHashtagInSignal(hashtags, id);
}

interface HashtagGroupsListProps {
  isSubscribed: boolean;
  hashtagGroups: HashtagGroup[];
}

export default function HashtagGroupsList(props: HashtagGroupsListProps) {
  const hashtags = useSignal(props.hashtagGroups);
  const newHashtagRef = useRef<HTMLInputElement | null>(null);

  const isMoreHashtags =
    props.isSubscribed || hashtags.value.length < FREE_PLAN_TODOS_LIMIT;

  return (
    <div class="space-y-4">
      <ul class="divide-y space-y-2">
        {hashtags.value.map((hashtag) => (
          <li class="flex items-center justify-between gap-2 p-2">
            <a
              class={`px-4 py-2 rounded w-full block  hover:bg-gray-100`}
              href={`./hashtagGroups/${hashtag.id}`}
            >
              <div class="flex">{hashtag.name}</div>
            </a>
            <IconTrash
              onClick={async () => await deleteHashtag(hashtags, hashtag.id!)}
              class="cursor-pointer text-red-600"
            />
          </li>
        ))}
      </ul>
      <form
        class="flex gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          await createHashtag(hashtags, newHashtagRef.current!.value);
          newHashtagRef.current!.form!.reset();
        }}
      >
        <input
          required
          placeholder="enter a new hashtag group name"
          ref={newHashtagRef}
          disabled={!isMoreHashtags}
          class={`${BASE_INPUT_STYLES} flex-1`}
        />
        <button
          disabled={!isMoreHashtags}
          type="submit"
          class={`${BASE_BUTTON_STYLES} px-4`}
        >
          +
        </button>
      </form>
    </div>
  );
}
