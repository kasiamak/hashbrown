import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <SignUp
        routing="virtual"
        afterSignUpUrl={"/subscribe"}
        // appearance={{
        //   baseTheme: dark,
        // }}
      />
    </main>
  );
}
