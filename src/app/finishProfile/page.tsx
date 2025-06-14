"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import "./page.css";

export default function FinishProfile() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  return (
    <SessionProvider>
      {status === "authenticated" ? (
        <div className="h-screen w-screen flex justify-center items-center">
          <div className="h-[70%] w-[70%] shadow-2xl rounded-2xl">
            <div className="m-4  p-2">
              <h1 className="font_montserrat text-3xl font-semibold">
                Profili juaj është çelësi – përfundoni tani!
              </h1>
              <h2 className="font_montserrat text-xl">
                Mbaroni profilin tuaj dhe dallohuni në sytë e punëdhënësit!
              </h2>
              <div className="flex flex-col">
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
                <p className="font_montserrat">Opsionale (Maksimumi 2 mb)</p>
              </fieldset>
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
