import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useToast } from "~/components/Toast/use-toast";
import { useEffect, useState } from "react";
import { Input } from "~/components/Input";
import { Button } from "~/components/Button";
import { Card, CardContent } from "~/components/card";
import { IconLogin, IconLogout, IconPlus } from "@tabler/icons-react";

const Home: NextPage = () => {
  const { toast } = useToast();

  const [term, setTerm] = useState<string>("");

  const { mutate, isLoading, data } = api.gpt.hashtags.useMutation({
    onSuccess: () => {
      // setInput("");
      // //   toast.success("Created Hashtag!");
      // void ctx.hashtags.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.hashtag;
      if (errorMessage && errorMessage[0]) {
        // toast.error(errorMessage[0]);
      } else {
        // toast.error("Failed to post! Please try again later.");
      }
    },
  });

  useEffect(() => {
    toast({
      title: "hello world",
      description: "this is trying out the toast component",
    });
  }, []);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Hashbrown
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          enter in a topic and we{"'"}ll generate hashtags for you
        </p>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 pt-12 ">
          <div className="flex flex-col items-center gap-2">
            {/* <Card className="px-6 py-4"> */}
            <div className="flex gap-2">
              <Input
                placeholder="Search for hashtags"
                onChange={(e) => setTerm(e.target.value)}
              />
              <Button disabled={isLoading} onClick={() => mutate({ term })}>
                Search <IconPlus />
              </Button>
            </div>
            {data?.length && (
              <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                {data?.map(({ hashtag }) => (
                  <li key={hashtag}>{hashtag}</li>
                ))}
              </ul>
            )}
            {/* </Card> */}
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <Button
        className="gap-2"
        variant="ghost"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? (
          <>
            Sign out
            <IconLogout />
          </>
        ) : (
          <>
            Sign in <IconLogin />
          </>
        )}
      </Button>
    </div>
  );
};
