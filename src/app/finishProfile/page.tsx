"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function FinishProfile() {
  const { data: session, status } = useSession({
    required: true, onUnauthenticated() {
        redirect("/login")
    }
  })

  return (
    <SessionProvider>
      {status === "authenticated" ? (
        <>Complete your profile</>
      ) : (
       <></>
      )}
    </SessionProvider>
  );
}
