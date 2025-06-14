"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./components.css"
import { FaMapMarkerAlt } from "react-icons/fa";

interface Job {
  title: string;
  company_id: string;
  Location: string;
  city: string;
  latlong: Array<string> /* Latitude | Longtitude numbers are stored as strings with decimals */;
  thumbnail: string;
  _id: string;
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
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>
      {jobs.map((job: Job) => (
        <div
          key={job._id}
          className="shadow-2xl w-86 h-64 mt-4 bg-white rounded-xl flex flex-col items-center mr-4"
        >
            <img src={job.thumbnail} className="max-h-34 max-w-86 rounded-2xl  p-1 ml-4 mr-4 mt-2 " alt="" />
            <div>
                <h1 className="font-montserrat font-semibold mt-1">{job.title}</h1>
            <h2 className="font-montserrat flex items-center"><FaMapMarkerAlt className="mr-1 w-5 h-5"/> {job.city}, {job.Location}</h2>
            <button className="btn btn-primary mt-2 w-full">Më shumë</button>
            </div>
        </div>
      ))}
    </div>
  );
}
