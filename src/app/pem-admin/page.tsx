"use client";
import { useEffect, useState } from "react";
import Admin from "./admin";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Loading from "@/Components/Loading";

type Company = {
  _id: string;
};

export default function Page() {
  const { data: session, status } = useSession();
  const [company, setCompany] = useState<Company>();
  const [loading, setLoading] = useState(true);
  const [billingData, setBillingData] = useState()

  useEffect(() => {
    if (status !== "loading") {
      axios
        .get(`/api/getUserAdminCompany?oid=${session?.user.oauthId}`)
        .then((res) => {
          res.data.isAdmin ? setCompany(res.data.company) : redirect("/login");
        });
    }
  }, [status]);

  useEffect(() => {
    if (company && status !== "loading") {
      axios
        .get(`/api/getCompanyBillingInfo?companyID=${company._id}`)
        .then((res) => {
          if (res.data.CompanyBillingInfo.active == false) {
            redirect(`/login`);
          } else {
            setLoading(false);
            setBillingData(res.data)
          }
        });
    }
  }, [company, status]);

  return <>{loading ? <Loading /> : <Admin BillingData={billingData} />}</>;
}
