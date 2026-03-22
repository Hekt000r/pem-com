"use client";
import { signOut, useSession } from "next-auth/react";
import { FaHome, FaTools } from "react-icons/fa";
import {
  FaAddressCard,
  FaBookmark,
  FaBriefcase,
  FaDoorOpen,
  FaGear,
} from "react-icons/fa6";
import Image from "next/image";
import { IoPersonCircle } from "react-icons/io5";
import { useEffect, useState } from "react";
import { TbMessageCircleFilled } from "react-icons/tb";
import { MdAdminPanelSettings } from "react-icons/md";
import {
  BriefcaseBusiness,
  ContactRound,
  House,
  LogIn,
  MessageCircle,
} from "lucide-react";
import { Button } from "@heroui/react";
import axios from "axios";
import Link from "next/link";

type NavbarProps = {
  page: "home" | "jobs" | "companies" | "chats" | "none";
};

export default function Navbar({ page }: NavbarProps) {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      if (!session?.user?.oauthId) return;

      try {
        /* normal admin status */
        const res = await axios.get(
          `/api/getUserAdminCompany?oid=${session.user.oauthId}`,
        );
        setIsAdmin(res.data.isAdmin);

        /* super admin status */
        const res2 = await axios.get(`/api/getIsSuperAdmin`);
        setIsSuperAdmin(res2.data.superadmin);
      } catch (err) {
        console.error("Error fetching admin status:", err);
        setIsAdmin(false);
      }
    };

    fetchAdminStatus();
  }, [session]);

  const getBtnClass = (btn: "home" | "jobs" | "companies" | "chats" | "none") =>
    `h-10 rounded-md btn btn-ghost p-1 flex${
      page === btn ? " text-blue-700 bg-blue-100 font-bold" : ""
    }`;

  const isActive = (btn: "home" | "jobs" | "companies" | "chats" | "none") =>
    page === btn ? "primary" : "outline";

  return (
    <>
      <div className="h-14 flex shadow-xl bg-white">
        <div className="h-12 flex w-full m-1 p-1">
          <a href="/" className="h-10 w-80 hover:bg-gray-200 hover:border-gray-300 hover:border rounded-xl p-2 cursor-pointer flex items-center justify-center">
            <img src="/Logo1.svg" className="h-10" alt="" />
          </a>
          <div className="flex space-x-2 h-10 ml-3 w-full justify-center items-center mr-[15%]">
            <Link href="/home">
              <Button variant={isActive("home")} className="items-center">
                <House className="" />
                <span className="leading-none">Ballina</span>
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant={isActive("jobs")} className="items-center">
                <ContactRound className="" />
                <span className="leading-none">Punët</span>
              </Button>
            </Link>
            <Link href="/companies">
              <Button variant={isActive("companies")} className="items-center">
                <BriefcaseBusiness className="" />
                <span className="leading-none">Kompanitë</span>
              </Button>
            </Link>
            <Link href="/chats">
              <Button variant={isActive("chats")} className="items-center">
                <MessageCircle className="" />
                <span className="leading-none">Bisedimet</span>
              </Button>
            </Link>
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
                  className={`absolute top-12 right-0 shadow-xl border border-black rounded-2xl max-h-64 pb-4 w-56 bg-white flex flex-col items-end z-50 transition-all duration-200 ease-out
                  ${
                    isVisible
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                  }
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

                  {isAdmin && (
                    <a
                      href="/admin/dashboard"
                      className="w-[90%] btn btn-ghost rounded-xl p-1 mt-2 h-10 justify-start mr-2 pr-2"
                    >
                      <MdAdminPanelSettings className="w-6 h-6" />
                      <h1 className="text-md">Admin</h1>
                    </a>
                  )}

                  {isSuperAdmin && (
                    <a
                      href="/pem-admin/"
                      className="w-[90%] btn btn-ghost rounded-xl p-1 mt-2 h-10 justify-start mr-2 pr-2"
                    >
                      <FaTools className="w-5 h-5" />
                      <h1 className="text-md">Superadmin</h1>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      signOut();
                    }}
                    className="w-[90%] btn btn-error rounded-xl p-1 mt-2 h-10 justify-center mr-2 pr-2"
                  >
                    <FaDoorOpen className="w-5 h-5" />
                    <h1 className="text-md">Dil</h1>
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <Button className="items-center">
                  <LogIn className="" />
                  <span className="leading-none">Kyçu</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
