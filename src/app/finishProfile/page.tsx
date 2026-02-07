"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import "./page.css";
import { useEffect, useState } from "react";
import {
  FaCalendar,
  FaCircleInfo,
  FaDoorOpen,
  FaUpload,
  FaWpforms,
  FaXmark,
} from "react-icons/fa6";
import axios from "axios";
import { IoDocument, IoSparkles } from "react-icons/io5";
import { ImCheckmark } from "react-icons/im";
import { MdOutlineFileUpload } from "react-icons/md";
import {
  PhoneInput,
  defaultCountries,
  parseCountry,
} from "react-international-phone";
import "react-international-phone/style.css";

const ALBANIAN_REGIONS = [
  "al",
  "xk",
  "mk",
  "me",
  "gr", // Ballkani
  "de",
  "ch",
  "it",
  "at",
  "gb",
  "be",
  "se", // Evropa
  "us",
  "ca", // Amerika
];

const filteredCountries = defaultCountries.filter((country) => {
  const { iso2 } = parseCountry(country);
  return ALBANIAN_REGIONS.includes(iso2);
});

const PREFERRED_COUNTRIES = ["al", "xk", "mk", "me", "rs", "gr"];

export default function FinishProfile() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [address, setAddress] = useState("");
  const [cv, setCV] = useState<File | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();

  const [TOSAgreed, setTOSAgreed] = useState(false);

  const [input, setInput] = useState("");
  const [hasData, setHasData] = useState(false);
  type ProfileData = {
    firstName?: string;
    surname?: string;
    age?: string;
    description?: string;
    birthday?: string;
  };
  const [data, setData] = useState<ProfileData>();

  const handleManualSubmit = () => {
    if (!firstName) {
      alert("Të lutëm shkruani emrin tuaj.");
      return;
    }
    if (!surName) {
      alert("Të lutëm shkruani mbiemrin tuaj.");
      return;
    }

    const formData = new FormData();

    formData.append("oauthid", session?.user.oauthId!);
    formData.append("profileData", JSON.stringify({ firstName, surName }));

    axios.post(`/api/createUserProfile`, formData).then((res) => {
      alert("Profili u krijua me sukses");
      router.replace("/home");
    });
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.oauthId) {
      axios
        .get(`/api/getUserByOauthId?oauthid=${session.user.oauthId}`)
        .then((res) => {
          const user = res.data;
          if (user.hasProfile == true) {
            redirect("/home");
          }
        });
    }
  }, [status, session]);

  return (
    <SessionProvider>
      {status === "authenticated" ? (
        <>
          <div className="h-screen w-screen flex justify-center items-center bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 to-100%">
            <div className="bg-white rounded-lg max-h-168 shadow-2xl border-1 border-gray-700 max-w-204 flex">
              <div className="w-2xl bg-white rounded-lg  flex">
                <div className="m-4 w-full">
                  <h1 className="text-2xl font-montserrat font-semibold w-full flex justify-center">
                    Mbaroje profilin
                  </h1>
                  <div className="flex flex-col items-center justify-center max-h-140">
                    {/* Top Panel */}
                    <div className="w-full flex flex-col pt-4 h-full">
                      <div className="flex w-full space-x-8 items-center justify-center">
                        {/* Avatar Image */}
                        <div className="flex items-center flex-col">
                          <img
                            className="w-24 h-24 rounded-full"
                            src="default_avatar.png"
                            alt=""
                          />
                          <button className="rounded-md btn w-40 btn-outline flex items-center justify-center border-gray-300 shadow-md mt-2">
                            <MdOutlineFileUpload className="w-6 h-6" /> Ngarko
                            foto
                          </button>
                        </div>

                        <div className="w-64">
                          {/* First name */}
                          <div className="form-control w-full ">
                            <label className="label flex flex-col items-start">
                              <span className="text-gray-700 font-montserrat font-semibold">
                                Emri
                              </span>
                              <input
                                type="text"
                                className="input"
                                placeholder="Emri"
                                name=""
                                id=""
                              />
                            </label>
                          </div>
                          {/*------------*/}

                          {/* Last name */}
                          <div className="form-control w-full mt-2">
                            <label className="label flex flex-col items-start">
                              <span className="text-gray-700 font-montserrat font-semibold">
                                Mbiemri
                              </span>
                              <input
                                placeholder="Mbiemri"
                                type="text"
                                className="input"
                                name=""
                                id=""
                              />
                            </label>
                          </div>
                          {/*------------*/}
                        </div>
                      </div>
                    </div>
                    {/*---*/}

                    {/* Bottom Panel */}
                    <div className="w-full pt-4 h-full flex justfiy-center flex-col space-y-4">
                      <div className="flex items-center justify-center w-full space-x-8">
                        {/* Phone Number */}
                        <div className="form-control max-w-96 mt-4">
                          <label className="label flex flex-col items-start">
                            <span className="text-gray-700 font-montserrat font-semibold">Numri i telefonit</span>
                            <PhoneInput
                              defaultCountry="al"
                              value={phoneNumber}
                              onChange={(phoneNumber) =>
                                setPhoneNumber(phoneNumber)
                              }
                              countries={filteredCountries}
                              preferredCountries={PREFERRED_COUNTRIES}
                            />
                            
                          </label>
                        </div>
                        {/*------------*/}

                        {/* Current Role */}
                        <div className="form-control w-64 mt-4">
                          <label className="label flex flex-col items-start">
                            <span className="text-gray-700 font-montserrat font-semibold">Puna aktuale</span>
                            <input
                              type="text"
                              placeholder="p.sh: Professor, i papunë, student"
                              className="input"
                              name=""
                              id=""
                            />
                          </label>
                        </div>
                        {/*------------*/}
                      </div>
                      {/* CV upload */}
                      <div className="relative group p-1 -m-1">
                        <div
                          className="flex items-center flex-col border-2 border-dashed rounded-xl border-gray-300 bg-gray-50/50 
                          transition-all duration-300 ease-out hover:border-sky-500 hover:bg-sky-50 hover:shadow-[10_0_20px_rgba(14,165,233,0.1)] 
                          cursor-pointer group-hover:-translate-y-1 active:scale-[0.98] w-full relative z-10"
                        >
                          <div className="h-36 p-6 flex flex-col items-center justify-center w-full relative z-10">
                            <div className="bg-sky-100 p-3 h-fit w-fit rounded-2xl mb-3 transition-colors duration-300 group-hover:bg-sky-600">
                              <MdOutlineFileUpload className="w-8 h-8 text-sky-600 transition-colors duration-300 group-hover:text-white" />
                            </div>
                            <h3 className="font-montserrat font-bold text-sm text-gray-800 transition-colors duration-300 group-hover:text-sky-700">
                              Ngarko CV-në tuaj
                            </h3>
                            <p className="font-montserrat font-medium text-[11px] text-gray-500 mt-1 flex items-center">
                              <IoDocument className="mr-1 w-3 h-3" /> PDF ose Word (Maks. 10MB)
                            </p>
                          </div>
                          
                          {/* Animated border/glow effect on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*---*/}
                  </div>

                  <div className="h-0.5 bg-gray-200 mt-4 rounded-2xl"></div>

                  <div className="flex flex-col items-center mt-2">
                    <div>
                      <div className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            setTOSAgreed(e.target.checked);
                          }}
                          className="checkbox checkbox-info"
                        />
                        <h1 className="font-montserrat text-sm font-semibold">
                          Unë pajtohem me{" "}
                          <a href="" className="text-blue-600 underline mr-1">
                            Kushtet e Shërbimit
                          </a>
                          dhe{" "}
                          <a href="" className="text-blue-600 underline">
                            Politikat e Privatësisë
                          </a>
                          .
                        </h1>
                      </div>
                      <p className="text-sm text-gray-400 font-montserrat font-medium">
                        E domosdoshme
                      </p>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        disabled={!TOSAgreed}
                        onClick={handleManualSubmit}
                        className="btn btn-primary mt-2"
                      >
                        <ImCheckmark className="w-6 h-6" /> Përfundo
                      </button>
                      <button
                        onClick={() => {
                          signOut().then(() => {
                            window.location.pathname = "/";
                          });
                        }}
                        className="btn btn-error mt-2"
                      >
                        <FaXmark className="w-7 h-7" /> Anulo dhe dil
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-200 w-0.5 h-120 mt-2 rounded-xl"></div>
            </div>
          </div>
        </>
      ) : (
        <>Nje moment.....</>
      )}
    </SessionProvider>
  );
}
