"use client";
import Navbar from "@/Components/Navbar";
import { FaKey, FaRegEnvelope, FaRegEye } from "react-icons/fa6";
import { useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";

export default function RegisterWithCredentials() {

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<String | null>(null);

  const [TOSAgreed, setTOSAgreed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {

    const result = await axios.post(`/api/registerCredentialsUser`, {
        email, password
    })

    if (result.status === 409) { // 409 BAD_REQ conflict
        alert("Ky e-mail është regjistruar më parë.") // This E-mail is already registered
    } else if (result.status === 201) { // 201 OK Created
        alert("Llogaria u regjistrua me sukses. Ju lutem hyni me të dhënat e reja.") 
        // ^^ Account was registered successfully. Please log-in with the new credentials.

        window.location.href = "/login/credentials"
    } else {
        alert("Ndodhi një gabim gjatë krijimit: " + result.statusText)
    }
  };

  return (
    <>
      <Navbar page="none" />
      <div className="flex justify-center items-center h-screen bg-slate-100">
        <div className="w-104 rounded-lg shadow-2xl bg-white">
          <div className="m-6">
            <h1 className="font-legacy-montserrat font-medium text-xl">
              Regjistrohu
            </h1>
            <div className="divider"></div>
            <div className="flex items-center flex-col">
              <div>
                <label className="input validator w-72">
                  <FaRegEnvelope className="w-5 h-5 fill-gray-700" />
                  <input
                    type="email"
                    placeholder="emrimbiemri@faqja.com"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                  />
                </label>
                <p className="validator-hint hidden">
                  Ky email nuk është i pranueshem
                </p>
              </div>

              <div className="mt-4 relative">
                <label className="input validator w-72">
                  <FaKey className="w-5 h-5 fill-gray-700" />
                  <input
                    type="text"
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                  />
                </label>
                <p className="validator-hint hidden">
                  Ju lutëm shkruani password-in.
                </p>

                <div className="flex mt-2 font-legacy-montserrat space-x-2 text-xs max-w-64 items-center font-medium">
                  <input
                  onChange={(e) => {
                    setTOSAgreed(e.target.checked)
                  }}
                    type="checkbox"
                    className="checkbox checkbox-info"
                  ></input>{" "}
                  <span>
                    {" "}
                    Unë pajtohem me{" "}
                    <a href="#" className="text-blue-600 underline mr-1">
                      Kushtet e Shërbimit
                    </a>
                    dhe{" "}
                    <a href="#" className="text-blue-600 underline">
                      Politikat e Privatësisë
                    </a>
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="btn btn-primary mt-4 w-72"
                disabled={!TOSAgreed}
              >
                Regjistrohu
              </button>
            </div>

            <div className="divider"></div>
          </div>
        </div>
      </div>
    </>
  );
}
