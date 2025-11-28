"use client";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCity, FaShieldHalved } from "react-icons/fa6";
import { FiZap } from "react-icons/fi";
import { IoChatbubble, IoChatbubbleOutline } from "react-icons/io5";
import { MdOutlineSupportAgent } from "react-icons/md";
import { URL } from "url";

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCity, setSearchCity] = useState("");

  return (
    <div className="bg-linear-to-r from-blue-600 to-sky-700 w-full h-80">
      <div className="flex flex-col justify-center items-center h-[100%]">
        <h1 className="text-white font-montserrat font-semibold text-4xl">
          Gjej punën e ëndrrave
        </h1>
        <h2 className="text-white opacity-90 font-semibold font-montserrat text-xl mt-3 mb-1">
          Kërkoni nga mbi 100 shpallje pune!
        </h2>
        <div className="bg-white w-[50%] h-14 mt-4 rounded-xl flex items-center">
          <div className="flex items-center">
            <label className="input m-2 whitespace-nowrap w-fit flex items-center">
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

            <label className="input m-2 flex-1 min-w-0 flex items-center">
              <FaCity className="opacity-50 h-5 w-5 mr-2" />
              <input
                type="search"
                className="grow min-w-0 bg-transparent focus:outline-none"
                placeholder="Qyteti"
                onChange={(e) => {
                  setSearchCity(e.target.value);
                }}
              />
            </label>
          </div>

          <div className="flex flex-1 justify-end items-center pr-4">
            <a
              href={`/jobs?searchTerm=${encodeURIComponent(searchTerm)}&searchCity=${encodeURIComponent(searchCity)}`}
              className="h-10 px-6 rounded-lg cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-semibold flex items-center justify-center"
              style={{ textAlign: "center" }}
            >
              Kërko
            </a>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center flex-col">
        <h1 className="font-montserrat text-4xl font-bold mt-8">
          Pse të na zgjidhni ne?
        </h1>

        <div className="flex mt-8 space-x-16">
          <div className="flex justify-center flex-col items-center">
            <div className="rounded-full bg-blue-200 w-16 h-16 flex items-center justify-center">
              <IoChatbubbleOutline className="w-10 h-10 stroke-sky-600" />
            </div>
            <h1 className="mt-2 font-montserrat font-semibold text-xl">
              Komunikim Direkt
            </h1>

            <p className="max-w-64 text-center text-gray-600 font-medium mt-2">
              Bisedo direkt me punëdhënësit pa ndërmjetës. Merr përgjigje të
              shpejta dhe të qarta.
            </p>
          </div>

          <div className="flex justify-center flex-col items-center">
            <div className="rounded-full bg-blue-200 w-16 h-16 flex items-center justify-center">
              <FiZap className="w-10 h-10 stroke-sky-600" />
            </div>
            <h1 className="mt-2 font-montserrat font-semibold text-xl">
              {" "}
              Shpejtësi
            </h1>

            <p className="max-w-64 text-center text-gray-600 font-medium mt-2">
              Apliko për punë në vetëm disa klikime. Procesi ynë i thjeshtë të
              kursen kohë të çmuar.
            </p>
          </div>
          <div className="flex justify-center flex-col items-center">
            <div className="rounded-full bg-blue-200 w-16 h-16 flex items-center justify-center">
              <FaShieldHalved className="w-10 h-10 text-sky-600" />
            </div>
            <h1 className="mt-2 font-montserrat font-semibold text-xl">
              Siguria e plotë
            </h1>

            <p className="max-w-64 text-center text-gray-600 font-medium mt-2">
              Të dhënat tuaja janë të sigurta. Ne verifikojmë të gjitha
              kompanitë për sigurinë tuaj.
            </p>
          </div>
          <div className="flex justify-center flex-col items-center">
            <div className="rounded-full bg-blue-200 w-16 h-16 flex items-center justify-center">
              <MdOutlineSupportAgent className="w-10 h-10 text-sky-600" />
            </div>
            <h1 className="mt-2 font-montserrat font-semibold text-xl">
              Mbështetje Profesionale
            </h1>

            <p className="max-w-64 text-center text-gray-600 font-medium mt-2">
              Merrni mbështetje të shpejtë dhe efikase nga ekipi ynë i dedikuar
              për të gjitha nevojat tuaja.z
            </p>
          </div>
        </div>

        <div className="flex-col flex items-center mb-24">
          <h1 className="text-4xl font-bold mt-8">Si Funksionon?</h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-600">
            Vetëm 3 hapa drejt punës së re
          </h2>

          <div className="flex flex-wrap gap-x-12">
            <div className="flex flex-col items-center mt-8">
              <div className="flex items-center justify-center rounded-full bg-sky-600 w-20 h-20">
                <h1 className="text-white font-bold text-3xl">1</h1>
              </div>
              <h1 className="mt-2 text-xl font-montserrat font-semibold">
                Regjistrohu Falas
              </h1>

              <h2 className="max-w-72 font-montserrat font-medium text-center mt-1">
                Krijo profilin tënd në vetëm disa minuta. Shto përvojën,
                aftësitë dhe preferencat e tua.
              </h2>
            </div>

            <div className="flex flex-col items-center mt-8">
              <div className="flex items-center justify-center rounded-full bg-sky-600 w-20 h-20">
                <h1 className="text-white font-bold text-3xl">2</h1>
              </div>
              <h1 className="mt-2 text-xl font-montserrat font-semibold">
                Kërko & Apliko
              </h1>

              <h2 className="max-w-72 font-montserrat font-medium text-center mt-1">
                Shfletoni mijëra punë dhe aplikoni për ato që ju përshtaten.
                Kërkoni sipas vendndodhjes dhe rrogës.
              </h2>
            </div>

            <div className="flex flex-col items-center mt-8">
              <div className="flex items-center justify-center rounded-full bg-sky-600 w-20 h-20">
                <h1 className="text-white font-bold text-3xl">3</h1>
              </div>
              <h1 className="mt-2 text-xl font-montserrat font-semibold">
                Bisedo & Fillo
              </h1>

              <h2 className="max-w-72 font-montserrat font-medium text-center mt-1">
                Komuniko direkt me punëdhënësit, bëj intervistën, dhe filloni
                një Punë të mbarë!
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
