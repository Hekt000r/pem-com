import "./components.css";
import { useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import { FaGear, FaBookmark, FaDoorOpen } from "react-icons/fa6";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

interface Company {
  name: string;
  displayName: string;
  imgURL: string;
}
interface CompanyAdminNavbarProps {
  imgURL: string;
  company: Company;
}

export default function CompanyAdminNavbar({
  company,
}: CompanyAdminNavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap"
        rel="stylesheet"
      ></link>
      <div className="h-16 flex shadow-xl">
        <div className="flex p-1.5 ml-1 h-16 items-center">
          <img
            className="rounded-md w-12 h-12 cursor-pointer hover:brightness-80 transition"
            src={company.imgURL}
            alt=""
          />
          <h1 className="ml-2 font-montserrat font-semibold">
            {company.displayName} Admin
          </h1>
        </div>
        <div className="flex flex-1 justify-end items-end mr-8">
          {session ? (
            <div className="flex relative items-center justify-center h-full">
              <button className="h-10 btn btn-ghost p-1 flex ml-2 mr-2 items-center justify-center">
                <h1 className="justify-center h-12 flex items-center mr-2">
                  <IoPersonCircle className="m-2 w-6 h-6 text-xl" /> Dil prej Admin
                </h1>
              </button>

              <button
                onClick={() => setIsVisible((prev) => !prev)}
                className="w-10 h-10 btn btn-ghost rounded-full overflow-hidden p-0.5 flex items-center justify-center"
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
                            ${
                              isVisible
                                ? "opacity-100 scale-100 pointer-events-auto"
                                : "opacity-0 scale-95 pointer-events-none"
                            }
                            `}
                style={{ transformOrigin: "top right" }}
              >
                <button className="w-[90%] btn btn-ghost rounded-xl p-1 mt-2 h-10 justify-start mr-2 pr-2 flex items-center">
                  <FaGear className="w-5 h-5" />
                  <h1 className="text-md">Settings</h1>
                </button>
                <button className="w-[90%] btn btn-ghost rounded-xl p-1 mt-2 h-10 justify-start mr-2 pr-2 flex items-center">
                  <FaBookmark className="w-5 h-5" />
                  <h1 className="text-md">Punët e ruajtura</h1>
                </button>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-[90%] btn btn-error rounded-xl p-1 mt-2 h-10 justify-center mr-2 pr-2 flex items-center"
                >
                  <FaDoorOpen className="w-5 h-5" />
                  <h1 className="text-md">Dil</h1>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        
      </div>
    </>
  );
}
