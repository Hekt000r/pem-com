"use client";
import Loading from "@/Components/Loading";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBook, FaClipboardList } from "react-icons/fa6";
import { IoDocumentText, IoHome } from "react-icons/io5";
import { FaHome } from "react-icons/fa";

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

  const activeBtnClass = `btn btn-ghost border bg-blue-50 border-blue-400 shadow-sm rounded-sm flex justify-start font-legacy-montserrat text-blue-700 items-center w-full`;
  const inactiveBtnClass = `btn btn-ghost border border-gray-400 shadow-sm rounded-sm flex justify-start font-legacy-montserrat text-gray-700 items-center w-full`;
  const isActive = (page: string) => currentPath === page;

  if (loading) return <Loading />;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="h-screen w-64 flex-shrink-0 border-gray-300 border-1 shadow-2xl p-3 pt-6 space-y-2 overflow-y-auto">
        <div>
          <a
            href="/pem-admin/home"
            className={
              isActive("/pem-admin/home") ? activeBtnClass : inactiveBtnClass
            }
          >
            <FaHome className={`w-5 h-5`} /> Ballina
          </a>
        </div>
        <div className="">
          <p className="font-legacy-montserrat text-gray-900   text-sm font-medium">
            Kompanitë
          </p>
          <span className="divider my-0"></span>
        </div>
        <div>
          <a
            href="/pem-admin/company-applications"
            className={
              isActive("/pem-admin/company-applications")
                ? activeBtnClass
                : inactiveBtnClass
            }
          >
            <FaClipboardList className={`w-5 h-5`} /> Aplikimet e kompanive
          </a>
        </div>
        <div>
          <a
            className={
              isActive("/pem-admin/company-logs")
                ? activeBtnClass
                : inactiveBtnClass
            }
          >
            <FaBook className={`w-5 h-5`} /> Regjistri i veprimeve
          </a>
        </div>
      </div>
      <div className="flex-1 h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
