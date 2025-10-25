"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/Components/Loading";
import CompanyAdminNavbar from "@/Components/CompanyAdminNavbar";
import { CompanyProvider } from "@/contexts/CompanyContext";

export default function AdminLayout({ children }: any) {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [billingData, setBillingData] = useState<any>(null);
  const [admins, setAdmins] = useState<Array<Admin>>()
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!session?.user?.oauthId) {
        router.replace("/login");
        return;
      }

      try {
        // 1️⃣ Get the company and check if user is admin
        const res = await axios.get(
          `/api/getUserAdminCompany?oid=${session.user.oauthId}`
        );
        const { company, isAdmin } = res.data;

        if (!isAdmin || !company) {
          router.replace("/login");
          return;
        }

        setCompany(company);

        // 2️⃣ Get billing info for this company
        const billingRes = await axios.get(
          `/api/getCompanyBillingInfo?companyID=${company._id}`
        );

        const billingInfo = billingRes.data?.CompanyBillingInfo;
        if (!billingInfo || billingInfo.active === false) {
          router.replace("/login");
          return;
        }

        setBillingData(billingRes.data);

        // 3️⃣ Get admins for this company
        const adminsRes = await axios.get(
          `/api/getCompanyAdmins?companyID=${company._id}`
        )

        const admins = adminsRes.data
        if (!admins) {
          console.error("No admins found ...")
        }

        setAdmins(admins ?? null)

      } catch (e) {
        console.error("Unexpected error while fetching admin data:", e);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchAdminData();
    } else if (status === "unauthenticated") {
      router.replace("/login");
      setLoading(false);
    }
  }, [status, session, router]);

  if (loading || !company || !billingData) {
    return <Loading />;
  }

  return (
    <CompanyProvider company={company} billingData={billingData} admins={admins ?? null}>
      <CompanyAdminNavbar imgURL={company.imgURL} company={company} />
      {children}
    </CompanyProvider>
  );
}
