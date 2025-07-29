"use client";
import { SessionProvider } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import GoogleSignInButton from "@/Components/GoogleSignInButton";
import { FaBuilding, FaBuildingUser } from "react-icons/fa6";

export default function Login() {
  const { data: session } = useSession();

  return (
    <SessionProvider>
      {session ? (
        redirect("/home")
      ) : (
        <div className="flex justify-center items-center h-screen bg-slate-100">
          <div className="shadow-2xl w-[30%] h-[50%] rounded-2xl bg-white border-black">
            <div className="m-4 mt-8 flex flex-col items-center justify-center">
              <a href="/">
                <img src="Logo1.svg" className="w-52" />
              </a>
              <p className="mt-2">
                Përshëndetje! Identifikohuni ose krijoni një llogari të re.
              </p>
              <span className="h-0.25 mt-2 bg-gray-300 shadow-2xl w-[80%]"></span>

              <div className="mt-2">
                <GoogleSignInButton
                  onClick={() => signIn("google")}
                  size="large"
                />
              </div>

              <div className="w-full flex items-center justify-center space-x-4 mt-4">
                <span className="h-px bg-gray-300 flex-1"></span>
                <h1 className="text-gray-500 font-medium">ose</h1>
                <span className="h-px bg-gray-300 flex-1"></span>
              </div>

              <button
                className="h-12 px-6 text-base
        bg-white 
        btn
        border-gray-300 
        text-gray-700 
        font-medium 
        hover:bg-gray-50 
        hover:border-gray-400
        focus:bg-gray-50
        disabled:opacity-50 
        disabled:cursor-not-allowed
        transition-all 
        duration-200
        flex 
        items-center 
        justify-center 
        gap-3
        min-w-fit
        mt-2
        "
              >
                <FaBuildingUser className="w-6 h-6"/>
                Regjistro një kompani
              </button>
            </div>
          </div>
        </div>
      )}
    </SessionProvider>
  );
}
