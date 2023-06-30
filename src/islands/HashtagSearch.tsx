import { Input } from "~/components/InputBox";
import { useContext, useState } from "react";
import { api } from "~/utils/api";
import { Button } from "~/components/Button";
import {
  IconClipboardCopy,
  IconDeviceFloppy,
  IconSearch,
} from "@tabler/icons-react";
import { useToast } from "~/components/Toast/use-toast";
import { Checkbox } from "~/components/checkbox";
import { TabContext, TabDispatchContext } from "~/pages/dashboard";
import { StripeSubscriptionStatus } from "@prisma/client";
import { Alert, AlertDescription, AlertTitle } from "~/components/alert";
import { AlertCircleIcon } from "lucide-react";

const isValidSubscription = (status: StripeSubscriptionStatus | undefined) => {
  const validSubscriptions: StripeSubscriptionStatus[] = [
    StripeSubscriptionStatus.active,
    StripeSubscriptionStatus.trialing,
  ];
  if (!status) return false;
  if (validSubscriptions.includes(status)) return true;
  return false;
};

export const HashtagSearch = () => {
  const { toast } = useToast();
  const utils = api.useContext();
  const tab = useContext(TabContext);
  const tabDispatch = useContext(TabDispatchContext);

  const [term, setTerm] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);

  const {
    data: subscriptionStatus,
    isLoading: isLoadingSubscription,
    error,
  } = api.user.subscriptionStatus.useQuery(undefined, {
    // dont retry subscription status
    // we want to show the user the error stright away
    retry: false,
  });

  const { mutate, isLoading, data } = api.gpt.hashtags.useMutation({
    onSuccess: async (data) => {
      setSelected(data.map(({ id }) => id));
      await utils.hashtagSearches.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage =
        e?.message ?? e.data?.zodError?.fieldErrors.hashtag?.[0];
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

  const {
    mutate: createHashtagGroupMutation,
    isLoading: isCreatingHashtagGroup,
  } = api.hashtagGroups.createHashtagGroup.useMutation({
    onSuccess: async () => {
      await utils.hashtagGroups.getAll.invalidate();
    },
  });

  return (
    <>
      {!isLoadingSubscription && error && (
        <Alert variant="destructive" className="max-w-sm">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex max-w-sm gap-2">
        <Input
          disabled={Boolean(error) || !isValidSubscription(subscriptionStatus)}
          placeholder="Search for hashtags"
          onChange={(e) => setTerm(e.target.value)}
          // if user presses enter in input lets search
          onKeyDown={(event) => {
            if (event.key === "Enter") mutate({ term });
          }}
        />
        <Button
          icon={}
          disabled={
            isLoading ||
            Boolean(error) ||
            !isValidSubscription(subscriptionStatus)
          }
          isLoading={isLoading}
          onClick={() => mutate({ term })}
        >
          Search
        </Button>
      </div>
      {data?.length && (
        <>
          <div className="flex flex-wrap">
            {data.map(({ name: hashtag, id }) => (
              <div
                key={hashtag}
                className={`m-1  flex h-10 cursor-pointer items-center justify-center rounded-md border-2 p-4 ${
                  Boolean(selected.find((value) => value === id))
                    ? " bg-accent"
                    : ""
                }`}
                onClick={() => {
                  const isSelected = Boolean(
                    selected.find((value) => value === id)
                  );
                  if (isSelected) {
                    setSelected(selected.filter((value) => value !== id));
                  } else {
                    setSelected([...selected, id]);
                  }
                }}
              >
                <div className="flex flex-initial items-center gap-2 text-lg font-semibold">
                  {hashtag}
                  <Checkbox
                    checked={Boolean(selected.find((value) => value === id))}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              icon={<IconClipboardCopy />}
              onClick={() => {
                const hashtags = data
                  .filter(({ id }) => selected.find((value) => value === id))
                  ?.map(({ name: hashtag }) => hashtag)
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
            <Button
              isLoading={isCreatingHashtagGroup}
              variant="secondary"
              icon={<IconDeviceFloppy />}
              onClick={() => {
                const hashtagIds = selected;
                createHashtagGroupMutation({
                  name: term,
                  hashtags: hashtagIds,
                });
                toast({
                  title: "Saved",
                  description: `"${term}" has been saved`,
                  action:
                    tab !== "saved" ? (
                      <Button onClick={() => tabDispatch("saved")}>
                        Show saved
                      </Button>
                    ) : undefined,
                });
              }}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </>
  );
};
