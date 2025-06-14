"use client"
import { SessionProvider, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";


export default function Home() {
  const {data: session, status} = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login")
    },
    
  })
 
  return <>Nje moment.. {redirect("/home")}</>;
}
