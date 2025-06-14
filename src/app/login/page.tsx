"use client";
import { SessionProvider } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Login() {
  const { data: session } = useSession();

  return (
    <SessionProvider>
      {session ? redirect("/home") : (
        <div className="flex justify-center items-center h-screen bg-slate-100">
          <div className="shadow-2xl w-[35%] h-[70%] rounded-2xl bg-white border-black">
            <div className="m-4 mt-8 flex flex-col items-center justify-center">
              <h1 className="text-7xl mb-2">Logo</h1>
              <p>Welcome, please sign in or create a new account.</p>
              <span className="h-0.5 mt-2 bg-gray-300 shadow-2xl w-[80%]"></span>
              <button onClick={() => {signIn("google")}} className="btn w-60 mt-4">
                <FaGoogle className="w-5 h-5 mr-1" /> Sign in with Google
              </button>
            </div>
          </div>
        </div>
      )}
    </SessionProvider>
  );
}
