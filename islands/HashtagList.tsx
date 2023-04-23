import { type Signal, useSignal } from '@preact/signals';
import { IS_BROWSER } from '$fresh/runtime.ts';
import type { Hashtag } from '@/utils/hashtags.ts';
import IconHash from 'tabler-icons/hash.tsx';
import {
    BASE_BUTTON_STYLES,
    BASE_INPUT_STYLES,
    FREE_PLAN_TODOS_LIMIT,
} from '@/utils/constants.ts';
import IconTrash from 'tabler-icons/trash.tsx';
import { assert } from 'std/testing/asserts.ts';
import { useRef } from 'preact/hooks';

async function requestCreateHashtag(hashtag: Hashtag) {
    const response = await fetch('/dashboard/api/hashtag', {
        method: 'POST',
        body: JSON.stringify(hashtag),
    });
    assert(response.ok);
}

function createHashtagInSignal(hashtags: Signal<Hashtag[]>, hashtag: Hashtag) {
    hashtags.value = [...hashtags.value, hashtag];
}

async function createHashtag(hashtags: Signal<Hashtag[]>, name: string) {
    const newHashtag: Hashtag = {
        name: name.toLowerCase(),
        id: crypto.randomUUID(),
    };
    if (IS_BROWSER) await requestCreateHashtag(newHashtag);
    createHashtagInSignal(hashtags, newHashtag);
}

async function requestDeleteHashtag(id: string) {
    const response = await fetch('/dashboard/api/hashtag', {
        method: 'DELETE',
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

interface HashtagListProps {
    isSubscribed: boolean;
    hashtags: Hashtag[];
}

export default function HashtagList(props: HashtagListProps) {
    const hashtags = useSignal(props.hashtags);
    const newHashtagRef = useRef<HTMLInputElement | null>(null);

    const isMoreHashtags =
        props.isSubscribed || hashtags.value.length < FREE_PLAN_TODOS_LIMIT;

    return (
        <div class='space-y-4'>
            <ul class='divide-y space-y-2'>
                {hashtags.value.map((hashtag) => (
                    <li class='flex items-center justify-between gap-2 p-2'>
                        <div class='flex'>
                            <IconHash />
                            {hashtag.name}
                        </div>
                        <IconTrash
                            onClick={async () =>
                                await deleteHashtag(hashtags, hashtag.id)
                            }
                            class='cursor-pointer text-red-600'
                        />
                    </li>
                ))}
            </ul>
            <form
                class='flex gap-4'
                onSubmit={async (event) => {
                    event.preventDefault();
                    await createHashtag(hashtags, newHashtagRef.current!.value);
                    newHashtagRef.current!.form!.reset();
                }}
            >
                <input
                    placeholder='enter a new hashtag'
                    ref={newHashtagRef}
                    disabled={!isMoreHashtags}
                    class={`${BASE_INPUT_STYLES} flex-1`}
                    required
                />
                <button
                    disabled={!isMoreHashtags}
                    type='submit'
                    class={`${BASE_BUTTON_STYLES} px-4`}
                >
                    +
                </button>
            </form>
        </div>
    );
}
