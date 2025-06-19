"use client"
import "@/Components/components.css"
import CompanyAdminNavbar from "@/Components/CompanyAdminNavbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/Components/Loading";
import axios from "axios";

interface Company {
    name: string,
    displayName: string,
    imgURL: string
}

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState<Company>()
    const router = useRouter();
    const {data: session} = useSession()
    useEffect(() => {
        const checkAdmin = async () => {
            if (!session || !session.user || !session.user.oauthId) {
                setLoading(false);
                router.replace("/");
                return;
            }
            try {
                const res = await axios.get(`/api/getUserAdminCompany?oid=${session.user.oauthId}`);

                setCompany(res.data)
            } catch (e) {
                router.replace("/");
                console.log(`error: ${e}`)
            } finally {
                setLoading(false);
            }
        };
        if (session) {
            checkAdmin();
        }
    }, [session]);

    if (loading) {
        return (
            <Loading/>
        );
    }
    return (
        <div>
            <CompanyAdminNavbar company={company!} imgURL={company?.imgURL!}/>
        </div>
    )
}