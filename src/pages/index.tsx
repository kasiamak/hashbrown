import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Button } from "~/components/Button";
import Link from "next/link";
import { useI18nContext } from "~/i18n/i18n-react";
import getI18nProps from "~/i18n/getI18nProps";

export const getStaticProps = getI18nProps;

const Home: NextPage = () => {
  const { LL } = useI18nContext();
  return (
    <>
      <Head>
        <title>Hashbrown - Simple and Effective Hashtag Generator Tool</title>
        <meta name="description" content="Generate relevant hashtags instantly with Hashbrown - the easy-to-use tool that delivers targeted hashtags for every search term. Boost your social media reach and engagement effortlessly." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pt-32">
        <h1 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight  sm:text-7xl">
          {LL.title.hashtags()}{" "}
          <span className="relative whitespace-nowrap font-bold">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute left-0 top-2/3 h-[0.58em] w-full fill-foreground/20"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span className="relative">{LL.title.madeSimple()}</span>
          </span>{" "}
          {LL.title.forCreators()}.
        </h1>
        <p className="mx-auto mt-14 max-w-2xl ">{LL.whileManyMightBe()}</p>
        <div className="mt-14 flex justify-center">
          <Link passHref href="/sign-up">
            <Button>{LL.tryForFree()}</Button>
          </Link>
        </div>
      </div>
      <section
        id="features"
        aria-label="Features for running your books"
        className="relative overflow-hidden bg-muted py-20 sm:py-32"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {LL.unleashTheMagic()}
            </h2>
            <h3 className="font-display mt-6 text-xl tracking-tight  sm:text-4xl md:text-3xl">
              {LL.generateInstantly()}
            </h3>
          </div>
          <div className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0">
            <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
              <div>
                <div className="group relative rounded-full bg-accent px-4 py-1 lg:rounded-l-xl lg:rounded-r-none  lg:p-6 lg:ring-1 lg:ring-inset lg:ring-white/10">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    {LL.hashtagGeneration()}
                  </h3>
                  <p className="mt-2 leading-7">{LL.boostReach()}</p>
                </div>
                {/* <div className="group relative mb-64 rounded-full px-4 py-1  lg:rounded-l-xl lg:rounded-r-none lg:p-6 ">
                  <h3>
                    <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none"></span>
                    Caption hashtag generation
                  </h3>
                  <p className="mt-2 hidden text-sm  lg:block">
                    Elevate your content with captivating captions and trending
                    hashtags! Enhance your social media presence with our
                    caption hashtag generation tool. Get started now!
                  </p>
                </div> */}
              </div>
            </div>
            <div className="w-full lg:col-span-7">
              <div
                id="headlessui-tabs-panel-:Rda9m:"
                role="tabpanel"
                tabIndex={0}
                data-headlessui-state="selected"
                aria-labelledby="headlessui-tabs-tab-:R2ba9m:"
              >
                <div className="mt-10 w-[45rem] overflow-hidden rounded-xl shadow-xl  sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                  <Image
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
        <h1 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight  sm:text-7xl">
          {LL.getStarted()}{" "}
          <span className="relative whitespace-nowrap ">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute left-0 top-2/3 h-[0.58em] w-full fill-foreground/20"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span className="relative">{LL.today()}</span>
          </span>
        </h1>
        <p className="font-display mx-auto mt-6 mt-6 text-xl tracking-tight  sm:text-4xl md:text-3xl ">
          {LL.forCreatorsByCreators()}
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link passHref href="/sign-up">
            <Button>{LL.tryForFree()}</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
