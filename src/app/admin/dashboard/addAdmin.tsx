import { useCompany } from "@/contexts/CompanyContext";
import axios, { AxiosResponse } from "axios";
import { InputEvent, use, useEffect, useState } from "react";
import { FaPlusSquare, FaWindowClose } from "react-icons/fa";

interface AddAdminPageProps {
  onClose: () => void;
}

export function AddAdminPage({ onClose }: AddAdminPageProps) {
  const [name, setName] = useState("Emri");
  const [displayEmail, setDisplayEmail] = useState("EmriMbiemri@webfaqja.com");
  const [avatar, setAvatar] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
  );

  const [email, setEmail] = useState("");

  const [user, setUser] = useState<User>();

  const [isValidUser, setIsValidUser] = useState(false);

  const company = useCompany();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    /* fetch user */
    axios.get<User>(`/api/getUserByEmail?email=${email}`).then((res) => {
      if (res.data != null) {
        const user: User = res.data;

        setName(user.name);
        setDisplayEmail(user.email);
        setAvatar(user.image);
        setUser(user)

        setIsValidUser(true);
      } else {
        setName("Emri");
        setDisplayEmail("EmriMbiemri@webfaqja.com");
        setAvatar(
          "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
        );

        setIsValidUser(false);
      }
    });
  }, [email]);

  const handleSubmit = () => {
    /* make sure it's a valid user */

    if (isValidUser) {
      /* send confirm alert */

      if (
        window.confirm("A jeni të sigurt? Ky përson do të bëhet Administrator.")
      ) {
        /* add the admin */
        axios
          .post(`/api/addAdmin`, {
            companyID: company.company?._id,
            userID: user?._id,
          })
          .then((res) => {
            alert("Veprimi u realizua me sukses.");
          });
      } else {
        alert("Veprimi u anulua, nuk u bënë ndryshime.");
      }
    } else {
      /*invalid user*/
      alert("Përdoruesi i shënuar nuk ekziston.");
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
                <img className="h-11 mr-2 rounded-lg" src={avatar} alt="" />
                <div>
                  <h1 className="font-montserrat font-medium">{name}</h1>
                  <h2 className="font-montserrat text-sm">{displayEmail}</h2>
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
              <FaWindowClose className="w-6 h-6"/> Mbyll
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
