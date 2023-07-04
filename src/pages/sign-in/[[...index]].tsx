import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <SignIn
        routing="virtual"
        appearance={{
          variables: {
            colorPrimary: '#1B1917'
          },
        }}
      />
    </main>
  );
}
