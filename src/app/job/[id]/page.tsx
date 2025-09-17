"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import "@/Components/components.css";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaRegClock } from "react-icons/fa6";
import { FaMapMarkerAlt, FaMoneyCheckAlt } from "react-icons/fa";

import "@/Components/markdown.css"
import Markdown from "react-markdown";
import Navbar from "@/Components/Navbar";
import { TbMessageCircleFilled } from "react-icons/tb";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

type Company = {
  displayName: string;
  imgURL: string;
  _id: string;
};

type Job = {
  title: string;
  createdAt: Date;
  Location: string;
  salary: string;
  description: string;
};

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

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>; // params is now a Promise
}) {
  const { id } = React.use(params); // unwrap params with React.use()
  const [company, setCompany] = useState<Company>();
  const [job, setJob] = useState<Job>();
  const {data: session, status } = useSession()

  const handleConvoStart = () => {
    axios.get(`/api/startConvo?userOID=${session?.user.oauthId}&companyOID=${company?._id}`).then((res) => {
      if (res.data.convoId) {
        redirect(`/chats?jumpTo=${res.data.convoId}`)
      }
    })
  }

  useEffect(() => {
    axios.get(`/api/getCompanyByJobID?jobID=${id}`).then((res) => {
      setCompany(res.data);
    });

    axios.get(`/api/getJobByID?id=${id}`).then((res) => {
      setJob(res.data);
    });
  }, [id]);

  return (
    <>
    <Navbar page="jobs"/>
      <div className="flex justify-center">
        <div className="shadow-2xl w-[70%] rounded-xl mt-4 border-1 mb-8 border-gray-300">
          <div className="m-8 flex">
            <img
              className="w-28 h-28 rounded-lg"
              src={company?.imgURL}
              alt=""
            />
            <div className="flex flex-col">
              <h1 className="font-montserrat text-2xl mt-2 font-semibold ml-4">
                {job?.title}
              </h1>
              <h2 className="font-montserrat text-xl mt-2 font-medium ml-4 flex items-center">
                <HiMiniBuildingOffice2 className="mr-2 fill-gray-500" />
                {company?.displayName}
              </h2>
              <div className="flex">
                <h2 className="font-montserrat text-lg mt-2 text-gray-700 ml-4 flex  items-center">
                  <FaMapMarkerAlt className="mr-2 w-5 h-5 fill-gray-500" />{" "}
                  {job?.Location}
                </h2>
                <h2 className="font-montserrat text-lg mt-2 text-gray-700 ml-4 flex  items-center">
                  <FaRegClock className="mr-2 w-4 h-4 fill-gray-500" />{" "}
                  {job?.createdAt
                    ? getTimeAgo(job.createdAt.toString())
                    : "Tani"}
                </h2>
              </div>
            </div>
            <div className="ml-auto">
              <div className="bg-green-100 border-1 shadow-sm shadow-emerald-200 border-green-300 h-28 w-64 rounded-xl">
                <div className="m-4 flex items-center">
                  <FaMoneyCheckAlt className="mr-1 fill-emerald-700 w-6 h-6" />
                  <h1 className="font-montserrat font-medium text-emerald-900">
                    Rroga mujore
                  </h1>
                </div>

                <div className="flex font-montserrat font-semibold text-emerald-900 text-3xl justify-center items-center">
                  <h1>{job?.salary} €</h1>
                </div>
              </div>
            </div>
          </div>
          <hr className="border-t border-gray-300 my-4" />

          <div className="markdown m-8 p-2">
            <Markdown >
              {job?.description}
            </Markdown>
          </div>

          <hr className="border-t border-gray-300 my-4" />

          <div className="mb-8 mt-8 flex flex-col justify-center items-center">
            <h1 className="text-2xl font-montserrat font-semibold">Jeni të interesuar?</h1>

            <div className="flex flex-col max-h-48 pb-8 w-100 mt-2 shadow-md border-1 border-gray-300 rounded-lg ">
              <h1 className="font-montserrat text-lg text-center font-medium mt-8">Filloni një bisedë në platformën tonë!</h1>
              <div className="flex justify-center mt-2">
                 <button onClick={() => {
                  handleConvoStart()
                 }} className="flex items-center justify-center w-48 text-center cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded"><TbMessageCircleFilled className="mr-2"/> Bisedo tani </button>
              </div>
              <p className="mx-4 mt-2 text-md text-center text-gray-600">Kjo do të filloj një bisedë midis teje dhe <br /> {company?.displayName}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
