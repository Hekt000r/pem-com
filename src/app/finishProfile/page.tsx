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
} from "react-icons/fa6";
import axios from "axios";
import { IoDocument, IoSparkles } from "react-icons/io5";

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
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState("");

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

  const [creationType, setCreationType] = useState(false); // true = create with AI, false = create manually

  const handleManualSubmit = () => {
    if (!firstName) {
      alert("Të lutëm shkruani emrin tuaj.");
      return
    }
    if (!surName) {
      alert("Të lutëm shkruani mbiemrin tuaj.");
      return
    }
    if (!age) {
      alert("Të lutëm shkruani moshën tuaj.");
      return
    }
    if (!birthday) {
      alert("Të lutëm shkruani ditëlindjen tuaj.");
      return
    }

    const formData = new FormData();

    formData.append("oauthid", session?.user.oauthId!);
    formData.append(
      "profileData",
      JSON.stringify({ firstName, surName, birthday, age })
    );

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

  const handleGenerate = async () => {
    // send API request to AI generate profile
    axios.get(`/api/profileAIGenFunction?input=${input}`).then((res) => {
      setData(res.data);
      setHasData(true);
      if (data?.firstName == "missing") {
        alert("Të lutem tregoni emrin")
        return
      }
      if (data?.surname == "missing") {
        alert("Të lutem tregoni mbiemrin")
        return
      }
      if (data?.age == "missing") {
        alert("Të lutem tregoni moshën")
        return

      }
      if (data?.birthday == "missing") {
        alert("Të lutem tregoni ditëlindjen")
        return
      }

      const formData = new FormData()

      formData.append("oauthid", session?.user.oauthId!)
      formData.append("profileData", JSON.stringify({
        firstName: data?.firstName,
        surname: data?.surname,
        age: data?.age,
        birthday: data?.birthday
      }))

      axios.post(`/api/createUserProfile`, formData).then((res)=>{
        alert("profili u krijua me sukses!")
        router.replace("/home")
      })
      
    });
  };

  return (
    <SessionProvider>
      {status === "authenticated" ? (
        <>
          <div className="h-screen w-screen flex justify-center items-center bg-radial-[at_50%_75%] from-emerald-200-200 via-green-400 to-green-900 to-90%">
            <div className="h-[80%] w-[80%] bg-white rounded-3xl shadow-2xl flex">
              <div className="m-8 flex-1">
                <h1 className="font-montserrat text-3xl font-semibold">
                  Mbaroni profilin
                </h1>
                <div className="flex flex-col w-64">
                  <button
                    onClick={() => {
                      setCreationType(true);
                    }}
                    className="btn btn-lg bg-emerald-10 border-1 border-emerald-300 bg-emerald-100 text-emerald-700 mt-4"
                  >
                    {" "}
                    <IoSparkles /> Krijo profilin me AI
                  </button>
                  <button
                    onClick={() => {
                      setCreationType(false);
                    }}
                    className="btn btn-lg mt-4"
                  >
                    {" "}
                    <IoDocument /> Krijo profilin vet
                  </button>
                </div>
              </div>
              <div className=" w-[70%] border-1 border-gray-300 h-full rounded-3xl">
                {creationType ? (
                  <>
                    {/* AI-based creation */}
                    <div className="w-full">
                      <div className="flex justify-center mt-4 w-full">
                        <h1 className="font-montserrat text-3xl font-medium">
                          Krijo profilin me AI
                        </h1>
                      </div>
                      <div className="m-8">
                        <h2 className="font-montserrat font-medium text-gray-500 flex flex-row">
                          {" "}
                          <FaCircleInfo className="w-8 h-8 mr-2" /> Përfshini sa
                          më shumë informacion që mundeni, si emri dhe mbiemri
                          juaj, data e lindjes, përvoja juaj në punë, arsimi
                          juaj, gjuhët që flisni, etj. Kur jeni gati, shtypni
                          "Gjenero". Nese jeni të kenaqur, shtypni "Mbaro"
                        </h2>

                        <div className="mt-1">
                          <textarea
                            className="textarea w-full"
                            rows={4}
                            placeholder="Emri im eshtë ... mbiemri im eshtë ... kam studiar ne ... kam lindur me ..."
                            onChange={(e) => {
                              setInput(e.target.value);
                            }}
                          ></textarea>
                        </div>

                        <button
                          onClick={async () => {
                            await handleGenerate();
                          }}
                          className="btn bg-emerald-10 border-1 border-emerald-300 bg-emerald-100 text-emerald-700 mt-4"
                        >
                          Gjenero
                        </button>
                        <button
                          onClick={async () => {
                            await handleGenerate()
                          }}
                          className="btn bg-emerald-10 border-1 ml-4 mt-4"
                        >
                          Mbaro
                        </button>

                        <h2 className="font-montserrat font-medium mt-2 text-2xl">
                          Rezultati
                        </h2>
                        <div className="mt-4 flex">
                          <img
                            className="w-24 h-24 rounded-full"
                            src={session?.user?.image!}
                            alt=""
                          />
                          <div className="flex-1">
                            <h1 className="font-montserrat text-2xl mt-3 ml-2">
                              {hasData ? data?.firstName : "Emri Mbiemri"}
                            </h1>
                            <h2 className="flex text-gray-600 mt-1 ml-2 items-center">
                              {" "}
                              {hasData ? data?.age : ".."} vjecar
                            </h2>
                          </div>
                          <div className="rounded-2xl outline-1 outline-gray-400 w-[60%] h-40 p-2">
                            {hasData ? data?.description : ".."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Manual Creation */}
                    <div className="w-full relative pb-24">
                      <div className="flex justify-center mt-4 w-full">
                        <h1 className="font-montserrat text-3xl font-medium">
                          Krijoni profilin
                        </h1>
                      </div>

                      <div className="m-4 flex">
                        <div className="flex-1">
                          <h2 className="font-montserrat text-xl font-medium">
                            Informacioni i domosdoshme
                          </h2>
                          <div>
                            <div className="flex flex-col mt-1">
                              <p className="text-gray-600 font-montserrat text-sm font-medium">
                                Emri
                              </p>
                              <input
                                onChange={(e) => {
                                  setFirstName(e.target.value);
                                }}
                                type="text"
                                className="input"
                              />
                            </div>
                            <div className="flex flex-col mt-1">
                              <p className="text-gray-600 font-montserrat text-sm font-medium">
                                Mbiemri
                              </p>
                              <input
                                onChange={(e) => {
                                  setSurName(e.target.value);
                                }}
                                type="text"
                                className="input"
                              />
                            </div>
                            <div className="flex flex-col mt-1">
                              <p className="text-gray-600 font-montserrat text-sm font-medium">
                                Mosha
                              </p>
                              <input
                                onChange={(e) => {
                                  setAge(e.target.value);
                                }}
                                type="text"
                                className="input"
                              />
                            </div>
                            <div className="flex flex-col mt-1">
                              <p className="text-gray-600 font-montserrat text-sm font-medium">
                                Ditëlindja
                              </p>
                              <input
                                onChange={(e) => {
                                  setBirthday(e.target.value);
                                }}
                                type="text"
                                placeholder="1 janar 2000 ..."
                                className="input"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="w-[45%] mr-8">
                          <h2 className="font-montserrat font-medium text-xl">
                            Përshkrimi
                          </h2>
                          <textarea
                            placeholder="Une jam .. kam lindur me ...."
                            className="w-full h-full p-2 mr-12 rounded-2xl outline-1 outline-gray-400"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={() => {
                            handleManualSubmit();
                          }}
                          className="btn btn-lg bg-emerald-10 border-1 border-emerald-300 bg-emerald-100 text-emerald-700 mt-4"
                        >
                          Mbaro
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>Nje moment.....</>
      )}
    </SessionProvider>
  );
}
