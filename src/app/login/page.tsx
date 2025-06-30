"use client";
import { SessionProvider } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import GoogleSignInButton from "@/Components/GoogleSignInButton";

export default function Login() {
  const { data: session } = useSession();

  return (
    <SessionProvider>
      {session ? redirect("/home") : (
        <div className="flex justify-center items-center h-screen bg-slate-100">
          <div className="shadow-2xl w-[30%] h-[50%] rounded-2xl bg-white border-black">
            <div className="m-4 mt-8 flex flex-col items-center justify-center">
              <a href="/"><img src="Logo1.svg" className="w-52" /></a>
              <p className="mt-2">Përshëndetje! Identifikohuni ose krijoni një llogari të re.</p>
              <span className="h-0.5 mt-2 bg-gray-300 shadow-2xl w-[80%]"></span>

              <div className="mt-2"><GoogleSignInButton onClick={() => signIn("google")} size="large"/></div>
            </div>
          </div>
        </div>
      )}
    </SessionProvider>
  );
}
