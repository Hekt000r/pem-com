"use client";
import "@/Components/components.css";
import CompanyAdminNavbar from "@/Components/CompanyAdminNavbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/Components/Loading";
import axios from "axios";

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
            <div className="m-2 p-1 font-montserrat">
              <div>
                <h2>
                  Postimet: <b>11</b> nga <b>15</b>
                </h2>
                <h2>
                  Adminët: <b>1</b> nga <b>5</b>
                </h2>
              </div>
              <div className="flex justify-end items-end h-full">
                <button className="btn btn-primary btn-sm">Ndrysho planin</button>
              </div>
            </div>
          </div>
          <div className="shadow-md h-44 w-80 mt-2 border-[1px] border-gray-300 rounded-2xl "></div>
          <div className="shadow-md h-44 w-80 mt-2 border-[1px] border-gray-300 rounded-2xl "></div>
          <div className="shadow-md h-44 w-80 mt-2 border-[1px] border-gray-300 rounded-2xl "></div>
        </div>
      </div>
    </div>
  );
}
