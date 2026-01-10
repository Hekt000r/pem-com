"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/Components/Loading";
import { FaMapMarkerAlt, FaGlobe, FaEnvelope, FaUser, FaBuilding, FaCheck, FaTimes, FaInfoCircle } from "react-icons/fa";
import "@/Components/components.css";

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} vit${interval > 1 ? "e" : ""} më parë`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} muaj më parë`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} ditë më parë`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} orë më parë`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return `${interval} minut${interval > 1 ? "a" : "ë"} më parë`;
  return "Tani";
}

export default function CompanyApplications() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [modalType, setModalType] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/getPendingCompanies");
        setCompanies(res.data);
      } catch (err) {
        console.error("Failed to fetch pending companies:", err);
        setError("Dështoi ngarkimi i aplikimeve. Ju lutem provoni përsëri.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedCompany || !modalType) return;

    setIsProcessing(true);
    try {
      await axios.post("/api/updateCompanyStatus", {
        companyID: selectedCompany._id,
        status: modalType,
      });

      // Remove from local list
      setCompanies((prev) => prev.filter((c) => c._id !== selectedCompany._id));
      
      // Close modal
      setSelectedCompany(null);
      setModalType(null);
      setDeclineReason("");
    } catch (err) {
      console.error("Error updating company status:", err);
      alert("Ndodhi një gabim gjatë përditësimit të statusit.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 w-full font-montserrat font-medium">
      <div className="mb-8 ml-2">
        <h1 className="text-3xl font-bold text-gray-800">
          Mirësevini përsëri, Admin! 👋
        </h1>
        <p className="text-gray-700 mt-2">
          Këtu mund të gjeni të gjitha aplikimet e reja nga kompanitë që presin shqyrtim.
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-6 rounded-md text-white">
          <span>{error}</span>
        </div>
      )}

      {companies.length === 0 ? (
        <div className="text-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-xl shadow-sm">
          <FaBuilding className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600">Nuk ka aplikime në pritje për momentin.</p>
        </div>
      ) : (
        <div className="columns-1 xl:columns-2 gap-6 pb-10 [column-fill:_balance]">
          {companies.map((company) => (
            <div
              key={company._id.toString()}
              className="break-inside-avoid-column mb-6 shadow-2xl bg-white rounded-xl flex flex-col border-gray-300 border-[1px] p-6 hover:border-blue-200 transition-colors"
            >
              <div className="flex-1">
                {/* Header: Logo & Title */}
                <div className="flex flex-row mb-6">
                  {company.imgURL ? (
                    <img
                      src={company.imgURL}
                      className="h-16 w-16 min-w-16 rounded-2xl object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="h-16 w-16 min-w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                      <FaBuilding className="text-2xl" />
                    </div>
                  )}
                  <div className="flex flex-col justify-center ml-4 overflow-hidden">
                    <h1 className="font-bold text-xl truncate leading-tight text-gray-900">
                      {company.displayName}
                    </h1>
                    <h2 className="text-sm text-gray-600 truncate italic">{company.name}</h2>
                    <h3 className="text-sm text-gray-700 truncate">{company.industry}</h3>
                  </div>
                  <div className="ml-auto flex items-start">
                    <span className="badge badge-warning font-bold text-white text-[10px] rounded-sm py-3 px-3">PENDING</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-4">
                  {/* Company Info */}
                  <div className="flex flex-col space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-1">Detajet</h3>
                    <div className="flex items-center text-sm text-gray-800">
                      <FaMapMarkerAlt className="mr-3 w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{company.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-800">
                      <FaGlobe className="mr-3 w-4 h-4 text-blue-600 flex-shrink-0" />
                      <a href={company.site} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-bold hover:underline truncate">
                        {company.site?.replace(/^https?:\/\//, "") || "No Website"}
                      </a>
                    </div>
                  </div>

                  {/* Representative Info */}
                  <div className="flex flex-col space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-1">Përfaqësuesi</h3>
                    <div className="flex items-center text-sm text-gray-900 font-bold">
                      <FaUser className="mr-3 w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{company.representative?.repName || "I panjohur"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-800">
                      <FaEnvelope className="mr-3 w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{company.representative?.email || "Nuk ka email"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-2">
                   <p className="text-xs text-gray-600 italic leading-relaxed line-clamp-2">
                     {company.description || "Nuk ka përshkrim për këtë kompani."}
                   </p>
                </div>

                {company.adminNotes && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                    <h4 className="text-[10px] font-bold text-red-700 uppercase mb-1">Shënime nga Admin:</h4>
                    <p className="text-xs text-red-900 leading-relaxed font-semibold">
                      {company.adminNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end">
                <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                  <FaInfoCircle className="w-3 h-3" /> Dorëzuar: {getTimeAgo(company.lifecycle?.submittedAt?.toString() || new Date().toISOString())}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => {
                    setSelectedCompany(company);
                    setModalType("APPROVED");
                  }}
                  className="btn btn-success btn-sm text-white rounded-md font-bold flex items-center justify-center gap-1 border-none"
                >
                  <FaCheck className="w-3 h-3" /> Mirato
                </button>
                <button 
                  onClick={() => {
                    setSelectedCompany(company);
                    setModalType("REJECTED");
                  }}
                  className="btn btn-error btn-sm text-white rounded-md font-bold flex items-center justify-center gap-1 border-none"
                >
                  <FaTimes className="w-3 h-3" /> Refuzo
                </button>
                <button className="btn btn-warning btn-sm text-white rounded-md font-bold flex items-center justify-center gap-1 text-[10px] border-none leading-tight">
                  <FaInfoCircle className="w-3 h-3" /> Kerko dhëna
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {selectedCompany && (
        <div className="modal modal-open">
          <div className="modal-box bg-white rounded-xl shadow-2xl p-6">
            <h3 className="font-bold text-xl text-gray-800">
              {modalType === "APPROVED" ? "Mirato Kompaninë" : "Refuzo Kompaninë"}
            </h3>
            <p className="py-4 text-gray-600">
              {modalType === "APPROVED" 
                ? `Jeni të sigurt që dëshironi të miratoni kompaninë "${selectedCompany.displayName || selectedCompany.name}"?`
                : `Jeni të sigurt që dëshironi të refuzoni kompaninë "${selectedCompany.displayName || selectedCompany.name}"?`
              }
            </p>

            {modalType === "REJECTED" && (
              <div className="mb-4">
                <label className="label text-xs font-bold text-gray-500 uppercase">Arsyeja e refuzimit</label>
                <textarea 
                  className="textarea textarea-bordered w-full h-24 rounded-md focus:border-red-400 outline-none text-gray-800 font-medium"
                  placeholder="Ju lutemi përshkruani arsyen e refuzimit..."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  required
                ></textarea>
                {!declineReason.trim() && (
                  <p className="text-[10px] text-error mt-1 font-bold italic">* Kjo fushë është e detyrueshme</p>
                )}
              </div>
            )}

            <div className="modal-action flex gap-2">
              <button 
                className="btn btn-error btn-outline rounded-md font-bold flex items-center gap-2"
                onClick={() => {
                  setSelectedCompany(null);
                  setModalType(null);
                  setDeclineReason("");
                }}
                disabled={isProcessing}
              >
                <FaTimes /> Anulo
              </button>
              <button 
                className={`btn ${modalType === "APPROVED" ? "btn-success" : "btn-error"} text-white rounded-md font-bold border-none px-8`}
                onClick={handleUpdateStatus}
                disabled={isProcessing || (modalType === "REJECTED" && !declineReason.trim())}
              >
                {isProcessing ? "Duke u ruajtur..." : (modalType === "APPROVED" ? "Mirato" : "Refuzo")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
