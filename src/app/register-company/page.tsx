"use client";
import Navbar from "@/Components/Navbar";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import {
  FaCheckCircle,
  FaCheckSquare,
  FaMapMarkerAlt,
  FaUserCircle,
  FaWindowClose,
} from "react-icons/fa";
import {
  FaArrowLeft,
  FaArrowRight,
  FaAt,
  FaBuilding,
  FaCircleInfo,
  FaEnvelope,
  FaLink,
} from "react-icons/fa6";
import SubmittedPage from "./submitted";
import SubmitFail from "./submit-fail";

export default function RegisterCompany() {
  const [image, setImage] = useState(
    "https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png"
  );
  const [name, setName] = useState("Kompania");
  const [industry, setIndustry] = useState("");
  const [otherIndustry, setOtherIndustry] = useState(""); // State for user input in industry modal for other industries
  const [position, setPosition] = useState("");
  const [otherPosition, setOtherPosition] = useState(""); // State for user input in position modal for other positions
  const [description, setDescription] = useState(
    "Një përshkrim i shkurtër i kompanisë tuaj."
  );
  const [site, setSite] = useState("https://www.example.com");
  const [location, setLocation] = useState("");
  const [repName, setRepName] = useState("");
  const [email, setEmail] = useState("");
  const [TOSAgreed, setTOSAgreed] = useState(false);
  const [tempImage, setTempImage] = useState("");

  const [currentStep, setCurrentStep] = useState(1); // 1-3 (4,5 aswell, those are for information. success / failure)

  const [error, setError] = useState("");

  const modalRef = useRef<HTMLDialogElement>(null);

  const INDUSTRIES = [
    "Tregtia me Pakicë / Shumicë",
    "Shërbime Profesionale / Konsultim",
    "TIK & Teknologji",
    "Shërbime ushqimore",
    "Prodhimi i Përgjithshëm",
    "Ndërtimtaria",
    "Bujqësi",
    "Turizmi dhe Akomodimi",
  ];

  const POSITIONS = [
    "Pronari / Pronare",
    "CEO / Drejtor Ekzekutiv",
    "Drejtor Menaxhues",
    "President / Kryetar",
    "Anëtar i Bordit / Drejtor",
    "Sekretar i kompanisë",
    "Përfaqësues Ligjor / Nënshkrues i autorizuar",
    "Partner",
  ];

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === "Tjetër (Specifiko)") {
      if (document) {
        (
          document.getElementById("my_modal_1") as HTMLDialogElement
        ).showModal();
      }
    } else {
      setIndustry(selected);
    }
  };

  const handleCustomIndustrySubmit = () => {
    setIndustry(otherIndustry);
    if (document) {
      (document.getElementById("my_modal_1") as HTMLDialogElement).close();
    }
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === "Tjetër (Specifiko)") {
      if (document) {
        (
          document.getElementById("my_modal_2") as HTMLDialogElement
        ).showModal();
      }
    } else {
      setPosition(selected);
    }
  };

  const handleCustomPositionSubmit = () => {
    setPosition(otherPosition);
    if (document) {
      (document.getElementById("my_modal_2") as HTMLDialogElement).close();
    }
  };

  const handleImageSubmit = () => {
    setImage(tempImage);
    if (document) {
      (document.getElementById("image_modal") as HTMLDialogElement).close();
    }
  };

  const handleFinalSubmit = async () => {
    const body = {
      name,
      industry,
      description,
      site,
      location,
      image,
      representative: { position, email, repName },
    };

    try {
      const response = await axios.post(`/api/registerCompany`, body);
      setCurrentStep(4);
    } catch (error: any) {
      setError(error.message);
      setCurrentStep(5);
    }
  };

  const getActiveStepClass = (step: number) => {
    if (step <= currentStep) {
      return `bg-blue-800 text-xl text-white`;
    } else {
      return `bg-gray-300 text-black text-lg`;
    }
  };

  const getDividerActiveClass = (step: number) => {
    if (step <= currentStep) {
      return `bg-blue-800`;
    } else return `bg-gray-400`;
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar page="companies" />

      {/* Main content area */}
      <div className="flex-1 flex justify-center p-8">
        <div className="w-[50%] h-full border-gray-400 border shadow-xl flex flex-col  rounded-md">
          {/* Select Industry Dialog */}
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Specifiko industrinë</h3>

              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Industria"
                  className="input"
                  name=""
                  id=""
                  onChange={(e) => {
                    setOtherIndustry(e.target.value);
                  }}
                />
              </div>

              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-error rounded-sm">
                    {" "}
                    <FaWindowClose className="w-6 h-6" /> Mbyll
                  </button>
                </form>
                <button
                  onClick={handleCustomIndustrySubmit}
                  className="btn btn-primary rounded-sm"
                >
                  {" "}
                  <FaCheckSquare className="w-6 h-6" />
                  Dërgo
                </button>
              </div>
            </div>
          </dialog>

          {/* Select Position Dialog */}
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Specifiko pozitën</h3>

              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Pozita"
                  className="input"
                  name=""
                  id=""
                  onChange={(e) => {
                    setOtherPosition(e.target.value);
                  }}
                />
              </div>

              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-error rounded-sm">
                    {" "}
                    <FaWindowClose className="w-6 h-6" /> Mbyll
                  </button>
                </form>
                <button
                  onClick={handleCustomPositionSubmit}
                  className="btn btn-primary rounded-sm"
                >
                  {" "}
                  <FaCheckSquare className="w-6 h-6" />
                  Dërgo
                </button>
              </div>
            </div>
          </dialog>

          {/* Update Image Dialog */}
          <dialog id="image_modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Ndrysho Logon</h3>

              <div className="mt-2">
                <input
                  type="text"
                  placeholder="URL e logos"
                  className="input input-bordered w-full"
                  value={tempImage}
                  onChange={(e) => {
                    setTempImage(e.target.value);
                  }}
                />
              </div>

              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-error rounded-sm">
                    {" "}
                    <FaWindowClose className="w-6 h-6" /> Mbyll
                  </button>
                </form>
                <button
                  onClick={handleImageSubmit}
                  className="btn btn-primary rounded-sm"
                >
                  {" "}
                  <FaCheckSquare className="w-6 h-6" />
                  Ruaj
                </button>
              </div>
            </div>
          </dialog>

          <div className="relative flex items-center px-4 pt-4">
            {/* Left: Title */}
            {/* 
            
                        <h1 className="font-legacy-montserrat font-medium text-xl">
              Regjistro një kompani
            </h1>

            Currently not using this
            */}

            {/* Center: Timeline */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2 mt-10">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex ${getActiveStepClass(
                    1
                  )} items-center justify-center rounded-full  font-medium`}
                >
                  1
                </div>
                <span className="text-sm mt-1 font-legacy-montserrat">
                  Kompania
                </span>
              </div>

              <div
                className={`w-20 h-1 ${getDividerActiveClass(
                  2
                )} rounded-xl mb-4`}
              />

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex ${getActiveStepClass(
                    2
                  )} items-center justify-center rounded-full  font-medium`}
                >
                  2
                </div>
                <span className="text-sm mt-1 font-legacy-montserrat">
                  Përfaqësuesi
                </span>
              </div>

              <div
                className={`w-20 h-1 ${getDividerActiveClass(
                  3
                )} rounded-xl mb-4`}
              />

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex ${getActiveStepClass(
                    3
                  )} items-center justify-center rounded-full  font-medium`}
                >
                  3
                </div>
                <span className="text-sm mt-1 font-legacy-montserrat">
                  Përfundimi
                </span>
              </div>
            </div>
          </div>

          <div className="divider mt-12 mb-0"></div>

          {currentStep == 1 ? (
            <>
              {/*
          ===============
          Form ..|| Step 1.
          ===============
          */}

              <div className="m-4 flex flex-col items-center space-y-8">
                <h1 className="text-xl font-legacy-montserrat font-medium">
                  Informacionet e kompanisë
                </h1>

                <div className="flex space-x-5 ">
                  <div className="flex space-y-1 flex-col">
                    <h1 className="font-medium font-legacy-montserrat w-64 text-gray-700">
                      Emri i kompanisë
                    </h1>
                    <input
                      type="text"
                      placeholder="Kompania"
                      className="input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="flex space-y-1 flex-col">
                    <h1 className="font-medium font-legacy-montserrat w-64 text-gray-700">
                      Industria
                    </h1>
                    <select
                      value={
                        INDUSTRIES.includes(industry)
                          ? industry
                          : industry
                          ? "custom"
                          : ""
                      }
                      onChange={handleIndustryChange}
                      className="select rounded-sm p-2 w-64"
                    >
                      <option value="" disabled>
                        Zgjidhni industrinë
                      </option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                      {!INDUSTRIES.includes(industry) && industry && (
                        <option value="custom">{industry}</option>
                      )}

                      <option value="Tjetër (Specifiko)">
                        Tjetër (Specifiko)
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex space-y-1 flex-col">
                    <h1 className="font-medium font-legacy-montserrat text-gray-700">
                      Përshkrimi i kompanisë
                    </h1>
                    <textarea
                      placeholder="Një përshkrim i shkurtër i kompanisë tuaj"
                      className="textarea w-132"
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex space-x-5 ">
                  <div className="flex space-y-1 flex-col">
                    <h1 className="font-medium font-legacy-montserrat w-64 text-gray-700">
                      Faqja e kompanisë
                    </h1>
                    <label className="input rounded-sm flex items-center justify-center">
                      <FaLink className="w-5 h-5 fill-gray-700" />
                      <input
                        type="url"
                        className="grow"
                        placeholder="https://www.kompania.com"
                        value={site}
                        onChange={(e) => setSite(e.target.value)}
                      />
                    </label>
                    <p className="text-sm font-legacy-montserrat text-gray-700 max-w-64">
                      Shënoni faqjen zyrtare të kompanisë, mund të jetë një
                      web-faqje ose një faqje në rrjetet sociale.{" "}
                    </p>
                  </div>

                  <div className="flex space-y-1 flex-col">
                    <h1 className="font-medium font-legacy-montserrat w-64 text-gray-700">
                      Lokacioni
                    </h1>
                    <label className="input rounded-sm flex items-center justify-center">
                      <FaMapMarkerAlt className="w-5 h-5 fill-gray-700" />
                      <input
                        type="text"
                        className="grow"
                        placeholder="Tiranë, Shqipëri"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </>
          ) : currentStep == 2 ? (
            <>
              {/*
          ===============
          Form ..|| Step 2.
          ===============
          */}

              <div className="m-4 flex flex-col items-center space-y-8">
                <h1 className="text-xl font-legacy-montserrat font-medium">
                  Informacionet e përfaqësuesit
                </h1>

                <div className="flex space-x-5 ">
                  <div className="flex space-y-1 flex-col">
                    <h1 className="font-medium font-legacy-montserrat w-64 text-gray-700">
                      Emri dhe Mbiemeri
                    </h1>
                    <input
                      type="text"
                      placeholder="Emri Mbiemri"
                      className="input"
                      value={repName}
                      onChange={(e) => setRepName(e.target.value)}
                    />
                  </div>

                  <div className="flex space-y-1 flex-col">
                    <h1 className="font-medium font-legacy-montserrat w-64 text-gray-700">
                      Pozita e juaj në kompani
                    </h1>
                    <select
                      value={
                        POSITIONS.includes(position)
                          ? position
                          : position
                          ? "custom"
                          : ""
                      }
                      onChange={handlePositionChange}
                      className="select rounded-sm p-2 w-64"
                    >
                      <option value="" disabled>
                        Zgjidhni pozitën
                      </option>
                      {POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                      {!POSITIONS.includes(position) && position && (
                        <option value="custom">{position}</option>
                      )}

                      <option value="Tjetër (Specifiko)">
                        Tjetër (Specifiko)
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex space-y-1 flex-col">
                    <h1 className="font-medium font-legacy-montserrat text-gray-700">
                      Email-i
                    </h1>
                    <label className="input validator rounded-sm w-132 flex items-center justify-center">
                      <FaEnvelope className="w-5 h-5 fill-gray-700" />
                      <input
                        type="email"
                        className="grow"
                        placeholder="emrimbiemri@kompania.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                    <p className="text-xs w-132 wrap-break-words">
                      Përdorni email-in zyrtar të kompanise (p.sh.
                      @punembare.com). Email-i jo-zyrtar (si Gmail) lejohet
                      vetëm ne mungesë te një te tilli.
                    </p>
                    <div className="validator-hint">
                      Ky email nuk eshte i pranueshem.{" "}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : currentStep == 3 ? (
            <>
              {/*
          ===============
          Form ..|| Step 3.
          ===============
          */}

              <div className="m-4 flex flex-col items-center space-y-4">
                <h1 className="text-xl font-legacy-montserrat font-medium">
                  Parapamja dhe përfundimi
                </h1>

                <div className="w-xl min-h-32 border-gray-400 shadow-lg border rounded-md">
                  <div className="m-2 flex flex-col space-x-4">
                    <div className="flex space-x-4">
                      <img
                        onClick={() => {
                          setTempImage(image);
                          if (document) {
                            (
                              document.getElementById(
                                "image_modal"
                              ) as HTMLDialogElement
                            ).showModal();
                          }
                        }}
                        src={image}
                        alt="Company Logo"
                        className="w-18 h-18 border-gray-400 border rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                        title="Kliko për të ndryshuar logon"
                      />
                      <div>
                        <h1 className="text-xl font-legacy-montserrat font-medium">
                          {name}
                        </h1>
                        <h2 className="text-md font-legacy-montserrat font-medium text-gray-800">
                          {industry}
                        </h2>
                        <div className="flex space-x-8">
                          <h1 className="flex items-center text-md mt-1">
                            <FaMapMarkerAlt className="mr-1" /> {location}{" "}
                          </h1>
                          <h1 className="flex items-center text-md mt-1">
                            <FaLink className="mr-1" />{" "}
                            <a href={site} className="link text-blue-600">
                              Faqja Zyrtare
                            </a>{" "}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="mt-3 ml-1 text-sm font-legacy-montserrat wrap-break-word">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-gray-400 border w-xl rounded-md p-2 h-18 flex space-x-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                    className="w-14 rounded-xl h-14"
                  />
                  <div>
                    <h1 className="font-legacy-montserrat text-md font-semibold">
                      {email}
                    </h1>
                    <h1 className="font-legacy-montserrat text-md">
                      {position}
                    </h1>
                  </div>
                </div>
                <div className="space-x-2 flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    onChange={(e) => {
                      setTOSAgreed(e.target.checked);
                    }}
                  />
                  <span>
                    Unë pajtohem me{" "}
                    <a href="" className="link text-blue-700">
                      Kushtët e Shërbimit
                    </a>{" "}
                    dhe{" "}
                    <a href="" className="link text-blue-700">
                      Politikat e Privatësisë
                    </a>
                  </span>
                </div>
                <button
                  onClick={handleFinalSubmit}
                  disabled={!TOSAgreed}
                  className="btn btn-primary rounded-md"
                >
                  Përfundo
                </button>
              </div>
            </>
          ) : currentStep == 4 ? (
            <SubmittedPage />
          ) : (
            <SubmitFail error={error} />
          )}

          {/* Back & Next buttons */}
          <div className="flex w-full mt-auto mb-2 justify-between pr-8 pl-8 items-center pb-4">
            <button
              onClick={() => {
                setCurrentStep(currentStep - 1);
              }}
              disabled={currentStep <= 1 || currentStep > 3}
              className="btn btn-primary rounded-full"
            >
              {" "}
              <FaArrowLeft /> Kthehu mbas
            </button>
            <button
              disabled={currentStep >= 3}
              onClick={() => {
                if (currentStep < 3) {
                  setCurrentStep(currentStep + 1);
                }
              }}
              className="btn btn-primary rounded-full"
            >
              {" "}
              Vazhdo <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
