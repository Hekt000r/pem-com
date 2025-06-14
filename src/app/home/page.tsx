"use client"
import { useSession } from "next-auth/react"
import Navbar from "@/Components/Navbar"
export default function Home() {
    const {data: session} = useSession()

    return (
        <div>
            <Navbar/>
        </div>
    )
}