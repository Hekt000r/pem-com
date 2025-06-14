"use client"
import { useSession } from "next-auth/react"
import Navbar from "@/Components/Navbar"
import { redirect } from "next/navigation"
import Jobs from "@/Components/Jobs"

export default function Home() {
    const {data: session} = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/login")
        },
    })

    return (
        <div>
            <Navbar/>
            <Jobs/>
        </div>
    )
}