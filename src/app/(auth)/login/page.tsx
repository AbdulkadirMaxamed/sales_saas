import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image";
import { LoginForm } from "@/components/login-form"
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function LoginPage() {
  const { userId } = await auth();

  

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <h1>Hello (You are signed in)</h1>
    </div>
  );
}
