"use client"
import { signOut, useSession } from "next-auth/react";
import { FaHome } from "react-icons/fa";
import {
  FaAddressCard,
  FaBookmark,
  FaBriefcase,
  FaDoorOpen,
  FaGear,
} from "react-icons/fa6";
import Image from "next/image";
import { IoPersonCircle } from "react-icons/io5";
import { useState } from "react";

type NavbarProps = {
  page: "home" | "jobs" | "companies";
};

export default function Navbar({ page }: NavbarProps) {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  const getBtnClass = (btn: "home" | "jobs" | "companies") =>
    `h-10 btn btn-ghost p-1 flex${page === btn ? " text-green-700 bg-green-100 font-bold" : ""}`;

  return (
    <>
      <div className="h-14 flex shadow-xl bg-white">
        <div className="h-12 flex w-full m-1 p-1">
          <button className="h-10 btn btn-ghost p-1 flex">
            <img src="./Logo1.svg" className="h-10" alt="" />
          </button>
          <div className="flex h-10 w-full justify-center items-center mr-[15%]">
            <a href="/home" className={getBtnClass("home")}>
              <h1 className="justify-center h-12 flex items-center mr-2">
                <FaHome className="m-2 text-xl" /> Ballina
              </h1>
            </a>
            <a href="/jobs" className={getBtnClass("jobs") + " ml-2"}>
              <h1 className="justify-center h-12 flex items-center mr-2">
                <FaAddressCard className="m-2 text-xl" /> Punët
              </h1>
            </a>
            <button className={getBtnClass("companies") + " ml-2"}>
              <h1 className="justify-center h-12 flex items-center mr-2">
                <FaBriefcase className="m-2 text-xl" /> Kompanitë
              </h1>
            </button>
          </div>

          <div className="flex h-10 w-full justify-end items-center mr-[15%]">
            {session ? (
                <div className="flex relative">
                <button className="h-10 btn btn-ghost p-1 flex ml-2 mr-2">
                  <h1 className="justify-center h-12 flex items-center mr-2">
                  <IoPersonCircle className="m-2 w-6 h-6 text-xl" /> Profili
                  im
                  </h1>
                </button>

                <button
                  onClick={() => setIsVisible((prev) => !prev)}
                  className="w-10 h-10 btn btn-ghost rounded-full overflow-hidden p-0.5"
                >
                  <Image
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                  src={session?.user?.image!}
                  alt="User"
                  />
                </button>

                <div
                  className={`absolute top-12 right-0 shadow-xl border border-black rounded-2xl h-40 w-56 bg-white flex flex-col items-end z-50 transition-all duration-200 ease-out
                  ${isVisible ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
                  `}
                  style={{ transformOrigin: "top right" }}
                >
                  <button className="w-[90%] btn btn-ghost rounded-xl p-1 mt-2 h-10 justify-start mr-2 pr-2">
                  <FaGear className="w-5 h-5" />
                  <h1 className="text-md">Settings</h1>
                  </button>
                  <button className="w-[90%] btn btn-ghost rounded-xl p-1 mt-2 h-10 justify-start mr-2 pr-2">
                  <FaBookmark className="w-5 h-5" />
                  <h1 className="text-md">Punët e ruajtura</h1>
                  </button>
                  <button onClick={()=>{signOut()}} className="w-[90%] btn btn-error rounded-xl p-1 mt-2 h-10 justify-center mr-2 pr-2">
                  <FaDoorOpen className="w-5 h-5" />
                  <h1 className="text-md">Dil</h1>
                  </button>
                </div>
                </div>
            ) : (
              <a href="/login" className="py-2 px-6 rounded-lg cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Kyçu
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
