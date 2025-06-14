import { FaHome } from "react-icons/fa";
import { FaAddressCard, FaBriefcase } from "react-icons/fa6";

export default function Navbar() {
  return (
    <div className="h-14 flex shadow-xl">
      <div className="h-12 flex w-full m-1 p-1">
        <button className="h-10 btn btn-ghost p-1 flex">
          <img src="./Logo1.svg" className="h-10" alt="" />
        </button>
        <div className="flex h-10 w-full justify-center items-center mr-[15%]">
          <button className="h-10 btn btn-ghost p-1 flex ">
            <h1 className="justify-center h-12 flex items-center mr-2">
              <FaHome className="m-2 text-xl" /> Ballina
            </h1>
          </button>
          <button className="h-10 btn btn-ghost p-1 flex ml-2 ">
            <h1 className="justify-center h-12 flex items-center mr-2">
              <FaAddressCard className="m-2 text-xl" /> Punët
            </h1>
          </button>
          <button className="h-10 btn btn-ghost p-1 flex ml-2 ">
            <h1 className="justify-center h-12 flex items-center mr-2">
              <FaBriefcase className="m-2 text-xl" /> Kompanitë
            </h1>
          </button>
        </div>
      </div>
    </div>
  );
}
