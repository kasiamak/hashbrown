import "~/styles/globals.css";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { Toaster } from "~/components/Toast/Toaster";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { siteConfig } from "~/config";
import { fontSans } from "~/utils/fonts";
import { cn } from "~/utils/utils";
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from "~/components/ThemeProvider";
import { TailwindIndicator } from "~/components/TailwindIndicator";
import Layout from "~/components/Layout";

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

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ClerkProvider {...pageProps}>
          <Toaster />
          <Layout>
            <Component {...pageProps} />
            <Analytics />
          </Layout>
        </ClerkProvider>
      </ThemeProvider>
      <TailwindIndicator />
    </div>
  );
};

export default api.withTRPC(MyApp);
