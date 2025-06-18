"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import "./page.css";
import { useState } from "react";
import { FaDoorOpen } from "react-icons/fa6";

export default function FinishProfile() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [address, setAddress] = useState("");
  const [cv, setCV] = useState<File | null>(null);
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState("");

  return (
    <SessionProvider>
      {status === "authenticated" ? (
        <div className="h-screen w-screen flex justify-center items-center bg-radial-[at_50%_75%] from-emerald-200-200 via-green-400 to-green-900 to-90%">
          <div className="relative h-[70%] w-[70%] shadow-2xl rounded-2xl bg-white">
            <div className="m-4 p-2">
              <h1 className="font_montserrat text-3xl font-semibold">
                Profili juaj është çelësi – përfundoni tani!
              </h1>
              <h2 className="font_montserrat text-xl">
                Mbaroni profilin tuaj dhe dallohuni në sytë e punëdhënësit!
              </h2>
              <div className="flex flex-row">
                <div>
                  <fieldset className="fieldset mt-2">
                    <legend className="fieldset-legend font_montserrat">
                      Si është emri juaj?
                    </legend>
                    <input
                      type="text"
                      className="input"
                      placeholder="Shkruani emrin këtu ..."
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </fieldset>

                  <fieldset className="fieldset mt-2">
                    <legend className="fieldset-legend font_montserrat">
                      Si është mbiemri juaj?
                    </legend>
                    <input
                      type="text"
                      className="input"
                      placeholder="Shkruani mbiemrin këtu ..."
                      value={surName}
                      onChange={(e) => setSurName(e.target.value)}
                    />
                  </fieldset>

                  <fieldset className="fieldset mt-2">
                    <legend className="fieldset-legend font_montserrat">
                      Ku është adresa juaj (opsionale)?
                    </legend>
                    <input
                      type="text"
                      className="input"
                      placeholder="Shkruani adresën këtu ..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <p className="font_montserrat">Opsionale</p>
                  </fieldset>

                  <fieldset className="fieldset mt-2">
                    <legend className="fieldset-legend font_montserrat">
                      Vëndoni CV-në tuaj (Në formë PDF ose Word) (Opsionale).
                    </legend>
                    <input
                      type="file"
                      className="file-input"
                      onChange={(e) =>
                        setCV(e.target.files ? e.target.files[0] : null)
                      }
                    />
                    <p className="font_montserrat">
                      Opsionale (Maksimumi 2 mb)
                    </p>
                  </fieldset>
                </div>

                <div className="ml-12">
                  <div className="flex flex-col mt-1.5">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend font_montserrat">
                        Kur është ditëlindja juaj?
                      </legend>
                      <input
                        type="text"
                        className="input"
                        placeholder="1 janar 2003 ..."
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                      />
                    </fieldset>

                    <fieldset className="fieldset mt-2.5">
                      <legend className="fieldset-legend font_montserrat">
                        Sa vjet keni ju?
                      </legend>
                      <input
                        type="text"
                        className="input"
                        placeholder="18 ..."
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </fieldset>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4">
                <button onClick={()=>{

                }} className="btn btn-primary">Përfundo</button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              signOut();
            }}
            className="btn btn-error absolute bottom-4 right-4 rounded-xl p-1 mt-2 h-10 justify-center mr-2 pr-2"
          >
            <FaDoorOpen className="w-5 h-5" />
            <h1 className="text-md">Dil prej {session.user.email}</h1>
          </button>
        </div>
      ) : (
        <>Nje moment.....</>
      )}
    </SessionProvider>
  );
}
