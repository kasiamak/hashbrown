import { type Signal, useSignal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { Hashtag } from "@/utils/hashtags.ts";
import { FREE_PLAN_TODOS_LIMIT } from "@/utils/constants.ts";
import { assert } from "std/testing/asserts.ts";
import { useRef } from "preact/hooks";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";
import IconPlus from "tabler-icons/plus.tsx";

async function requestSearchHashtag(term: string) {
  const response = await fetch("/dashboard/api/generate", {
    method: "POST",
    body: JSON.stringify({ term }),
  });
  return response.json();
}

function createHashtagInSignal(hashtags: Signal<string[]>, hashtag: string[]) {
  hashtags.value = [...hashtags.value, ...hashtag];
}

async function searchHashtag(hashtags: Signal<string[]>, term: string) {
  if (IS_BROWSER) {
    const data: { hashtag: string; rank: number }[] =
      await requestSearchHashtag(term);
    createHashtagInSignal(
      hashtags,
      data.map(({ hashtag }) => hashtag)
    );
  }
}

async function requestDeleteHashtag(id: string) {
  const response = await fetch("/dashboard/api/hashtag", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
  assert(response.ok);
}

function deleteHashtagInSignal(hashtags: Signal<Hashtag[]>, id: string) {
  hashtags.value = hashtags.value.filter((hashtag) => hashtag.id !== id);
}

async function deleteHashtag(hashtags: Signal<Hashtag[]>, id: string) {
  if (IS_BROWSER) await requestDeleteHashtag(id);
  deleteHashtagInSignal(hashtags, id);
}

interface SearchHashtagProps {
  isSubscribed: boolean;
}

export default function SearchHashtag(props: SearchHashtagProps) {
  const hashtags = useSignal<string[]>([]);

  const isMoreHashtags =
    props.isSubscribed || hashtags.value.length < FREE_PLAN_TODOS_LIMIT;

  return (
    <div class="space-y-4">
      <form
        class="flex gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          // @ts-ignore
          await searchHashtag(hashtags, event!.target!.term.value);
        }}
      >
        <Input
          name="term"
          class="w-full"
          required
          placeholder="enter a term to find hashtags"
          disabled={!isMoreHashtags}
        />
        <Button class="flex" disabled={!isMoreHashtags} type="submit">
          Search <IconPlus />
        </Button>
      </form>
      <ul class="divide-y space-y-2">
        {hashtags.value.map((hashtag) => (
          <li class="flex items-center justify-between gap-2 p-2">
            <div class="flex">{hashtag}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
