import { Input } from "~/components/InputBox";
import { useState } from "react";
import { api } from "~/utils/api";
import { UpgradeButton } from "~/components/UpgradeButton";
import { Button } from "~/components/Button";
import { IconClipboardCopy, IconPlus, IconSearch } from "@tabler/icons-react";
import { useToast } from "~/components/Toast/use-toast";

export const HashtagSearch = () => {
  const { toast } = useToast();

  const [term, setTerm] = useState<string>("");

  const { data: subscriptionStatus, isLoading: isLoadingSubscription } =
    api.user.subscriptionStatus.useQuery();

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

  console.log({ isLoadingSubscription, subscriptionStatus });

  return (
    <>
      {!isLoadingSubscription && !subscriptionStatus ? (
        <>
          <p className="text-xl text-gray-700">You are not subscribed!!!</p>
          <UpgradeButton />
        </>
      ) : (
        <div className="flex max-w-sm gap-2">
          <Input
            placeholder="Search for hashtags"
            onChange={(e) => setTerm(e.target.value)}
          />
          <Button
            icon={<IconSearch className="h-4 w-4 shrink-0 opacity-50" />}
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
                className="m-1  flex items-center justify-center rounded-md border border-input h-10 px-2 py-1   "
              >
                <div className="max-w-full flex-initial text-xs font-normal leading-none">
                  {hashtag}
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="secondary"
            icon={<IconClipboardCopy />}
            onClick={() => {
              const hashtags = data?.map(({ hashtag }) => hashtag).join(" ");
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
    </>
  );
};
