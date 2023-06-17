import { type Metadata } from "next";
import Image from "next/image";

import { MainNav } from "~/components/MainNav";
import { UserNav } from "~/components/UserNav";
import { PastSearches } from "~/islands/PastSearches";
import { SavedHashtags } from "~/islands/SavedHashtags";
import { HashtagSearch } from "~/islands/HashtagSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/Tabs";
import { useEffect, useMemo, useState } from "react";

import { createContext } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

export const TabContext = createContext<"saved" | "searches">("saved");
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const TabDispatchContext = createContext<(tab: Tabs) => void>(() => {});

type Tabs = "saved" | "searches";

export default function NewDashboardPage() {
  const { user } = useUser();

  const [tab, setTab] = useState<Tabs>("saved");

  const handleTabChange = (value: Tabs) => {
    setTab(value);
  };

  const { data: hashtagGroups } = api.hashtagGroups.getAll.useQuery();

  const { data: hashtagSearches } = api.hashtagSearches.getAll.useQuery();

  const hasHashtagGroups = useMemo(
    () => Boolean(hashtagGroups?.length),
    [hashtagGroups?.length]
  );
  const hasHashtagSearches = useMemo(
    () => Boolean(hashtagSearches?.length),
    [hashtagSearches?.length]
  );

  useEffect(() => {
    if (!hasHashtagGroups && !hasHashtagSearches) return;
    if (!hasHashtagGroups && tab === "saved") {
      setTab("searches");
    }
    if (!hasHashtagSearches && tab === "searches") {
      setTab("saved");
    }
  }, [hasHashtagGroups, hasHashtagSearches, tab]);

  return (
    <>
      <TabContext.Provider value={tab}>
        <TabDispatchContext.Provider value={handleTabChange}>
          <div className="md:hidden">
            <Image
              src="/examples/dashboard-light.png"
              width={1280}
              height={866}
              alt="Dashboard"
              className="block dark:hidden"
            />
            <Image
              src="/examples/dashboard-dark.png"
              width={1280}
              height={866}
              alt="Dashboard"
              className="hidden dark:block"
            />
          </div>
          <div className="hidden flex-col md:flex">
            <div className="border-b">
              <div className="flex h-16 items-center px-8">
                {/* <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/monsters.png`}
                    alt={"monsters"}
                  />
                  <AvatarFallback>MI</AvatarFallback>
                </Avatar> */}
                <h1 className="text-3xl font-bold tracking-tight">Hashbrown</h1>
                <MainNav className="mx-6" />
                {user && (
                  <div className="ml-auto flex items-center space-x-4">
                    {/* <Search /> */}
                    <UserNav
                      name={user.fullName ?? ""}
                      email={user.primaryEmailAddress?.toString() ?? ""}
                      image={user.imageUrl ?? ""}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-6 p-8 pt-6">
              <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center space-x-2">
                  {/* <CalendarDateRangePicker /> */}
                  {/* <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button> */}
                </div>
              </div>

              <HashtagSearch />
              {(hasHashtagGroups || hasHashtagSearches) && (
                <Tabs
                  value={tab}
                  onValueChange={(value) => {
                    setTab(value as Tabs);
                  }}
                  className="space-y-4"
                >
                  {hasHashtagGroups && hasHashtagSearches && (
                    <TabsList>
                      <TabsTrigger value="saved">Saved</TabsTrigger>
                      <TabsTrigger value="searches">Searches</TabsTrigger>
                    </TabsList>
                  )}

                  <TabsContent value="saved" className="space-y-4">
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                      Saved hashtags
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <SavedHashtags />
                    </div>

                    {/* <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Subscriptions
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Now
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card> */}
                    {/* <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card> */}
                    {/* <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You made 265 sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card> */}
                  </TabsContent>
                  <TabsContent value="searches" className="space-y-4">
                    <PastSearches />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </TabDispatchContext.Provider>
      </TabContext.Provider>
    </>
  );
}
