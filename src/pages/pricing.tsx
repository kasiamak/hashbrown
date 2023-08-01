import { type NextPage } from "next";
import Head from "next/head";
// import { useRouter } from "next/router";
import { useClerk, useUser } from "@clerk/nextjs";
import { Button } from "~/components/Button";
import { useRouter } from "next/router";
import { Card } from "~/components/card";
import getI18nProps from "~/i18n/getI18nProps";
import { useI18nContext } from "~/i18n/i18n-react";

export const getStaticProps = getI18nProps;

const currencies = {
  'en': "$8.00",
  'pl': "30,00 zł"
}

const Pricing: NextPage = () => {
  const { locale } = useI18nContext();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { redirectToSignUp } = useClerk();
  const { isSignedIn } = useUser();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Simple pricing for everyone | Hashbrown hashtag generator</title>
        <meta name="description" content="Discover our simple pricing plan for Hashbrown hashtag generator. Choose the perfect plan that suits your needs and budget. Generate relevant hashtags effortlessly and boost your social media reach and engagement. Sign up today and take your social media strategy to new heights!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section id="pricing" aria-label="Pricing" className="w-full py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display sm:text-4xlt text-3xl  tracking-tight">
              <span className="relative whitespace-nowrap">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 281 40"
                  className="absolute left-0 top-1/2 h-[1em] w-full fill-foreground/20"
                  preserveAspectRatio="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M240.172 22.994c-8.007 1.246-15.477 2.23-31.26 4.114-18.506 2.21-26.323 2.977-34.487 3.386-2.971.149-3.727.324-6.566 1.523-15.124 6.388-43.775 9.404-69.425 7.31-26.207-2.14-50.986-7.103-78-15.624C10.912 20.7.988 16.143.734 14.657c-.066-.381.043-.344 1.324.456 10.423 6.506 49.649 16.322 77.8 19.468 23.708 2.65 38.249 2.95 55.821 1.156 9.407-.962 24.451-3.773 25.101-4.692.074-.104.053-.155-.058-.135-1.062.195-13.863-.271-18.848-.687-16.681-1.389-28.722-4.345-38.142-9.364-15.294-8.15-7.298-19.232 14.802-20.514 16.095-.934 32.793 1.517 47.423 6.96 13.524 5.033 17.942 12.326 11.463 18.922l-.859.874.697-.006c2.681-.026 15.304-1.302 29.208-2.953 25.845-3.07 35.659-4.519 54.027-7.978 9.863-1.858 11.021-2.048 13.055-2.145a61.901 61.901 0 0 0 4.506-.417c1.891-.259 2.151-.267 1.543-.047-.402.145-2.33.913-4.285 1.707-4.635 1.882-5.202 2.07-8.736 2.903-3.414.805-19.773 3.797-26.404 4.829Zm40.321-9.93c.1-.066.231-.085.29-.041.059.043-.024.096-.183.119-.177.024-.219-.007-.107-.079ZM172.299 26.22c9.364-6.058 5.161-12.039-12.304-17.51-11.656-3.653-23.145-5.47-35.243-5.576-22.552-.198-33.577 7.462-21.321 14.814 12.012 7.205 32.994 10.557 61.531 9.831 4.563-.116 5.372-.288 7.337-1.559Z"
                  ></path>
                </svg>
                <span className="relative">Simple pricing,</span>
              </span>{" "}
              for everyone.
            </h2>
            <p className="mt-4 text-lg">For creators by creators</p>
          </div>
          <div className="-mx-4 mt-16 flex max-w-2xl justify-center gap-y-10  sm:mx-auto lg:-mx-8 lg:max-w-none xl:mx-0 xl:gap-x-8">
            <Card className="m-2 max-w-sm sm:m-0">
              <section className="order-first flex flex-col rounded-3xl px-6 py-8 sm:px-8 lg:order-none">
                <h3 className="font-display mt-5 text-lg ">Creator</h3>
                <p className="mt-2 text-base ">
                  Perfect for creators who want to build their audience.
                </p>
                <p className="font-display order-first text-5xl font-light tracking-tight ">
                 {currencies[locale]}
                </p>
                <ul
                  role="list"
                  className="order-last mt-10 flex flex-col gap-y-3 text-sm "
                >
                  <li className="flex">
                    <svg
                      aria-hidden="true"
                      className="h-6 w-6 flex-none fill-current stroke-current "
                    >
                      <path
                        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
                        strokeWidth="0"
                      ></path>
                      <circle
                        cx="12"
                        cy="12"
                        r="8.25"
                        fill="none"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></circle>
                    </svg>
                    <span className="ml-4">Unlimited hashtag generation</span>
                  </li>
                  <li className="flex">
                    <svg
                      aria-hidden="true"
                      className="h-6 w-6 flex-none fill-current stroke-current "
                    >
                      <path
                        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
                        strokeWidth="0"
                      ></path>
                      <circle
                        cx="12"
                        cy="12"
                        r="8.25"
                        fill="none"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></circle>
                    </svg>
                    <span className="ml-4">Save hashtags</span>
                  </li>
                  <li className="flex">
                    <svg
                      aria-hidden="true"
                      className="h-6 w-6 flex-none fill-current stroke-current "
                    >
                      <path
                        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
                        strokeWidth="0"
                      ></path>
                      <circle
                        cx="12"
                        cy="12"
                        r="8.25"
                        fill="none"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></circle>
                    </svg>
                    <span className="ml-4">Generate hashtags for captions</span>
                  </li>
                </ul>
                <Button
                  className="mt-8"
                  aria-label="Get started with the creator plan for zł29.99"
                  onClick={() => {
                    if (isSignedIn) {
                      void router.push({
                        pathname: "/dashboard",
                      });
                      return;
                    }
                    void redirectToSignUp();
                  }}
                >
                  Start 7 days free trial
                </Button>
              </section>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
