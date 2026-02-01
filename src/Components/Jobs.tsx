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
  latlong: Array<string>;
  thumbnail: string;
  createdAt: string;
  expiredAt?: string;
  validUntil?: string;
  salary: string;
  _id: string;
}

function getJobDateInfo(job: Job): { text: string; isFresh: boolean } {
  const createdDate = new Date(job.createdAt);
  const now = new Date();
  
  // Set times to midnight for accurate day difference
  const createdMidnight = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffInMs = nowMidnight.getTime() - createdMidnight.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays <= 3) {
    let relativeText = "";
    if (diffInDays === 0) {
      relativeText = "Postuar sot";
    } else if (diffInDays === 1) {
      relativeText = "Postuar dje";
    } else {
      relativeText = `Para ${diffInDays} ditësh`;
    }
    return { text: relativeText, isFresh: true };
  } else {
    const expirationSource = job.expiredAt || job.validUntil;
    let expDate: Date;
    
    if (expirationSource) {
      expDate = new Date(expirationSource);
    } else {
      // Fallback: If no expiration date is provided in the document,
      // default to 15 days from now to avoid showing a past date.
      expDate = new Date();
      expDate.setDate(expDate.getDate() + 15);
    }

    const day = expDate.getDate();
    const monthIndex = expDate.getMonth();
    const year = expDate.getFullYear();
    const nowYear = new Date().getFullYear();

    const albanianMonths = [
      "janar", "shkurt", "mars", "prill", "maj", "qershor",
      "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor"
    ];

    const monthName = albanianMonths[monthIndex];
    const yearSuffix = year !== nowYear ? ` ${year}` : "";

    return { text: `Përfundon me ${day} ${monthName}${yearSuffix}`, isFresh: false };
  }
}

interface JobsProps {
  Jobs?: Job[];
}

export default function Jobs({ Jobs: jobsProp }: JobsProps) {
  const [jobs, setJobs] = useState<Job[]>(jobsProp ?? []);
  const [loading, setLoading] = useState(!jobsProp);

   useEffect(() => {
    if (jobsProp) {
      setJobs(jobsProp);
      setLoading(false);
      if (!jobsProp || jobsProp.length === 0) {
        setLoading(true);
        const fetchJobs = async () => {
          try {
        const response = await axios.get("/api/getJobs");
        setJobs(response.data);
          } catch (error) {
        console.error("Error fetching jobs:", error);
          } finally {
        setLoading(false);
          }
        };
        fetchJobs();
      }
    }
  }, [jobsProp]);

  useEffect(() => {
    if (!jobsProp) {
      const fetchJobs = async () => {
        try {
          const response = await axios.get("/api/getJobs");
          setJobs(response.data);
        } catch (error) {
          console.error("Error fetching jobs:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchJobs();
    }
  }, [jobsProp]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <span className="text-lg font-medium">Një moment...</span>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white m-4 flex flex-row flex-wrap gap-4 justify-center md:justify-start">
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap"
        rel="stylesheet"
      ></link>
      {jobs.map((job: Job) => (
        <div
          key={job._id}
          className="shadow-2xl w-86 h-64 bg-white rounded-xl flex flex-col justify-between border-gray-300 border-[1px] p-6"
        >
          <div>
            <div className="flex flex-row mb-2">
              <img
                src={job.thumbnail}
                className="h-18 w-18 rounded-2xl object-contain"
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
              {(() => {
                const { text, isFresh } = getJobDateInfo(job);
                return (
                  <h2
                    style={{ color: isFresh ? "rgb(107, 114, 128)" : "#64748b" }}
                    className={`font-montserrat flex items-center text-sm ${!isFresh ? "font-medium" : ""}`}
                  >
                    <FaRegClock
                      className="mr-1 w-4 h-4"
                      style={{ fill: isFresh ? "rgb(107, 114, 128)" : "#64748b" }}
                    />
                    {text}
                  </h2>
                );
              })()}
              <h2 className="font-montserrat flex items-center text-green-600 font-semibold">
                {job.salary} €
              </h2>
            </div>
          </div>
          <a
            href={`/job/${job._id}`}
            className="w-full text-center cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded"
          >
            Më shumë
          </a>
        </div>
      ))}
    </div>
  );
}
