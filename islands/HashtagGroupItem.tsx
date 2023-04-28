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

async function requestCreateHashtagGroup({
  hashtag,
  hashtagGroupId,
}: {
  hashtag: string;
  hashtagGroupId: string;
}) {
  const response = await fetch("/dashboard/api/hashtagGroup", {
    method: "POST",
    body: JSON.stringify({ hashtag, hashtagGroupId }),
  });
  assert(response.ok);
}

function createHashtagInSignal(hashtags: Signal<string[]>, hashtag: string) {
  hashtags.value = [...hashtags.value, hashtag];
}

async function createHashtag(
  hashtags: Signal<string[]>,
  name: string,
  hashtagGroupId: string
) {
  const newHashtag = name.toLowerCase();
  if (IS_BROWSER)
    await requestCreateHashtagGroup({ hashtag: newHashtag, hashtagGroupId });
  createHashtagInSignal(hashtags, newHashtag);
}

async function requestDeleteHashtag({
  hashtag,
  hashtagGroupId,
}: {
  hashtag: string;
  hashtagGroupId: string;
}) {
  const response = await fetch("/dashboard/api/hashtagGroup", {
    method: "DELETE",
    body: JSON.stringify({ hashtag, hashtagGroupId }),
  });
  assert(response.ok);
}

function deleteHashtagInSignal(hashtags: Signal<string[]>, hashtag: string) {
  hashtags.value = hashtags.value.filter((h) => h !== hashtag);
}

async function deleteHashtag(
  hashtags: Signal<string[]>,
  name: string,
  hashtagGroupId: string
) {
  if (IS_BROWSER) await requestDeleteHashtag({ hashtag: name, hashtagGroupId });
  deleteHashtagInSignal(hashtags, name);
}

interface HashtagGroupProps {
  isSubscribed: boolean;
  hashtagGroup: HashtagGroup;
}

export default function HashtagGroupItem(props: HashtagGroupProps) {
  const hashtags = useSignal(props.hashtagGroup.hashtags ?? []);
  const newHashtagRef = useRef<HTMLInputElement | null>(null);

  const isMoreHashtags =
    props.isSubscribed || hashtags.value.length < FREE_PLAN_TODOS_LIMIT;

  return (
    <div class="space-y-4">
      <h2 class="text-2xl font-bold">{props.hashtagGroup.name}</h2>
      <ul class="divide-y space-y-2">
        {hashtags.value.map((hashtag) => (
          <li class="flex items-center justify-between gap-2 p-2">
            <div class="flex">{hashtag}</div>
            <IconTrash
              onClick={async () =>
                await deleteHashtag(hashtags, hashtag, props.hashtagGroup.id!)
              }
              class="cursor-pointer text-red-600"
            />
          </li>
        ))}
      </ul>
      <form
        class="flex gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          await createHashtag(
            hashtags,
            newHashtagRef.current!.value,
            props.hashtagGroup.id!
          );
          newHashtagRef.current!.form!.reset();
        }}
      >
        <input
          title="Must be valid hashtag"
          pattern="#[\p{L}\p{Mn}\p{Pc}0-9_]+"
          required
          placeholder="enter a new #hashtag"
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
