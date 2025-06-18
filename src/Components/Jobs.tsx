"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./components.css";
import { FaMapMarkerAlt, FaMoneyCheckAlt, FaRegClock } from "react-icons/fa";

interface Job {
  title: string;
  company_id: string;
  company_displayName: string;
  Location: string;
  city: string;
  latlong: Array<string> /* Latitude | Longtitude numbers are stored as strings with decimals */;
  thumbnail: string;
  createdAt: string;
  salary: string;
  _id: string;
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} vit${interval > 1 ? "e" : ""} më parë`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} muaj më parë`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} ditë më parë`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} orë më parë`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return `${interval} minut${interval > 1 ? "a" : "ë"} më parë`;
  return "Tani";
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/getJobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="mt-8 bg-white m-4  flex flex-row flex-wrap">
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap"
        rel="stylesheet"
      ></link>
      {jobs.map((job: Job) => (
        <div
          key={job._id}
          className="shadow-2xl w-86 h-64 mt-4 bg-white rounded-xl flex flex-col justify-between mr-6 border-gray-300 border-[1px] p-6"
        >
          <div>
            <div className="flex flex-row mb-2">
              <img
                src={job.thumbnail}
                className="max-h-18 max-w-18 rounded-2xl"
                alt=""
              />
              <div className="flex flex-col justify-start ml-4">
                <h1 className="font-montserrat font-semibold mt-1">
                  {job.title}
                </h1>
                <h2 className="font-montserrat">{job.company_displayName}</h2>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <h2 className="font-montserrat flex items-center">
                <FaMapMarkerAlt className="mr-1 w-5 h-5" /> {job.city},{" "}
                {job.Location}
              </h2>
            </div>
            <div className="mt-1 ml-0.5">
              <h2
                style={{ color: "rgb(107, 114, 128)" }}
                className="font-montserrat flex items-center text-sm"
              >
                <FaRegClock
                  className="mr-1 w-4 h-4"
                  style={{ fill: "rgb(107, 114, 128)" }}
                />
                {getTimeAgo(job.createdAt)}
              </h2>
              <h2 className="font-montserrat flex items-center text-green-600 font-semibold">
                {job.salary} €
              </h2>
            </div>
          </div>
          <button className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded">
            Më shumë
          </button>
        </div>
      ))}
    </div>
  );
}
