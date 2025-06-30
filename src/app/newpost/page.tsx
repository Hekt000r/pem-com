"use client"
import CompanyAdminNavbar from "@/Components/CompanyAdminNavbar";
import Navbar from "@/Components/Navbar";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";


export default function Page() {
    const { data: session, status } = useSession();

    type Company = {
      imgURL: string;
      displayName: string;
      name: string;
    };
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAdmin = async () => {
        if (!session || !session.user || !session.user.oauthId) {
          setLoading(false);
          redirect("/");
          return;
        }
        try {
          const res = await axios.get(
            `/api/getUserAdminCompany?oid=${session.user.oauthId}`
          );

          setCompany({
            imgURL: res.data.imgURL ?? "",
            displayName: res.data.displayName ?? "",
            name: res.data.name ?? ""
          });
        } catch (e) {
          redirect("/");
          console.log(`error: ${e}`);
        } finally {
          setLoading(false);
        }
      };
      if (session) {
        checkAdmin();
      } else {
        setLoading(false);
      }
    }, [session]);

    if (loading) return <Loading />;

    return (
      <>
        {company && company.name && (
          <CompanyAdminNavbar imgURL={company.imgURL} company={company} />
        )}
        <div>New Post</div>
      </>
    );
}