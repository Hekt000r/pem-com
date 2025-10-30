"use client";
import Navbar from "@/Components/Navbar";
import { useState } from "react";
import { FaCheckCircle, FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";
import { FaArrowRight, FaAt, FaBuilding, FaCircleInfo, FaLink } from "react-icons/fa6";

export default function RegisterCompany() {
  const [image, setImage] = useState(
    "https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png"
  );
  const [name, setName] = useState("Kompania");
  const [industry, setIndustry] = useState("Industria");
  const [description, setDescription] = useState(
    "Një përshkrim i shkurtër i kompanisë tuaj."
  );
  const [site, setSite] = useState("https://www.example.com");
  const [TOSAgreed, setTOSAgreed] = useState(false);

  return (
    <>
      <Navbar page="companies" />
      <div>
        <div className="m-8 bg-white flex flex-col items-center">
          <div>
            <h1 className="font-legacy-montserrat font-semibold text-3xl mt-4">
              Regjistroni një kompani
            </h1>
          </div>
          <div className="flex space-x-8">
            {/* Card 1*/}
            <div className="mt-4 flex flex-col space-y-4 max-w-86 border-1 border-gray-300 shadow-2xl  rounded-lg p-4">
              <div className="flex space-x-2 items-center">
                <div className="bg-gray-300 flex w-10 h-10 rounded-lg items-center justify-center">
                  <FaBuilding className="w-7 h-7 " />
                </div>
                <h1 className="font-legacy-montserrat font-semibold text-lg">
                  Informacionët e kompanisë
                </h1>
              </div>
              <div className="p-1">
                <div>
                  <p className="font-legacy-montserrat font-medium text-gray-500">
                    Emri i kompanisë
                  </p>
                  <input
                    type="text"
                    placeholder="Kompania ..."
                    className="input"
                  />
                </div>

                <div>
                  <p className="font-legacy-montserrat font-medium text-gray-500">
                    Industria
                  </p>
                  <input
                    type="text"
                    placeholder="Teknologji .. ndërtimtari .."
                    className="input"
                  />
                </div>

                <div>
                  <p className="font-legacy-montserrat font-medium text-gray-500">
                    Përshkrimi i kompanisë
                  </p>
                  <textarea
                    className="textarea"
                    placeholder="Një përshkrim i shkurtër i kompanisë tuaj."
                  ></textarea>
                </div>

                <div>
                  <p className="font-legacy-montserrat font-medium text-gray-500">
                    Faqja e kompanisë
                  </p>
                  <p className="font-legacy-montserrat text-sm font-medium text-gray-500">
                    Shënoni faqjen zyrtare të kompanisë. <br />
                    Mund të jetë web-faqje ose faqje në media sociale.
                  </p>
                  <label className="input">
                    <FaLink className="text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      className="grow"
                      placeholder="kompania.com ..."
                    />
                  </label>
                </div>

                <div>
                  <p className="font-legacy-montserrat font-medium text-gray-500">
                    Lokacioni i kompanisë
                  </p>
                  <label className="input">
                    <FaMapMarkerAlt className="text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      className="grow"
                      placeholder="Tiranë, Shqipëri"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Card 2*/}

            <div className="mt-4 flex flex-col space-y-4 max-w-86 border-1 border-gray-300 shadow-2xl  rounded-lg p-4">
              <div className="flex space-x-2 items-center">
                <div className="bg-gray-300 flex w-10 h-10 rounded-lg items-center justify-center">
                  <FaUserCircle className="w-7 h-7 " />
                </div>
                <h1 className="font-legacy-montserrat font-semibold text-lg">
                  Përfaqësuesi i kompanisë
                </h1>
              </div>
              <div className="p-1 flex space-y-6 flex-col">
                <div>
                  <p className="font-legacy-montserrat font-medium text-gray-500">
                    Emri dhe mbiemri
                  </p>
                  <input
                    type="text"
                    placeholder="Emri Mbiemri"
                    className="input"
                  />
                </div>

                <div>
                  <p className="font-legacy-montserrat font-medium text-gray-500">
                    E-mail-i
                  </p>
                  <p className="font-legacy-montserrat text-sm font-medium text-gray-500">
                    Përdorni email-in zyrtar të kompanisë (p.sh.
                    @punembare.com). Email jo-zyrtar lejohet vetëm në mungesë të
                    një të tilli (do të verifikohet).
                  </p>
                  <label className="input">
                    <FaAt className="text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      className="grow"
                      placeholder="emrimbiemri@kompania.com"
                    />
                  </label>
                </div>

                <div>
                  <p className="font-legacy-montserrat font-medium text-gray-500">
                    Pozita e juaj në kompani
                  </p>
                  <input
                    type="text"
                    className="input"
                    placeholder="Menaxher / CEO / ..."
                  />
                </div>

                <div className="mt-4 flex flex-row">
                  <h1 className="text-xs font-legacy-montserrat font-medium">
                    Këto informacione që keni futur do të përdoren vetëm për
                    verifikim dhe nuk do të ndahen publikisht.
                  </h1>
                </div>
              </div>
            </div>

            {/* Card 3*/}

            <div className="mt-4 flex flex-col space-y-4 max-w-86 border-1 border-gray-300 shadow-2xl  rounded-lg p-4">
              <div className="flex space-x-2 items-center">
                <div className="bg-gray-300 flex w-10 h-10 rounded-lg items-center justify-center">
                  <FaCheckCircle className="w-7 h-7 " />
                </div>
                <h1 className="font-legacy-montserrat font-semibold text-lg">
                  Parapamja dhe përfundimi
                </h1>
              </div>
              <div className="p-1">
                <div className="w-76 h-40 border-1 border-gray-300 rounded-lg">
                  <div className="m-2">
                    <div className="flex space-x-2">
                      <img
                        src={image}
                        className={`w-16 h-16 hover:bg-gray-300 border-2 border-black cursor-pointer p-1 rounded-lg`}
                        alt=""
                      />
                      <div>
                        <h1 className="font-legacy-montserrat font-semibold text-xl">
                          {name}
                        </h1>
                        <h2 className="font-legacy-montserrat font-semibold text-gray-500">
                          {industry}
                        </h2>
                      </div>
                    </div>
                    <p className="font-legacy-montserrat font-medium">
                      {description}
                    </p>
                    <div className="flex mt-2">
                      <h1 className="text-sm flex items-center">
                        <FaLink className="mr-1" /> {site}{" "}
                      </h1>
                    </div>
                  </div>
                </div>
                <p className="font-legacy-montserrat text-sm mb-4 font-medium text-gray-500">
                  Vëndoni një foto për kompaninë tuaj.
                </p>

                <div className="font-montserrat text-sm font-semibold">
                  <label className="inline-flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={(e) => setTOSAgreed(e.target.checked)}
                      className="checkbox checkbox-info align-text-top mr-1 inline-block"
                      style={{ verticalAlign: "text-top" }}
                    />
                    <span>
                      Unë pajtohem me{" "}
                      <a href="#" className="text-blue-600 underline mr-1">
                        Kushtet e Shërbimit
                      </a>
                      dhe{" "}
                      <a href="#" className="text-blue-600 underline">
                        Politikat e Privatësisë
                      </a>
                      . Gjithashtu unë pranoj që jam i autorizuar për të
                      regjistruar kompaninë.
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex justify-center">
                <button disabled={!TOSAgreed} className="btn btn-primary max-w-24"><FaArrowRight/> Mbaro</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
