"use client";
import "@/Components/components.css";
import CompanyAdminNavbar from "@/Components/CompanyAdminNavbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/Components/Loading";
import axios from "axios";
import { LuMessageCircle } from "react-icons/lu";
import { FaGraduationCap, FaMedal, FaRegClock } from "react-icons/fa6";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaListAlt, FaPlusSquare } from "react-icons/fa";

interface Company {
  name: string;
  displayName: string;
  imgURL: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company>();
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    const checkAdmin = async () => {
      if (!session || !session.user || !session.user.oauthId) {
        setLoading(false);
        router.replace("/");
        return;
      }
      try {
        const res = await axios.get(
          `/api/getUserAdminCompany?oid=${session.user.oauthId}`
        );

        setCompany(res.data);
      } catch (e) {
        router.replace("/");
        console.log(`error: ${e}`);
      } finally {
        setLoading(false);
      }
    };
    if (session) {
      checkAdmin();
    }
  }, [session]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <CompanyAdminNavbar company={company!} imgURL={company?.imgURL!} />
      <div className="p-4 m-4">
        <div>
          <h1 className="font-montserrat text-3xl font-semibold">
            Përshëndetje, {session?.user.name} !
          </h1>
          <h2 className="text-gray-700 text-lg mt-2">
            Menaxho kompaninë, krijo postime, ose bisedo me klientët.
          </h2>
        </div>

        <div className="flex justify-center items-center mt-8 space-x-12 flex-wrap">
          <div className="lg:flex lg:space-x-10">
            <div className="shadow-md h-44 w-80 mt-2 border-[1px] border-gray-300 rounded-2xl ">
              <div className="flex m-3">
                <img
                  src={company?.imgURL}
                  className="w-12 hover:brightness-80 cursor-pointer h-12 rounded-md"
                  alt=""
                />
                <div className="flex-col ml-2">
                  <h1 className="font-montserrat font-semibold">
                    {company?.displayName}
                  </h1>
                  <h2 className="font-montserrat">Plani: Biznes i vogël</h2>
                </div>
              </div>
              <div className="m-2 p-1 text-sm font-montserrat">
                <div>
                  <h2>
                    Postimet: <b className="">11</b> nga <b>15</b>
                  </h2>
                  <h2>
                    Adminët: <b>1</b> nga <b>5</b>
                  </h2>
                  <h2>
                    Bisedimet: <b>21</b> nga <b>100</b>
                  </h2>
                </div>
                <div className="flex justify-end items-end h-full">
                  <button className="btn btn-primary btn-sm">
                    Ndrysho planin
                  </button>
                </div>
              </div>
            </div>
            <div className="shadow-md h-44 w-80 mt-2 border-[1px] border-gray-300 rounded-2xl ">
              <div className="m-4 p-1 text-sm font-montserrat flex items-center">
                <h1 className="text-lg font-medium font-montserrat">
                  Bisedimet e reja
                </h1>
                <span className="ml-auto">
                  <LuMessageCircle className="h-6 w-6 opacity-70" />
                </span>
              </div>
              <div className="m-4 p-2">
                <h1 className="font-semibold text-3xl font-montserrat ">
                  9 këtë muaj
                </h1>
                <h2 className="font-montserrat text-sm opacity-70">
                  më shumë se shumica e kompanive
                </h2>
              </div>
            </div>
            <div className="shadow-md h-44 w-80 mt-2 border-[1px] border-gray-300 rounded-2xl ">
              <div className="ml-4 mt-4 p-1 text-sm font-montserrat flex items-center">
                <h1 className="text-lg font-medium font-montserrat">
                  Koha mesatare
                </h1>
                <span className="ml-auto text-xl opacity-70 mr-4">
                  <FaRegClock />
                </span>
              </div>
              <div className="ml-4 p-2">
                <h1 className="font-semibold text-xl w-full font-montserrat ">
                  3 orë e 23 sekonda për t'iu përgjigjur klientëve
                </h1>
                <h2 className="font-montserrat opacity-70 text-sm">
                  më vonë se shumica e kompanive
                </h2>
              </div>
            </div>
            <div className="shadow-md h-44 w-80 mt-2 border-[1px] border-gray-300 rounded-2xl ">
              <div className="ml-4 mt-4 p-1 text-sm font-montserrat flex items-center">
                <h1 className="text-lg font-medium font-montserrat">
                  Postimi më i biseduar
                </h1>
                <span className="ml-auto text-xl opacity-70 mr-4">
                  <FaMedal />
                </span>
              </div>
              <div className="ml-4 p-2">
                <h1 className="font-semibold text-xl w-full font-montserrat ">
                  <a href="" style={{ textDecoration: "underline" }}>
                    Kasier/e Kryesor
                  </a>{" "}
                  me 5 bisedime
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 ml-8 flex flex-row space-x-8">
          <div className="h-60 shadow-lg rounded-2xl border-gray-300 border-1 w-[50%]">
            <div className="m-6 p-2">
              <h1 className="font-montserrat text-3xl font-medium">
                Veprimet e shpejta
              </h1>
              <button className="mt-4 rounded-xl h-32 w-72 hover:cursor-pointer hover:brightness-90 bg-linear-to-r from-green-500 to-emerald-500">
                <div className="flex flex-col items-center">
                  <FaPlusSquare className="text-white w-8 h-8" />
                  <h1 className="text-white font-medium">
                    Krijo një postim të ri
                  </h1>
                </div>
              </button>
              <button className="mt-4 ml-8 rounded-xl h-32 w-72 hover:cursor-pointer hover:brightness-90 border-4 border-emerald-500">
                <div className="flex flex-col items-center">
                  <FaListAlt className="text-emerald-500 w-8 h-8" />
                  <h1 className="text-emerald-500 font-medium">
                    Shiko të gjitha postimet
                  </h1>
                </div>
              </button>
            </div>
          </div>
          <div className="border-1 border-gray-300 rounded-xl w-[50%]">
            <div className=" m-8 p-1">
              <div className="flex items-center">
                <FaGraduationCap className="w-8 h-8 mr-2" />{" "}
                <h1 className="text-xl font-montserrat font-medium">
                  Tutorials
                </h1>
              </div>
              <h2 className="opacity-70">Udhëzime nga ekipi i Punë e mbarë</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
