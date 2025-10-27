"use client"
import Loading from "@/Components/Loading";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SuperAdminLayout ({children}: any) {
    const [loading, setLoading] = useState(false)
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)

    /* check if superadmin */
    useEffect(()=>{
        axios.get(`/api/getIsSuperAdmin`).then((res) => {
            if (res.data.superadmin == false) {
                window.location.pathname = "/"
            } else {
                setIsSuperAdmin(true)
                setLoading(false)
            }
        }) 
    },[])

    if (loading) return (
        <Loading/>
    )

    return (
        <div className="h-screen w-72 border-gray-300 border-1 shadow-2xl">
            <div className="m-4 flex flex-col space-y-2">
                <div className="shadow-md border-gray-300 border-1 w-64 h-14 rounded-md"></div>
                <div className="shadow-md border-gray-300 border-1 w-64 h-14 rounded-md"></div>
                <div className="shadow-md border-gray-300 border-1 w-64 h-14 rounded-md"></div>
            </div>
        </div>
    )
}