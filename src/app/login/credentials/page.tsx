"use client";
import Navbar from "@/Components/Navbar";
import { FaKey, FaRegEnvelope, FaRegEye } from "react-icons/fa6";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function CredentialsLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<String | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
      alert("Ndodhi një gabim: " + result.error)
    } else if (result?.ok) {
      window.location.href = "/";
    }
  };

  return (
    <>
      <Navbar page="none" />
      <div className="flex justify-center items-center h-screen bg-slate-100">
        <div className="w-104 rounded-lg shadow-2xl bg-white">
          <div className="m-6">
            <h1 className="font-legacy-montserrat font-medium text-xl">
              Identifikohu ose regjistrohu
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FaRegEye className="w-8 h-8 hover:bg-black/20 p-1 rounded-lg cursor-pointer fill-gray-700" />
                  </button>
                </label>
                <p className="validator-hint hidden">
                  Ju lutëm shkruani password-in.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                className="btn btn-primary mt-4 w-72"
              >
                Identifikohu
              </button>
            </div>

            <div className="divider"></div>

            <div className="w-full flex items-center mt-4 justify-center">
              <p className="">
                Nuk ke një llogari?{" "}
                <a href="/login/register-credentials" className="link link-primary">
                  Regjistrohu!
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
