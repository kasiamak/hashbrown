import { IconClipboardCopy, IconPlus } from "@tabler/icons-react";
import { Button } from "~/components/Button";
import { toast } from "~/components/Toast/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/card";
import { api } from "~/utils/api";

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
      icon={<IconPlus />}
      onClick={() => {
        mutate({ name, hashtags: hashtagIds });
        toast({
          title: "Saved"
        });
      }}
    >
      Save hashtags
    </Button>
  );
};

export const PastSearches = () => {
  const { data: hashtagSearches, isLoading: isLoadingHashtagSearches } =
    api.hashtagSearches.getAll.useQuery();
  return (
    <>
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
          </CardFooter>
        </Card>
      ))}
    </>
  );
};
