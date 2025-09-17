"use client"
import { useSession } from "next-auth/react"
import Navbar from "@/Components/Navbar"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import Hero from "@/Components/Hero"
import Jobs from "@/Components/Jobs"
import Loading from "@/Components/Loading"

export default function Home() {
    const [userData, setUserData] = useState<any>(null)
    const { data: session, status } = useSession()

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

    if (status === "loading") {
        return (<Loading/>)
    }

    return (
        <div>
            <Navbar page="home" />
            {status === "authenticated" ? <Jobs /> : <Hero />}
        </div>
    )
}
