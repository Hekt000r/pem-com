"use client";
import Loading from "@/Components/Loading";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBook } from "react-icons/fa6";
import { IoDocumentText, IoHome } from "react-icons/io5";

export default function SuperAdminLayout({ children }: any) {
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(window.location.pathname); // safe now
    axios.get(`/api/getIsSuperAdmin`).then((res) => {
      if (res.data.superadmin == false) {
        router.push("/");
      } else {
        setIsSuperAdmin(true);
        setLoading(false);
      }
    });
  }, []);

  const activeBtnClass = `h-14 btn btn-ghost flex text-blue-700 bg-blue-100 font-bold`;
  const inactiveBtnClass = `h-14 btn btn-ghost flex`;
  const isActive = (page: string) => currentPath === page;

  if (loading) return <Loading />;

  return (
    <div className="h-screen w-72 border-gray-300 border-1 shadow-2xl">
      <div className="m-4 flex flex-col space-y-2">
        <a
          className={`items-center border-gray-300 border-2 justify-center w-64 cursor-pointer space-x-1 ${
            isActive("/pem-admin/home") ? activeBtnClass : inactiveBtnClass
          }`}
        >
          <IoHome className="w-6 h-6" />{" "}
          <h1 className="text-lg font-semibold font-legacy-montserrat">
            Ballina
          </h1>
        </a>

        <a
          className={`items-center border-gray-300 border-2 justify-center w-64 cursor-pointer space-x-1 ${
            isActive("/pem-admin/company-applications")
              ? activeBtnClass
              : inactiveBtnClass
          }`}
        >
          <IoDocumentText className="w-6 h-6" />{" "}
          <h1 className="text-md max-w-48 font-semibold font-legacy-montserrat overflow-visible">
            Aplikimet e kompanive
          </h1>
        </a>

        <a
          className={`items-center border-gray-300 border-2 justify-center w-64 cursor-pointer space-x-1 ${
            isActive("/pem-admin/company-applications")
              ? activeBtnClass
              : inactiveBtnClass
          }`}
        >
          <FaBook className="w-5 h-5" />{" "}
          <h1 className="text-md max-w-48 font-semibold font-legacy-montserrat overflow-visible">
            Regjistri i veprimeve
          </h1>
        </a>
      </div>
    </div>
  );
}
