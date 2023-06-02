import { type Hashtag, type HashtagGroup } from "@prisma/client";
import { Input } from "~/components/InputBox";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/card";
import { api } from "~/utils/api";
import { useDebounce } from "~/utils/useDebouce";
import {
  IconCirclePlus,
  IconClipboardCopy,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "~/components/Button";
import { toast } from "~/components/Toast/use-toast";

const AddHashtag = ({ hashtagGroupId }: { hashtagGroupId: string }) => {
  const [hashtag, setHashtag] = useState("");
  const utils = api.useContext();
  const { mutate, isLoading: isAdding } =
    api.hashtagGroups.addHashtagToHashtagGroup.useMutation({
      onError: (e) => {
        const errorMessage = e?.data?.zodError?.fieldErrors.hashtag?.[0];
        console.log("woop", errorMessage);
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

      onSuccess: async () => {
        await utils.hashtagGroups.getAll.invalidate();
        setHashtag("");
      },
    });

  return (
    <div className="relative m-1 flex items-center justify-center gap-2 rounded-md border border-input">
      <Input
        className="w-24 pr-8"
        variant="text"
        value={hashtag}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        onChange={(event) => {
          setHashtag(event.target.value);
          // debouceChange(event.target.value, hashtagGroup.id);
        }}
      />

      <IconCirclePlus
        className={`absolute right-1 cursor-pointer ${
          hashtag.length < 3 ? "opacity-60" : ""
        }`}
        onClick={() => {
          if (hashtag.length < 3) return;
          mutate({
            hashtag: hashtag?.[0] === "#" ? hashtag : `#${hashtag}`,
            hashtagGroupId,
          });
        }}
      />
    </div>
  );
};

const HashtagGroup = ({
  hashtagGroup,
  onNameChange,
  onDeleteHashtag,
  onDeleteHashtagGroup,
}: {
  hashtagGroup: Omit<HashtagGroup, "updatedAt" | "createdAt" | "userId"> & {
    hashtags: { hashtag: Hashtag }[];
  };
  onNameChange: (name: string, hashtagGroupId: string) => void;
  onDeleteHashtag: (hashtagGroupId: string, hashtagId: string) => void;
  onDeleteHashtagGroup: (hashtagGroupId: string) => void;
}) => {
  const [name, setName] = useState<string>(hashtagGroup.name);
  const debouceChange = useDebounce(onNameChange, 1000);

  return (
    <Card key={hashtagGroup.id} className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex">
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
      <CardContent className="flex flex-grow flex-col gap-4 py-4">
        <div className="flex flex-wrap">
          {hashtagGroup.hashtags?.map((hashtag) => (
            <div
              key={hashtag.hashtag.id}
              className="group/item h-10 relative m-1 flex  items-center justify-center rounded-md border border-input p-2 hover:bg-accent hover:text-accent-foreground"
            >
              <div className="max-w-full flex-initial text-xs font-normal leading-none group-hover/item:invisible">
                {hashtag.hashtag.name}
              </div>
              <div
                className="group/edit invisible absolute flex cursor-pointer gap-1 text-red-400 group-hover/item:visible"
                onClick={() => {
                  onDeleteHashtag(hashtagGroup.id, hashtag.hashtag.id);
                  toast({
                    title: `Deleted ${hashtag.hashtag.name}`,
                    variant: "destructive",
                  });
                }}
              >
                {/* <div className="max-w-full flex-initial text-xs font-normal leading-none">
                  delete
                </div> */}
                <IconTrash className="h-4 w-4 shrink-0" />
              </div>
            </div>
          ))}

          <AddHashtag hashtagGroupId={hashtagGroup.id} />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="secondary"
          icon={<IconClipboardCopy />}
          onClick={() => {
            const hashtags = hashtagGroup.hashtags
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
        </Button>{" "}
        <Button
          variant="destructive"
          icon={<IconTrash />}
          onClick={() => {
            void onDeleteHashtagGroup(hashtagGroup.id);
            toast({
              title: `Deleted ${hashtagGroup.name}`,
              variant: "destructive",
            });
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export const SavedHashtags = () => {
  const utils = api.useContext();
  const { data: hashtagGroups, isLoading: isLoadingHashtagGroups } =
    api.hashtagGroups.getAll.useQuery();

  const { mutate: removeHashtagFromGroup } =
    api.hashtagGroups.removeHashtagFromHashtagGroup.useMutation({
      onSuccess: async () => {
        await utils.hashtagGroups.getAll.invalidate();
      },
    });

  const { mutate: removeHashtagGroup } =
    api.hashtagGroups.deleteHashtagGroup.useMutation({
      onSuccess: async () => {
        await utils.hashtagGroups.getAll.invalidate();
      },
    });

  const { mutate: updateHashtagGroupName } =
    api.hashtagGroups.updateHashtagGroupName.useMutation({
      onSuccess: async () => {
        // do this better in future
        await utils.hashtagGroups.getAll.invalidate();
      },
    });

  return (
    <>
      {hashtagGroups?.map((hashtagGroup) => (
        <HashtagGroup
          key={hashtagGroup.id}
          hashtagGroup={hashtagGroup}
          onDeleteHashtag={(hashtagGroupId, hashtagId) =>
            removeHashtagFromGroup({ hashtagGroupId, hashtagId })
          }
          onDeleteHashtagGroup={(hashtagGroupId) =>
            removeHashtagGroup({ id: hashtagGroupId })
          }
          onNameChange={(name, hashtagGroupId) =>
            updateHashtagGroupName({ name, hashtagGroupId })
          }
        />
      ))}
    </>
  );
};
