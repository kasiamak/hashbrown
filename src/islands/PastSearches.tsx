import {
  IconClipboardCopy,
  IconDeviceFloppy,
  IconEyeOff,
} from "@tabler/icons-react";
import { useContext } from "react";
import { Button } from "~/components/Button";
import { toast } from "~/components/Toast/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/card";
import { TabDispatchContext } from "~/pages/dashboard";
import { api } from "~/utils/api";

const CreateHashtagGroup = ({
  name,
  hashtagIds,
}: {
  name: string;
  hashtagIds: string[];
}) => {
  const tabDispatch = useContext(TabDispatchContext);
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
      onClick={() => {
        mutate({ name, hashtags: hashtagIds });
        toast({
          title: "Saved",
          description: `"${name}" has been saved`,
          action: (
            <Button onClick={() => tabDispatch("saved")}>Show saved</Button>
          ),
        });
      }}
    >
      Save
    </Button>
  );
};

export const PastSearches = () => {
  const utils = api.useContext();
  const { data: hashtagSearches, isLoading: isLoadingHashtagSearches } =
    api.hashtagSearches.getAll.useQuery();

  const { mutate: hideHashtagSearchMutation } =
    api.hashtagSearches.hide.useMutation({
      onSuccess: async () => {
        await utils.hashtagSearches.getAll.invalidate();
      },
    });

  const { mutate: hideAllMutation } = api.hashtagSearches.hideAll.useMutation({
    onSuccess: async () => {
      await utils.hashtagSearches.getAll.invalidate();
    },
  });

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Past searches
      </h2>
	  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
	  {/* @ts-ignore */}
      {hashtagSearches?.length > 0 && (
        <Button
          variant="secondary"
          icon={<IconEyeOff />}
          onClick={() => {
            hideAllMutation({
              ids: hashtagSearches?.map(({ id }) => id) ?? [],
              hidden: true,
            });
            toast({
              title: `Hidden all`,
            });
          }}
        >
          Hide all
        </Button>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {hashtagSearches?.map((hashtagSearch) => (
          <Card key={hashtagSearch.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{hashtagSearch.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col gap-4 py-4">
              <div className="flex flex-wrap">
                {hashtagSearch.hashtags?.map((hashtag) => (
                  <div
                    key={hashtag.hashtag.id}
                    className="group/item relative m-1 flex  items-center justify-center rounded-md border border-input p-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="max-w-full flex-initial text-xs font-normal leading-none ">
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

              <Button
                variant="secondary"
                icon={<IconEyeOff />}
                onClick={() => {
                  hideHashtagSearchMutation({
                    id: hashtagSearch.id,
                    hidden: true,
                  });
                  toast({
                    title: `Hidden ${hashtagSearch.name}`,
                  });
                }}
              >
                Hide
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};
