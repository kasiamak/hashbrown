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
import { IconMenu2, IconTrash } from "@tabler/icons-react";
import { Button } from "~/components/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "~/components/DropdownMenu";

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" icon={<IconMenu2 />}></Button>
            </DropdownMenuTrigger>
			<DropdownMenuContent className="flex flex-col ">
				<Button variant="ghost" size="sm">Copy</Button>
				<Button variant="ghost" size="sm" className='text-red-400'>Delete</Button>
			</DropdownMenuContent>
          </DropdownMenu>
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
                <small className="max-w-full flex-initial text-sm font-medium leading-none">
                  delete
                </small>
                {/* <div className="max-w-full flex-initial text-xs font-normal leading-none">
                  delete
                </div> */}
                <IconTrash className="h-4 w-4 shrink-0" />
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
  Copy to clipboard
  </Button> */}
      </CardFooter>
    </Card>
  );
};

export const SavedHashtags = () => {
  const utils = api.useContext();
  const { data: hashtagGroups, isLoading: isLoadingHashtagGroups } =
    api.hashtagGroups.getAll.useQuery();

  const { mutate: removeHashtagGroup } =
    api.hashtagGroups.removeHashtagFromHashtagGroup.useMutation({
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
          onDelete={(hashtagGroupId, hashtagId) =>
            removeHashtagGroup({ hashtagGroupId, hashtagId })
          }
          onNameChange={(name, hashtagGroupId) =>
            updateHashtagGroupName({ name, hashtagGroupId })
          }
        />
      ))}
    </>
  );
};
