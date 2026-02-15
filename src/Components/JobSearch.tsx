"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCity } from "react-icons/fa6";
import Jobs from "./Jobs";

type JobSearchProps = {
  searchTermProp: string;
  searchCityProp: string;
};

export default function JobSearch({
  searchTermProp,
  searchCityProp,
}: JobSearchProps) {
  const [searchTerm, setSearchTerm] = useState(searchTermProp);
  const [searchCity, setSearchCity] = useState(searchCityProp);

  useEffect(() => {
        if (
      typeof searchTermProp === "string" &&
      typeof searchCityProp === "string" &&
      searchTermProp.trim() !== "" &&
      searchCityProp.trim() !== ""
    ) {
      setSearchTerm(searchTermProp);
      setSearchCity(searchCityProp);
     if (typeof window !== "undefined") {
       axios
        .get(
          `/api/searchJobs?searchTerm=${searchTermProp}&searchCity=${searchCityProp}`
        )
        .then((res) => {
          setJobs(res.data);
        });
     }
    }
  }, [searchTermProp, searchCityProp]);

  const [jobs, setJobs] = useState([]);
  return (
    <>
      <div className="w-screen h-14 bg-base-200 flex justify-center outline-1 outline-gray-300">
        <div className="flex items-center">
          <label className="input m-2 whitespace-nowrap w-fit flex items-center rounded-md">
            <svg
              className="opacity-50 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              className="w-fit bg-transparent focus:outline-none"
              placeholder="Pozicioni, kompania ..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </label>

          <label className="input m-2 flex-1 min-w-0 flex items-center rounded-md">
            <FaCity className="opacity-50 h-5 w-5 mr-2" />
            <input
              type="search"
              className="grow min-w-0 bg-transparent focus:outline-non"
              placeholder="Qyteti"
              onChange={(e) => {
                setSearchCity(e.target.value);
              }}
            />
          </label>
          <button
            onClick={() => {
              axios
                .get(
                  `/api/searchJobs?searchTerm=${searchTerm}&searchCity=${searchCity}`
                )
                .then((res) => {
                  setJobs(res.data);
                  console.table(jobs);
                });
            }}
            className="h-10 px-6  rounded-lg cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-semibold"
          >
            Kërko
          </button>
        </div>
      </div>
      <Jobs Jobs={jobs} />
    </>
  );
}
