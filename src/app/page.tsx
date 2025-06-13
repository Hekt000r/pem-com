"use client"
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    redirect("/login")
  }, [])
  return <SessionProvider><div>Loading</div></SessionProvider>;
}
