import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { Button } from "./Button";
import { IconCreditCard, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";

export interface UserNavProps {
  email: string;
  image: string;
  name: string;
}

export function UserNav({ image, name, email }: UserNavProps) {
  const { signOut, openUserProfile } = useClerk();
  const { mutateAsync: createBillingPortalSession } =
    api.stripe.createBillingPortalSession.useMutation();
  const { push } = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>
            <IconUser className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              const { billingPortalUrl } = await createBillingPortalSession();
              if (billingPortalUrl) {
                void push(billingPortalUrl);
              }
            }}
          >
            <IconCreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => openUserProfile()}
          >
            <IconUserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span>
            {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
          </DropdownMenuItem>

          {/* openUserProfile */}
          {/* <DropdownMenuItem>
            <IconSettings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem>
            <IconCirclePlus className="mr-2 h-4 w-4" />
            <span>New Team</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => void signOut(() => void push("/"))}
        >
          <IconLogout className="mr-2 h-4 w-4" />
          <span>Log out</span>
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
