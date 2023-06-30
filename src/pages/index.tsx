import { type NextPage } from "next";
import Head from "next/head";
// import { useRouter } from "next/router";
import { SignInButton, UserButton, useClerk, useUser } from "@clerk/nextjs";
import { Button } from "~/components/Button";
import { IconLogin } from "@tabler/icons-react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Home: NextPage = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { redirectToSignIn, session } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  // useEffect(() => {
  //   if (session) {
  //     void router.push({
  //       pathname: "/dashboard",
  //     });
  //   }
  // }, [router, session]);
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pt-32">
        <h1 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
          Hashtags{" "}
          <span className="relative whitespace-nowrap text-blue-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span className="relative">made simple</span>
          </span>{" "}
          for creators.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
          While many hashtag generators may be complicated to use, we prioritize
          simplicity without compromising accuracy. Say goodbye to complex tools
          and stay worry-free about your hashtag choices.
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link
            className="group inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:bg-slate-800 active:text-slate-300"
            href="/pricing"
          >
            Try for free
          </Link>
          <Link
            className="group inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:text-slate-900 hover:ring-slate-300 focus:outline-none focus-visible:outline-blue-600 focus-visible:ring-slate-300 active:bg-slate-100 active:text-slate-600"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          >
            <svg
              aria-hidden="true"
              className="h-3 w-3 flex-none fill-blue-600 group-active:fill-current"
            >
              <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" />
            </svg>
            <span className="ml-3">Watch video</span>
          </Link>
        </div>
        <div className="mt-36 lg:mt-44">
          <p className="font-display text-base text-slate-900">
            Trusted by hundreds of creators!
          </p>
        </div>
      </div>
      <section
        id="features"
        aria-label="Features for running your books"
        className="relative overflow-hidden bg-blue-600 pb-28 pt-20 sm:py-32"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
              Unleash the Hashtag Magic!
            </h2>
            <h3 className=" font-display mt-6 text-xl tracking-tight text-white sm:text-4xl md:text-3xl">
              Generate Trending Hashtags Instantly.
            </h3>
          </div>
          <div className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0">
            <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
              <div
                className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal"
                role="tablist"
                aria-orientation="vertical"
              >
                <div className="group relative rounded-full bg-white px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:bg-white/10 lg:p-6 lg:ring-1 lg:ring-inset lg:ring-white/10">
                  <h3>
                    <button
                      className="font-display text-lg text-blue-600 lg:text-white [&:not(:focus-visible)]:focus:outline-none"
                      id="headlessui-tabs-tab-:R2ba9m:"
                      role="tab"
                      type="button"
                      aria-selected="true"
                      tabIndex={0}
                      data-headlessui-state="selected"
                      aria-controls="headlessui-tabs-panel-:Rda9m:"
                    >
                      <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none"></span>
                      Hashtag generation
                    </button>
                  </h3>
                  <p className="mt-2 hidden text-sm text-white lg:block">
                    Boost Your Reach with Powerful Hashtags! Unlock the
                    Potential of Hashtag Generation and Supercharge Your Social
                    Media Strategy Today.
                  </p>
                </div>
                <div className="group relative mb-64 rounded-full px-4 py-1 hover:bg-white/10 lg:rounded-l-xl lg:rounded-r-none lg:p-6 lg:hover:bg-white/5">
                  <h3>
                    <button
                      className="font-display text-lg text-blue-100 hover:text-white lg:text-white [&:not(:focus-visible)]:focus:outline-none"
                      id="headlessui-tabs-tab-:R2ja9m:"
                      role="tab"
                      type="button"
                      aria-selected="false"
                      tabIndex={-1}
                      data-headlessui-state=""
                      aria-controls="headlessui-tabs-panel-:Rla9m:"
                    >
                      <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none"></span>
                      Caption hashtag generation
                    </button>
                  </h3>
                  <p className="mt-2 hidden text-sm text-blue-100 group-hover:text-white lg:block">
                    Elevate Your Content with Captivating Captions and Trending
                    Hashtags! Enhance Your Social Media Presence with our
                    Caption Hashtag Generation Tool. Get Started Now!
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 w-full">
              <div
                id="headlessui-tabs-panel-:Rda9m:"
                role="tabpanel"
                tabIndex={0}
                data-headlessui-state="selected"
                aria-labelledby="headlessui-tabs-tab-:R2ba9m:"
              >
                <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                  <img
                    alt=""
                    // fetchpriority="high"
                    width="2174"
                    height="1464"
                    decoding="async"
                    data-nimg="1"
                    className="w-full"
                    // style="color: transparent"
                    sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                    src="/showoff.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pt-32">
        <h1 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
          Get started{" "}
          <span className="relative whitespace-nowrap text-blue-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span className="relative">today</span>
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
          For creators, by creators
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link
            className="group inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:bg-slate-800 active:text-slate-300"
            href="/pricing"
          >
            Try for free
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
