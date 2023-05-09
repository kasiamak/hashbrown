import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useState } from "react";
// import toast from "react-hot-toast";
import { Button } from "~/components/Button";
import { IconPlus, IconTrash } from "@tabler/icons-react";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Nav(props: {
  items: { href: string; inner: React.ReactNode }[];
}) {
  return (
    <nav>
      <ul
        className={`flex h-full items-center justify-between gap-x-8 gap-y-2 `}
      >
        {props.items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.inner}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Header(props: { children?: React.ReactNode }) {
  return (
    <header
      className={`z-10 mx-auto flex w-full max-w-7xl justify-between p-8`}
    >
      <Link href="/" />
      {/* <Logo height="68" /> */}
      {props.children}
    </header>
  );
}

function SidebarNav(props: {
  active?: string;
  items: { icon?: string; href: string; inner: React.ReactNode }[];
}) {
  return (
    <nav className="w-full md:w-[16rem] md:flex-shrink-0 ">
      <ul className="flex flex-col justify-start">
        {props.items.map((item) => (
          <li key={item.href}>
            <Link
              className={`block w-full rounded px-4 py-2 ${
                item.href === props.active
                  ? "bg-gray-100 font-bold"
                  : "hover:bg-gray-100"
              }`}
              href={item.href}
            >
              <span className="flex align-middle">
                {/* <item.icon className="inline-block mr-2" /> */}
                {item.inner}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const headerNavItems = [
  {
    href: "/logout",
    inner: "Logout",
  },
];

const sidebarNavItems = [
  {
    // icon: IconHash,
    href: "/dashboard/searchHashtags",
    inner: "Search hashtags",
  },
  {
    // icon: IconHash,
    href: "/dashboard/hashtags",
    inner: "My hashtags",
  },
  {
    // icon: IconHash,
    href: "/dashboard/hashtagGroups",
    inner: "Groups",
  },
  {
    // icon: IconListDetails,
    href: "/dashboard/todos",
    inner: "Todos",
  },
  {
    // icon: IconUser,
    href: "/dashboard/account",
    inner: "Account",
  },
];

const CreateHashtagWizard = () => {
  const [input, setInput] = useState<string>("");

  const ctx = api.useContext();

  const { mutate, isLoading } = api.hashtags.createHashtag.useMutation({
    onSuccess: () => {
      setInput("");
      //   toast.success("Created Hashtag!");
      void ctx.hashtags.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.hashtag;
      if (errorMessage && errorMessage[0]) {
        // toast.error(errorMessage[0]);
      } else {
        // toast.error("Failed to post! Please try again later.");
      }
    },
  });

  return (
    <div className="flex w-full gap-3">
      <input
        title="Must be valid hashtag"
        pattern="#[\p{L}\p{Mn}\p{Pc}0-9_]+"
        required
        placeholder="enter a new #hashtag"
        className="disabled:(opacity-50 cursor-not-allowed) rounded border-2 border-gray-400 bg-white px-3 py-2 focus:border-gray-500
        "
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ hashtag: input });
            }
          }
        }}
        disabled={isLoading}
      />

      <Button onClick={() => mutate({ hashtag: input })}>
        Create <IconPlus />
      </Button>
      {isLoading && (
        <div className="flex items-center justify-center">
          Loading...
          {/* <LoadingSpinner size={20} /> */}
        </div>
      )}
    </div>
  );
};

const Home: NextPage = () => {
  const hashtags = api.hashtags.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Hashtags</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header>
        <Nav items={headerNavItems} />
      </Header>
      <main className="flex min-h-screen flex-row gap-8 p-8">
        <SidebarNav items={sidebarNavItems} />

        <div className="space-y-4">
          <div className="ml-1  text-2xl font-bold">Hashtags</div>
          <ul className="space-y-2 divide-y">
            {hashtags?.data?.map((hashtag) => (
              <li
                key={hashtag.id}
                className="flex items-center justify-between gap-2 p-2"
              >
                <div className="flex">{hashtag.name}</div>
                {/* <IconTrash
                  onClick={async () =>
                    await deleteHashtag(hashtags, hashtag.id)
                  }
                  className="cursor-pointer text-red-600"
                /> */}
              </li>
            ))}
          </ul>
          <CreateHashtagWizard />
        </div>
      </main>
    </>
  );
};

export default Home;
