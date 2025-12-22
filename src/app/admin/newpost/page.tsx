"use client"
import { ForwardRefEditor } from "@/Components/ForwardRefEditor";
import { useCompany } from "@/contexts/CompanyContext";
import axios from "axios";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useState } from "react";
import { FaMapMarkerAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { FaCity, FaRegClock } from "react-icons/fa6";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { MdTitle } from "react-icons/md";
import { TbMessageCircleFilled } from "react-icons/tb";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function NewPost() {
  const { company, billingData } = useCompany();

  const [title, setTitle] = useState("Titulli");
  const [city, setCity] = useState("Qyteti");
  const [location, setLocation] = useState("Lokacioni");
  const [salary, setSalary] = useState("Rroga");

  const [description, setDescription] = useState("")


  const handleCreate = async () => {
    const jobData = {
      title,
      city,
      Location: location,
      salary,
      description,
      company_displayName: company?.displayName,
      thumbnail: company?.imgURL,
      company_id: company?._id,
      createdAt: new Date(),
    };
    try {
      console.table(jobData);
      await axios.post("/api/createJob", {
        jobData,
        companyID: company?._id,
      });
      alert("Postimi u krijua me sukses!");
      window.location.replace("/pem-admin");
    } catch (error) {
      if (isRedirectError(error)) {
        return;
      } else {
        alert("Ndodhi një gabim gjatë krijimit të postimit.");
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="m-4 p-2">
        <h1 className="font-montserrat text-2xl font-semibold">Postim i ri</h1>
      </div>

      <div className="mb-8">
        <div className="flex justify-center">
          <p className="font-montserrat">Informacioni bazë dhe parapamje</p>
        </div>
        <div className="flex justify-center items-center space-x-4">
          <div className="border-1 border-gray-300 max-w-72 h-64 mt-4 rounded-xl bg-white shadow-2xl">
            <div className="m-4 p-2 space-y-4">
              <label className="input">
                <MdTitle className="w-6 h-6" />
                <input
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  className="grow"
                  placeholder="Titulli"
                />
              </label>

              <label className="input">
                <FaCity className="w-6 h-6" />
                <input
                  type="text"
                  onChange={(e) => setCity(e.target.value)}
                  className="grow"
                  placeholder="Qyteti"
                />
              </label>

              <label className="input">
                <FaMapMarkerAlt className="w-6 h-6" />
                <input
                  type="text"
                  onChange={(e) => setLocation(e.target.value)}
                  className="grow"
                  placeholder="Lokacioni"
                />
              </label>

              <label className="input">
                <FaMoneyCheckAlt className="w-6 h-6" />
                <input
                  type="text"
                  onChange={(e) => setSalary(e.target.value)}
                  className="grow"
                  placeholder="Rroga"
                />
              </label>
            </div>
          </div>
          <div className="shadow-2xl w-86 h-64 mt-4 bg-white rounded-xl flex flex-col justify-between mr-6 border-gray-300 border-[1px] p-6">
            <div>
              <div className="flex flex-row mb-2">
                <img
                  src={company?.imgURL}
                  className="max-h-18 max-w-18 rounded-2xl"
                  alt=""
                />
                <div className="flex flex-col justify-start ml-4">
                  <h1 className="font-montserrat font-semibold mt-1">
                    {title}
                  </h1>
                  <h2 className="font-montserrat">{company?.displayName}</h2>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <h2 className="font-montserrat flex items-center">
                  <FaMapMarkerAlt className="mr-1 w-5 h-5" /> {city}, {location}
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
                  2 minuta më parë
                </h2>
                <h2 className="font-montserrat flex items-center text-green-600 font-semibold">
                  {salary} €
                </h2>
              </div>
            </div>
            <a className="w-full text-center cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded">
              Më shumë
            </a>
          </div>
        </div>
      </div>

      <div className="m-6 p-2">
        <h1 className="text-2xl font-montserrat font-semibold">
          Brendia e postimit
        </h1>
        <h2 className="font-montserrat font-medium text-gray-500">
          Përshkruaje punën, dhe përfshij sa ma shumë detaje dhe informacion.
        </h2>
        <a
          href=""
          className="font-montserrat text-blue-500 underline text-sm mt-1"
        >
          Udhëzime për krijimin e një postimi
        </a>
        <div className="flex justify-center w-full">
          <div className="border-1 m-8 ml-16 mr-16 border-gray-300 rounded-lg mt-2 w-[70%]">
            <ForwardRefEditor
              onChange={(value: string) => {
                setDescription(value);
              }}
              markdown=""
              contentEditableClassName="pose"
            />
          </div>
        </div>
      </div>
      <div className="m-6 p-2">
        <h1 className="text-2xl font-montserrat font-semibold">
          Parapamja e postimit
        </h1>
        <h2 className="font-montserrat font-medium text-gray-500">
          Shikoni se si do duket postimi juaj i plotë
        </h2>
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
                  {title}
                </h1>
                <h2 className="font-montserrat text-xl mt-2 font-medium ml-4 flex items-center">
                  <HiMiniBuildingOffice2 className="mr-2 fill-gray-500" />
                  {company?.displayName}
                </h2>
                <div className="flex">
                  <h2 className="font-montserrat text-lg mt-2 text-gray-700 ml-4 flex  items-center">
                    <FaMapMarkerAlt className="mr-2 w-5 h-5 fill-gray-500" />{" "}
                    {location}
                  </h2>
                  <h2 className="font-montserrat text-lg mt-2 text-gray-700 ml-4 flex  items-center">
                    <FaRegClock className="mr-2 w-4 h-4 fill-gray-500" /> 2
                    minuta më parë
                  </h2>
                </div>
              </div>
              <div className="ml-auto">
                <div className="bg-green-100 border-1 shadow-sm shadow-emerald-200 border-green-300 h-28 w-64 rounded-xl">
                  <div className="m-4 flex items-center">
                    <FaMoneyCheckAlt className="mr-1 fill-emerald-700 w-6 h-6" />
                    <h1 className="font-montserrat font-medium text-green-900">
                      Rroga mujore
                    </h1>
                  </div>

                  <div className="flex font-montserrat font-semibold text-emerald-900 text-3xl justify-center items-center">
                    <h1>{salary} €</h1>
                  </div>
                </div>
              </div>
            </div>
            <hr className="border-t border-gray-300 my-4" />

            <div className="markdown m-8 p-2">
              <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
            </div>

            <hr className="border-t border-gray-300 my-4" />

            <div className="mb-8 mt-8 flex flex-col justify-center items-center">
              <h1 className="text-2xl font-montserrat font-semibold">
                Jeni të interesuar?
              </h1>

              <div className="flex flex-col max-h-48 pb-8 w-100 mt-2 shadow-md border-1 border-gray-300 rounded-lg ">
                <h1 className="font-montserrat text-lg text-center font-medium mt-8">
                  Filloni një bisedë në platformën tonë!
                </h1>
                <div className="flex justify-center mt-2">
                  <button className="flex items-center justify-center w-48 text-center cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded">
                    <TbMessageCircleFilled className="mr-2" /> Bisedo tani{" "}
                  </button>
                </div>
                <p className="mx-4 mt-2 text-md text-center text-gray-600">
                  Kjo do të filloj një bisedë midis teje dhe <br />{" "}
                  {company?.displayName}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="m-6 p-2">
          <h1 className="text-2xl font-montserrat font-semibold">
            Gati për ta postuar?
          </h1>
          <button
            onClick={() => {
              const modal = document.getElementById(
                "my_modal_1"
              ) as HTMLDialogElement | null;
              if (modal) {
                modal.showModal();
              }
            }}
            className="btn btn-primary btn-lg btn-wide"
          >
            Posto
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">A jeni të sigurt?</h3>
              <p className="py-4">
                Ky postim do të jetë i dukshëm për të gjithë. Sigurohu që ke
                plotësuar informacionin siç duhet.
              </p>

              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button
                    onClick={handleCreate}
                    className="btn btn-primary mr-4"
                  >
                    Posto
                  </button>
                  <button className="btn btn-error">Mbyll</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </>
  );
}
