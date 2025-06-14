"use client"
import { useSession } from "next-auth/react"
import Navbar from "@/Components/Navbar"
import { redirect } from "next/navigation"

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
        </div>
    )
}