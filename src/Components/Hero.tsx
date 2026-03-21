"use client";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCity, FaShieldHalved } from "react-icons/fa6";
import { FiZap } from "react-icons/fi";
import { IoChatbubble, IoChatbubbleOutline } from "react-icons/io5";
import { MdOutlineSupportAgent } from "react-icons/md";
import { URL } from "url";
import SearchHero from "./SearchHero";

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCity, setSearchCity] = useState("");

  return (
   <>
    <SearchHero/>
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
    </>
  );
}
