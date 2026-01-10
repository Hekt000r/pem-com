import { useCompany } from "@/contexts/CompanyContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlusSquare, FaWindowClose } from "react-icons/fa";

interface AddAdminPageProps {
  onClose: () => void;
}

const DEFAULT_NAME = "Emri";
const DEFAULT_EMAIL = "EmriMbiemri@webfaqja.com";
const DEFAULT_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

export function AddAdminPage({ onClose }: AddAdminPageProps) {
  const company = useCompany();

  const [email, setEmail] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 1. Debounce the email input to save API calls
  useEffect(() => {
    if (!email || !email.includes("@")) {
      setUser(null);
      setHasSearched(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(`/api/getUserByEmail?email=${email}`);
        setUser(res.data || null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [email]);

  const handleSubmit = async () => {
    if (!user?._id) return;

    if (!window.confirm(`A jeni të sigurt? ${user.name} do të bëhet Administrator.`)) {
      return;
    }

    try {
      await axios.post("/api/addAdmin", {
        companyID: company.company?._id,
        userID: user._id,
      });

      alert("Veprimi u realizua me sukses.");
      window.location.reload(); // More reliable than href for simple state updates
    } catch (error) {
      alert("Ndodhi një gabim gjatë shtimit të administratorit.");
    }
  };

  // Determine UI State
  const isInvalid = hasSearched && !user && !isSearching;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Shto një Administrator</h1>

        {/* Input Field with DaisyUI Validation */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium text-gray-600">Email-i i personit</span>
          </label>
          <input
            type="email"
            placeholder="emri@webfaqja.com"
            className={`input input-bordered w-full transition-all ${
              isInvalid ? "input-error" : user ? "input-success" : ""
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {isSearching && <span className="loading loading-dots loading-xs mt-2 ml-2"></span>}
          {isInvalid && (
            <label className="label">
              <span className="label-text-alt text-error font-medium">Ky email nuk është i regjistruar.</span>
            </label>
          )}
        </div>

        {/* User Preview Section */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Parapamja</p>
          <div className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
            user ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200 opacity-60"
          }`}>
            <img
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              src={user?.image || DEFAULT_AVATAR}
              alt="Avatar"
            />
            <div className="overflow-hidden">
              <h1 className="font-bold text-gray-800 truncate">
                {user?.name || DEFAULT_NAME}
              </h1>
              <h2 className="text-sm text-gray-500 truncate">
                {user?.email || DEFAULT_EMAIL}
              </h2>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button 
            onClick={handleSubmit} 
            disabled={!user || isSearching}
            className="btn btn-primary flex-1 gap-2"
          >
            <FaPlusSquare className="text-lg" /> Përfundo
          </button>

          <button className="btn btn-error flex-1 gap-2" onClick={onClose}>
            <FaWindowClose className="text-lg" /> Mbyll
          </button>
        </div>
      </div>
    </div>
  );
}