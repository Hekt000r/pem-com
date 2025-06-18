"use client"
import { useSession } from "next-auth/react"
import Navbar from "@/Components/Navbar"
import { redirect } from "next/navigation"
import Jobs from "@/Components/Jobs"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Home() {
    const [userData, setUserData] = useState<any>(null)
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/login")
        },
    })

    useEffect(() => {
        if (status === "authenticated" && session?.user?.oauthId) {
            axios
                .get(`/api/getUserByOauthId?oauthid=${session.user.oauthId}`)
                .then((res) => {
                    const user = res.data
                    setUserData(user)

                    if (user.hasProfile == false) {
                        redirect("/finishProfile")
                    }
                })
        }
    }, [status, session])

    return (
        <div>
            <Navbar />
            <Jobs />
        </div>
    )
}
