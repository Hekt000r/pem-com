"use client"
import JobSearch from "@/Components/JobSearch";
import Navbar from "@/Components/Navbar";
import { useSearchParams } from "next/navigation";

export default function Jobs() {
    const searchParams = useSearchParams()
    const searchTerm = searchParams.get("searchTerm") || "";
    const searchCity = searchParams.get("searchCity") || "";

    console.table([searchCity, searchTerm])
    return (
       <>
        <Navbar page="jobs"/>
        <JobSearch searchTermProp={searchTerm} searchCityProp={searchCity}/>
       </>
    );
}