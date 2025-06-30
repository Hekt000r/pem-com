"use client";
import { SessionProvider, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <span className="text-lg font-medium">Një moment...</span>
      </div>
    );
  }


  redirect("/home");
  return null;
}
