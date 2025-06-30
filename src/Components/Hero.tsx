import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCity } from "react-icons/fa6";

export default function Hero() {
  return (
    <div className="bg-linear-to-r from-green-500 to-emerald-600 w-screen h-80">
      <div className="flex flex-col justify-center items-center h-[100%]">
        <h1 className="text-white font-montserrat font-semibold text-4xl">
          Gjej punën e ëndrrave
        </h1>
        <h2 className="text-white opacity-90 font-semibold font-montserrat text-xl mt-3 mb-1">Kërkoni nga mbi 100 shpallje pune!</h2>
        <div className="bg-white w-[50%] h-14 mt-4 rounded-xl flex items-center">
          <div className="flex items-center">
            <label className="input m-2 whitespace-nowrap w-fit flex items-center">
              <svg
                className="opacity-50 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                className="w-fit bg-transparent focus:outline-none"
                placeholder="Pozicioni, kompania ..."
              />
            </label>

            <label className="input m-2 flex-1 min-w-0 flex items-center">
              <FaCity className="opacity-50 h-5 w-5 mr-2" />
              <input
                type="search"
                className="grow min-w-0 bg-transparent focus:outline-none"
                placeholder="Qyteti"
              />
            </label>
          </div>

          <div className="flex flex-1 justify-end items-center pr-4">
            <button className="h-10 px-6  rounded-lg cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              Kërko
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
