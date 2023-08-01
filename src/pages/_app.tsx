/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "~/styles/globals.css";
import { type AppProps, type AppType } from "next/app";
import { api } from "~/utils/api";
import { Toaster } from "~/components/Toast/Toaster";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { siteConfig } from "~/config";
import { fontSans } from "~/utils/fonts";
import { cn } from "~/utils"
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "~/components/ThemeProvider";
import { TailwindIndicator } from "~/components/TailwindIndicator";
import Layout from "~/components/Layout";
import TypesafeI18n from "~/i18n/i18n-react";
import { loadedLocales } from "~/i18n/i18n-util";
import { loadFormatters } from "~/i18n/i18n-util.async";
import { type Locales, type Translation } from "~/i18n/i18n-types";

export const metadata: Metadata = {
  creator: "hashbrown",
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  // // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  // if (!pageProps.i18n) {
  //   // probably an Error page
  //   return <Component {...pageProps} />;
  // }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const locale: Locales = pageProps.i18n?.locale ?? "en";
  const dictionary: Translation = pageProps.i18n?.dictionary;

  loadedLocales[locale] = dictionary;
  loadFormatters(locale);

  return (
    <div
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TypesafeI18n locale={locale}>
          <ClerkProvider {...pageProps}>
            <Toaster />
            <Layout>
              <Component {...pageProps} />
              <Analytics />
            </Layout>
          </ClerkProvider>
        </TypesafeI18n>
      </ThemeProvider>
      <TailwindIndicator />
    </div>
  );
};

export default api.withTRPC(MyApp);
