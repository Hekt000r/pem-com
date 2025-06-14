"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import "./page.css";
import { useState } from "react";

export default function FinishProfile() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  const [birthdate, setBirthdate] = useState("");

  return (
    <SessionProvider>
      {status === "authenticated" ? (
        <div className="h-screen w-screen flex justify-center items-center bg-radial-[at_50%_75%] from-emerald-200-200 via-green-400 to-green-900 to-90%">
          <div className="h-[70%] w-[70%] shadow-2xl rounded-2xl bg-white">
            <div className="m-4  p-2">
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
                    />
                    <p className="font_montserrat">Opsionale</p>
                  </fieldset>
                  <fieldset className="fieldset mt-2">
                    <legend className="fieldset-legend font_montserrat">
                      Vëndoni CV-në tuaj (Në formë PDF ose Word) (Opsionale).
                    </legend>
                    <input type="file" className="file-input" />
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
                    />
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>Nje moment.....</>
      )}
    </SessionProvider>
  );
}
