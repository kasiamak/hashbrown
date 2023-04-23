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

function createHashtagInSignal(hashtags: Signal<string[]>, hashtag: string[]) {
    hashtags.value = [...hashtags.value, ...hashtag];
}

async function searchHashtag(hashtags: Signal<string[]>, name: string) {
    // faking a backend, waiting 1 second
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));

    const newHashtags = [
        '#fitnessmotivation',
        '#fitfam',
        '#fitnessjourney',
        '#fitlife',
        '#workoutmotivation',
        '#fitspo',
        '#healthy',
        '#fitgirl',
        '#getfit',
        '#fitfluential',
    ];
    createHashtagInSignal(hashtags, newHashtags);
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

interface SearchHashtagProps {
    isSubscribed: boolean;
}

export default function SearchHashtag(props: SearchHashtagProps) {
    const hashtags = useSignal<string[]>([]);
    const newHashtagRef = useRef<HTMLInputElement | null>(null);

    const isMoreHashtags =
        props.isSubscribed || hashtags.value.length < FREE_PLAN_TODOS_LIMIT;

    return (
        <div class='space-y-4'>
            <form
                class='flex gap-4'
                onSubmit={async (event) => {
                    event.preventDefault();
                    await searchHashtag(hashtags, newHashtagRef.current!.value);
                    newHashtagRef.current!.form!.reset();
                }}
            >
                <input
                    required
                    placeholder='enter a term to find hashtags'
                    ref={newHashtagRef}
                    disabled={!isMoreHashtags}
                    class={`${BASE_INPUT_STYLES} flex-1`}
                />
                <button
                    disabled={!isMoreHashtags}
                    type='submit'
                    class={`${BASE_BUTTON_STYLES} px-4`}
                >
                    +
                </button>
            </form>
            <ul class='divide-y space-y-2'>
                {hashtags.value.map((hashtag) => (
                    <li class='flex items-center justify-between gap-2 p-2'>
                        <div class='flex'>{hashtag}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
