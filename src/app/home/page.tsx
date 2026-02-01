"use client"
import { useSession } from "next-auth/react"
import Navbar from "@/Components/Navbar"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import Hero from "@/Components/Hero"
import Jobs from "@/Components/Jobs"
import Loading from "@/Components/Loading"

import SearchHero from "@/Components/SearchHero"

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
            {status === "authenticated" ? (
                <div className="flex flex-col">
                    <SearchHero />
                    
                    <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                        <section className="mb-12">
                            <h2 className="text-2xl font-montserrat font-bold mb-6 text-gray-800">Punët e sponsorizuara</h2>
                            <div className="flex flex-wrap justify-center gap-6 w-full">
                                {/* Sponsored Jobs Placeholders */}
                                <div className="shadow-lg w-full md:w-[calc(33.33%-1rem)] h-52 bg-white rounded-xl flex flex-col justify-between border-sky-200 border-2 p-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-sky-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                        Sponsorizuar
                                    </div>
                                    <div className="h-full flex flex-col justify-between">
                                        <div className="flex flex-row mb-2">
                                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                            </div>
                                            <div className="flex flex-col justify-start ml-3">
                                                <h1 className="font-montserrat font-semibold text-sm text-gray-400">Titulli i Pozicionit</h1>
                                                <h2 className="font-montserrat text-xs text-gray-400">Emri i Kompanisë</h2>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <h2 className="font-montserrat flex items-center text-xs text-gray-400">
                                                <div className="w-3 h-3 bg-gray-200 rounded mr-1"></div> Qyteti, Lokacioni
                                            </h2>
                                        </div>
                                        <div className="mt-auto">
                                            <h2 className="text-gray-400 font-semibold font-montserrat text-xs mb-2">--- €</h2>
                                            <div className="w-full h-8 bg-gray-100 rounded animate-pulse cursor-not-allowed"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="shadow-lg w-full md:w-[calc(33.33%-1rem)] h-52 bg-white rounded-xl flex flex-col justify-between border-sky-200 border-2 p-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-sky-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                        Sponsorizuar
                                    </div>
                                    <div className="h-full flex flex-col justify-between">
                                        <div className="flex flex-row mb-2">
                                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                            </div>
                                            <div className="flex flex-col justify-start ml-3">
                                                <h1 className="font-montserrat font-semibold text-sm text-gray-400">Titulli i Pozicionit</h1>
                                                <h2 className="font-montserrat text-xs text-gray-400">Emri i Kompanisë</h2>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <h2 className="font-montserrat flex items-center text-xs text-gray-400">
                                                <div className="w-3 h-3 bg-gray-200 rounded mr-1"></div> Qyteti, Lokacioni
                                            </h2>
                                        </div>
                                        <div className="mt-auto">
                                            <h2 className="text-gray-400 font-semibold font-montserrat text-xs mb-2">--- €</h2>
                                            <div className="w-full h-8 bg-gray-100 rounded animate-pulse cursor-not-allowed"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-montserrat font-bold mb-4 text-gray-800">Punët e reja</h2>
                            <Jobs />
                        </section>
                    </div>
                </div>
            ) : (
                <Hero />
            )}
        </div>
    )
}
