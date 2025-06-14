"use client"
import { SessionProvider, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";


export default function Home() {
  const {data: session, status} = useSession()
 
  return <>Nje moment.. {status === "authenticated" ? redirect("/home") : redirect("/login")} </>;
}
