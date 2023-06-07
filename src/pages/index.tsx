import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useToast } from "~/components/Toast/use-toast";
import { useEffect, useState } from "react";
import { Input } from "~/components/InputBox";
import { Button } from "~/components/Button";
import { IconClipboardCopy, IconDeviceFloppy, IconLogin, IconLogout, IconPlus, IconTrash } from "@tabler/icons-react";
import { ManageBillingButton } from "~/components/ManageBilling";
import { UpgradeButton } from "~/components/UpgradeButton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/card";
import { Hashtag, HashtagGroup } from "@prisma/client";
import { useDebounce } from "~/utils/useDebouce";

const CreateHashtagGroup = ({
  name,
  hashtagIds,
}: {
  name: string;
  hashtagIds: string[];
}) => {
  const utils = api.useContext();
  const { mutate, isLoading } =
    api.hashtagGroups.createHashtagGroup.useMutation({
      onSuccess: async () => {
        await utils.hashtagGroups.getAll.invalidate();
      },
    });

  return (
    <Button
      isLoading={isLoading}
      variant="secondary"
      icon={<IconDeviceFloppy />}
      onClick={() => mutate({ name, hashtags: hashtagIds })}
    >
      Save
    </Button>
  );
};

const HashtagGroup = ({
  hashtagGroup,
  onNameChange,
  onDelete,
}: {
  hashtagGroup: Omit<HashtagGroup, "updatedAt" | "createdAt" | "userId"> & {
    hashtags: { hashtag: Hashtag }[];
  };
  onNameChange: (name: string, hashtagGroupId: string) => void;
  onDelete: (hashtagGroupId: string, hashtagId: string) => void;
}) => {
  const [name, setName] = useState<string>(hashtagGroup.name);

  const debouceChange = useDebounce(onNameChange, 1000);

  return (
    <Card key={hashtagGroup.id}>
      <CardHeader>
        <CardTitle>
          <Input
            variant="text"
            value={name}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            onChange={(event) => {
              setName(event.target.value);
              debouceChange(event.target.value, hashtagGroup.id);
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 py-4">
        <div className="flex flex-wrap">
          {hashtagGroup.hashtags?.map((hashtag) => (
            <div
              key={hashtag.hashtag.id}
              className="group/item relative m-1 flex  items-center justify-center rounded-md border border-input p-2 hover:bg-accent hover:text-accent-foreground"
            >
              <div className="max-w-full flex-initial text-xs font-normal leading-none group-hover/item:invisible">
                {hashtag.hashtag.name}
              </div>
              <div
                className="group/edit invisible absolute flex cursor-pointer gap-1 text-red-400 group-hover/item:visible"
                onClick={() => onDelete(hashtagGroup.id, hashtag.hashtag.id)}
              >
                <div className="max-w-full flex-initial text-xs font-normal leading-none">
                  delete
                </div>
                <IconTrash size={14} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        {/* <Button
variant="secondary"
icon={<IconPlus />}
onClick={() => {
  const hashtags = hashtagGroup
    ?.map(({ hashtag }) => hashtag.name)
    .join(" ");
  toast({
    title: "copied to clipboard",
    description: hashtags,
  });
  void navigator.clipboard.writeText(hashtags);
}}
>
Copy
</Button> */}
      </CardFooter>
    </Card>
  );
};

const MyHashtagGroups = () => {
  const utils = api.useContext();
  const { data: hashtagGroups, isLoading: isLoadingHashtagGroups } =
    api.hashtagGroups.getAll.useQuery();

  const { mutate: updateHashtagGroupName } =
    api.hashtagGroups.updateHashtagGroupName.useMutation({
      onSuccess: async () => {
        // do this better in future
        await utils.hashtagGroups.getAll.invalidate();
      },
    });

  const { mutate: removeHashtagGroup } =
    api.hashtagGroups.removeHashtagFromHashtagGroup.useMutation({
      onSuccess: async () => {
        await utils.hashtagGroups.getAll.invalidate();
      },
    });

  return (
    <>
      <h2 className="mb-10 mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        My hashtag groups
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {hashtagGroups?.map((hashtagGroup) => (
          <HashtagGroup
            key={hashtagGroup.id}
            hashtagGroup={hashtagGroup}
            onDelete={(hashtagGroupId, hashtagId) =>
              removeHashtagGroup({ hashtagGroupId, hashtagId })
            }
            onNameChange={(name, hashtagGroupId) =>
              updateHashtagGroupName({ name, hashtagGroupId })
            }
          />
        ))}
      </div>
    </>
  );
};

const Home: NextPage = () => {
  const { data: subscriptionStatus, isLoading: isLoadingSubscription } =
    api.user.subscriptionStatus.useQuery();

  const { data: hashtagSearches, isLoading: isLoadingHashtagSearches } =
    api.hashtagSearches.getAll.useQuery();

  const { toast } = useToast();

  const [term, setTerm] = useState<string>("");

  const { mutate, isLoading, data } = api.gpt.hashtags.useMutation({
    onSuccess: () => {
      // setInput("");
      // //   toast.success("Created Hashtag!");
      // void ctx.hashtags.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage =
        e?.message ?? e.data?.zodError?.fieldErrors.hashtag?.[0];
      console.log(e.message);
      if (errorMessage) {
        toast({
          variant: "destructive",
          title: "Error has occured",
          description: errorMessage,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to find hashtags! Please try again later.",
        });
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
            {!isLoadingSubscription && subscriptionStatus === null ? (
              <>
                <p className="text-xl text-gray-700">
                  You are not subscribed!!!
                </p>
                <UpgradeButton />
              </>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Search for hashtags"
                  onChange={(e) => setTerm(e.target.value)}
                />
                <Button
                  icon={<IconPlus />}
                  disabled={isLoading}
                  isLoading={isLoading}
                  onClick={() => mutate({ term })}
                >
                  Search
                </Button>
              </div>
            )}
            {data?.length && (
              <>
                <div className="flex flex-wrap">
                  {data.map(({ hashtag }) => (
                    <div
                      key={hashtag}
                      className="m-1 flex items-center justify-center rounded-full  border border-input px-2 py-1 hover:bg-accent hover:text-accent-foreground "
                    >
                      <div className="max-w-full flex-initial text-xs font-normal leading-none">
                        #{hashtag}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  icon={<IconClipboardCopy />}
                  onClick={() => {
                    const hashtags = data
                      ?.map(({ hashtag }) => hashtag)
                      .join(" ");
                    toast({
                      title: "copied to clipboard",
                      description: hashtags,
                    });
                    void navigator.clipboard.writeText(hashtags);
                  }}
                >
                  Copy
                </Button>
              </>
            )}
            <MyHashtagGroups />
            <h2 className="mb-10 mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              Past searches
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {hashtagSearches?.map((hashtagSearch) => (
                <Card key={hashtagSearch.id}>
                  <CardHeader>
                    <CardTitle>{hashtagSearch.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 py-4">
                    <div className="flex flex-wrap">
                      {hashtagSearch.hashtags?.map((hashtag) => (
                        <div
                          key={hashtag.hashtag.id}
                          className="m-1 flex items-center justify-center rounded-full  border border-input px-2 py-1 hover:bg-accent hover:text-accent-foreground "
                        >
                          <div className="max-w-full flex-initial text-xs font-normal leading-none">
                            {hashtag.hashtag.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button
                      variant="secondary"
                      icon={<IconClipboardCopy />}
                      onClick={() => {
                        const hashtags = hashtagSearch.hashtags
                          ?.map(({ hashtag }) => hashtag.name)
                          .join(" ");
                        toast({
                          title: "copied to clipboard",
                          description: hashtags,
                        });
                        void navigator.clipboard.writeText(hashtags);
                      }}
                    >
                      Copy
                    </Button>
                    <CreateHashtagGroup
                      name={hashtagSearch.name}
                      hashtagIds={hashtagSearch.hashtags?.map(
                        ({ hashtag }) => hashtag.id
                      )}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
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

  const { data: subscriptionStatus, isLoading: isLoadingSubscription } =
    api.user.subscriptionStatus.useQuery();

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

      {!isLoadingSubscription && subscriptionStatus !== null && (
        <ManageBillingButton />
      )}
    </div>
  );
};
