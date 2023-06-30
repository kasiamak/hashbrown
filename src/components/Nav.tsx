import { useClerk, useUser } from "@clerk/nextjs";
import { MainNav } from "./MainNav";
import { UserNav } from "./UserNav";
import { Button } from "./Button";
import { IconLogin } from "@tabler/icons-react";

export const Nav = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { redirectToSignIn } = useClerk();
  const { user } = useUser();
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-8">
        <h1 className="text-3xl font-bold tracking-tight">Hashbrown</h1>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <UserNav
              name={user.fullName ?? ""}
              email={user.primaryEmailAddress?.toString() ?? ""}
              image={user.imageUrl ?? ""}
            />
          )}
          {!user && (
            <Button
              className="max-w-sm gap-2"
              variant="ghost"
              onClick={() => void redirectToSignIn()}
            >
              Sign in <IconLogin />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
