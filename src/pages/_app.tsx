import { type AppType } from "next/app";
export { reportWebVitals } from "next-axiom";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "~/components/Toast/Toaster";
import { type Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  creator: "hashbrown",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const MyApp: AppType = ({
  Component,
  pageProps
}) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
