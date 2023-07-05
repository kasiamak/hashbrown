import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";

import { cn } from "~/utils/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { isSignedIn, } = useUser();
  const router = useRouter();
  return (
    <nav
      className={cn("mt-2 flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {isSignedIn && !router.pathname.includes("dashboard") && (
        <Link
          href="/dashboard"
          className=" border-l border-foreground/10 pl-4  text-sm font-medium transition-colors hover:text-muted-foreground"
        >
          Dashboard
        </Link>
      )}
      {router.pathname === "/" && (
        <Link
          href="/pricing"
          className="pl-4  text-sm font-medium transition-colors hover:text-muted-foreground"
        >
          Pricing
        </Link>
      )}

      {/* <Link
        href="/examples/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </Link>
      <Link
        href="/examples/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Customers
      </Link>
      <Link
        href="/examples/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Products
      </Link>
      <Link
        href="/examples/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Settings
      </Link> */}
    </nav>
  );
}
