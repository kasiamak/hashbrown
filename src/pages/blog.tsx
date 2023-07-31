import Link from "next/link";
import { compareDesc } from "date-fns";
import { allPosts, type Post } from "contentlayer/generated";
import Image from "next/image";
import { Separator } from "~/components/Separator";

function PostCard(post: Post) {
  return (
    <article className="group relative flex flex-col space-y-2">
      <Image
        src={post.image}
        width="804"
        height="452"
        alt=""
        className="rounded-md border bg-muted transition-colors"
      />
      <h2 className="text-2xl font-extrabold">{post.title}</h2>
      <p className="text-muted-foreground">{post.description}</p>
      <p className="text-sm text-muted-foreground">
        {new Date(post.date).toDateString()}
      </p>
      <Link href={post.url} className="absolute inset-0">
        <span className="sr-only">View Article</span>
      </Link>
    </article>
  );
}

export default function Home() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <div className="mx-auto max-w-4xl py-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Empowering Creators, Entrepreneurs, and Social Media Managers to Excel
        on Social Media
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
      Unleash the Power of Hashtags with our Advanced Hashtag Research and Generation Tool - Supercharge your Social Media Strategy and Maximize Your Reach with Hashbrown, the Ultimate Hashtag Companion.
      </p>
      <Separator className="mb-6 mt-4" />
      <div className="grid gap-10 sm:grid-cols-2">
        {posts.map((post, idx) => (
          <PostCard key={idx} {...post} />
        ))}
      </div>
    </div>
  );
}
