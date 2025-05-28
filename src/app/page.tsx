import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  // If user is not signed in, redirect to login
  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Welcome to Sales SaaS!</h1>
        <p className="text-lg text-muted-foreground">
          You are successfully signed in. This is your protected dashboard.
        </p>
      </main>
    </div>
  );
}
