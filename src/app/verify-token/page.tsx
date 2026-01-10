"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiAlertCircle,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import Link from "next/link";
import axios from "axios";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa6";

function VerifyTokenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "setup-password"
  >("loading");
  const [message, setMessage] = useState("Duke verifikuar llogarinë tuaj...");
  const [errorDetails, setErrorDetails] = useState("");
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Mungon kodi");
      setErrorDetails(
        "Ju lutemi sigurohuni që keni klikuar në linkun e saktë nga email-i juaj."
      );
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch("/api/companyVerifyMagicLink", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.userExists) {
            setStatus("success");
            setMessage("Kompania u verifikua me sukses!");
          } else {
            setCompanyInfo(data.company);
            setStatus("setup-password");
          }
        } else {
          setStatus("error");
          setMessage("Nuk mund të verifikohet.");
          setErrorDetails(
            data.error ||
              "Ky link mund të jetë i skaduar ose i përdorur më parë."
          );
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("Ndodhi një gabim gjatë verifikimit.");
        setErrorDetails(
          "Ju lutemi provoni përsëri më vonë ose kontaktoni ekipin tonë."
        );
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-base-100 shadow-xl rounded-2xl p-4 border border-base-300">
        <div className="text-center mb-1">
          <h1 className="text-2xl font-bold text-base-content mb-2">
            Verifikimi i email-it
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
              <FiLoader className="w-16 h-16 text-primary animate-spin" />
              <p className="font-medium text-lg animate-pulse">{message}</p>
              <div className="w-full h-1 bg-base-300 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-primary animate-progress-indeterminate w-1/2"></div>
              </div>
            </div>
          )}

          {status === "setup-password" && (
            <div className="w-full animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-6">
                <p className="font-bold text-xl mb-1">Caktoni fjalëkalimin</p>
                <p className="text-base-content/70 text-sm">
                  Për të përfunduar regjistrimin e kompanisë {companyInfo?.name}, ju
                  lutemi caktoni një fjalëkalim për llogarinë tuaj.
                </p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (password !== confirmPassword) {
                    setErrorDetails("Fjalëkalimet nuk përputhen.");
                    return;
                  }
                  if (password.length < 8) {
                    setErrorDetails(
                      "Fjalëkalimi duhet të ketë së paku 8 karaktere."
                    );
                    return;
                  }

                  setIsSubmitting(true);
                  try {
                    const res = await axios.post(
                      "/api/finishCompanyRegistration",
                      {
                        token,
                        password,
                      }
                    );
                    setStatus("success");
                  } catch (err: any) {
                    setErrorDetails(
                      err.response?.data?.error || "Ndodhi një gabim."
                    );
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="space-y-4"
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex flex-col w-full max-w-xs items-start">
                    <span className="text-gray-700 font-legacy-montserrat font-medium mb-1">
                      Email-i:
                    </span>
                    <label className="label input border-gray-300 rounded-sm validator flex items-center gap-2 w-full">
                      <FaEnvelope className="text-gray-400" />
                      <input
                        type="text"
                        className="grow"
                        value={companyInfo?.representative?.email}
                        disabled
                      />
                    </label>
                  </div>

                  <div className="flex flex-col w-full max-w-xs items-start">
                    <p className="label-text text-gray-600 mb-1">Fjalëkalimi i ri</p>
                    <label className="input rounded-sm flex items-center gap-2 w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="grow"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                        className="btn btn-ghost btn-xs"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-4 w-4" />
                        ) : (
                          <FaEye className="h-4 w-4" />
                        )}
                      </button>
                    </label>
                  </div>

                  <div className="flex flex-col w-full max-w-xs items-start">
                    <p className="label-text text-gray-600 mb-1">
                      Konfirmo fjalëkalimin
                    </p>
                    <label className="input rounded-sm flex items-center gap-2 w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="grow"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                </div>

                {errorDetails && status === "setup-password" && (
                  <p className="text-error text-sm mt-2 flex items-center gap-1">
                    <FiAlertCircle /> {errorDetails}
                  </p>
                )}

                <button
                  type="submit"
                  className={`btn btn-primary w-full mt-4 ${
                    isSubmitting ? "loading" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Duke u ruajtur..." : "Përfundo"}
                </button>
              </form>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
              <div className="bg-success/20 p-4 rounded-full">
                <FiCheckCircle className="w-20 h-20 text-success" />
              </div>
              <div className="text-center">
                <p className="font-bold text-2xl text-success mb-2">Gati!</p>
                <p className="text-base-content/70">
                  Llogaria juaj u krijua me sukses. Ekipi jonë do të kontrolloj aplikimin tuaj. Ne do t'ju informojmë përmes email-it
                </p>
              </div>
              <Link
                href="/login"
                className="btn btn-primary btn-wide mt-4 shadow-lg hover:shadow-primary/20 transition-all"
              >
                Identifikohu tani
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
              <div className="bg-error/20 p-2 rounded-full">
                <FiXCircle className="w-20 h-20 text-error" />
              </div>
              <div className="text-center">
                <p className="font-bold text-2xl text-error mb-1">{message}</p>
                <p className="text-base-content/70 text-sm px-4">
                  {errorDetails}
                </p>
              </div>
              <div className="flex flex-col w-full">
                <Link
                  href="/"
                  className="link items-center justify-center flex text-sm"
                >
                  Kthehu në ballinë
                </Link>
              </div>
            </div>
          )}
        </div>

        {status !== "loading" && (
          <div className="mt-8 pt-6 border-t border-base-200 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-base-content/50">
              <FiAlertCircle />
              <span>Nëse keni probleme, kontaktoni support@punembare.com</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress-indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
}

export default function VerifyTokenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
          <FiLoader className="w-12 h-12 text-primary animate-spin" />
        </div>
      }
    >
      <VerifyTokenContent />
    </Suspense>
  );
}
