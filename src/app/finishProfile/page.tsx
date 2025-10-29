"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import "./page.css";
import { useEffect, useState } from "react";
import {
  FaCalendar,
  FaCircleInfo,
  FaDoorOpen,
  FaWpforms,
  FaXmark,
} from "react-icons/fa6";
import axios from "axios";
import { IoDocument, IoSparkles } from "react-icons/io5";
import { ImCheckmark } from "react-icons/im";

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
            <div className="bg-white rounded-lg shadow-2xl border-1 border-gray-700 max-w-204 flex">
              <div className="h-132 w-86 bg-white rounded-lg  flex">
                <div className="m-4 w-full">
                  <h1 className="text-2xl font-montserrat font-semibold w-full flex justify-center">
                    Mbaroje profilin
                  </h1>
                  <div className="flex w-full flex-col items-center justify-start">
                    <div className="mt-8">
                      <h1 className="font-montserrat font-semibold text-gray-500 text-sm mb-1">
                        Emri juaj
                      </h1>
                      <input
                        type="text"
                        placeholder="Emri"
                        className="input w-72"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="mt-8">
                      <h1 className="font-montserrat font-semibold text-gray-500 text-sm mb-1">
                        Mbiemri juaj
                      </h1>
                      <input
                        type="text"
                        placeholder="Mbiemri"
                        className="input w-72"
                        onChange={(e) => setSurName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-start">
                    <div className="mt-8">
                      <h1 className="font-montserrat font-semibold text-gray-500 text-sm mb-1">
                        Përshkrimi (opsional)
                      </h1>
                      <textarea
                        className="textarea w-72"
                        placeholder="Unë jam ... kam studiar në ... kam punuar në .."
                        onChange={(e) => {
                          setInput(e.target.value);
                        }}
                      ></textarea>
                    </div>
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
