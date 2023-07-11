
import { allPosts } from "contentlayer/generated";
import { Mdx } from "~/components/MdxComponents";

export function getStaticProps(context: any) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    props: { ...context.params }, // will be passed to the page component as props
  };
}

export  function getStaticPaths() {
  return {
    paths: allPosts.filter(post => post.published).map((post) => ({
      params: { slug: post._raw.flattenedPath },
    })), // See the "paths" section below
    fallback: false,
  };
}

const PostLayout = (myparams: { slug: string }) => {
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === myparams.slug
  );

  if (!post) throw new Error(`Post not found for slug: ${myparams.slug}`);

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="font-heading inline-block text-4xl lg:text-5xl">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-xl text-muted-foreground">{post.description}</p>
        )}
      </div>
      <hr className="my-4" />
      <Mdx code={post.body.code} />
    </article>
  );
};

export default PostLayout;
