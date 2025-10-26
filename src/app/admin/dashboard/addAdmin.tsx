import { useCompany } from "@/contexts/CompanyContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlusSquare, FaWindowClose } from "react-icons/fa";

interface AddAdminPageProps {
  onClose: () => void;
}

const DEFAULT_NAME = "Emri";
const DEFAULT_EMAIL = "EmriMbiemri@webfaqja.com";
const DEFAULT_AVATAR =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

export function AddAdminPage({ onClose }: AddAdminPageProps) {
  const company = useCompany();

  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isValidUser, setIsValidUser] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    if (!email) {
      setUser(null);
      setIsValidUser(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get<User>(`/api/getUserByEmail?email=${email}`);
        if (res.data) {
          setUser(res.data);
          setIsValidUser(true);
        } else {
          setUser(null);
          setIsValidUser(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        setIsValidUser(false);
      }
    };

    fetchUser();
  }, [email]);

  const handleSubmit = async () => {
    if (!isValidUser || !user?._id) {
      alert("Përdoruesi i shënuar nuk ekziston.");
      return;
    }

    if (!window.confirm("A jeni të sigurt? Ky përson do të bëhet Administrator.")) {
      alert("Veprimi u anulua, nuk u bënë ndryshime.");
      return;
    }

    try {
      await axios.post("/api/addAdmin", {
        companyID: company.company?._id,
        userID: user._id,
      });
      alert("Veprimi u realizua me sukses.");
      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Ndodhi një gabim gjatë përpjekjes për të shtuar administratorin.");
    }
  };

  return (
    <>
      {/* Backdrop (dark transparent background) */}
      <div className="fixed inset-0 shadow-2xl bg-black/10 flex items-center justify-center z-50">
        {/* Popup box */}
        <div className="bg-white rounded-2xl shadow-xl p-4 w-[90%] max-w-md">
          {/* Fields & Forms */}
          <div>
            <h1 className="text-2xl font-semibold mb-4">
              Shto një Administrator
            </h1>
            <p className="text-gray-600">Email-i i personit</p>
            <input
              type="text"
              placeholder="emri@webfaqja.com"
              className="input"
              onChange={handleInputChange}
            />

            <p className="text-gray-600">Parapamja</p>

            <div className="m-2 max-h-12">
              <div className="flex bg-base-200 outline-1 outline-gray-300 rounded-md p-1">
                <img className="h-11 mr-2 rounded-lg" src={user?.image || DEFAULT_AVATAR} alt="" />
                <div>
                  <h1 className="font-montserrat font-medium">{user?.name || DEFAULT_NAME}</h1>
                  <h2 className="font-montserrat text-sm">{user?.email || DEFAULT_EMAIL}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex">
            <button onClick={handleSubmit} className="btn btn-primary ">
              {" "}
              <FaPlusSquare className="w-6 h-6" /> Përfundo
            </button>

            <button className="btn btn-error ml-4" onClick={onClose}>
              <FaWindowClose className="w-6 h-6" /> Mbyll
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
