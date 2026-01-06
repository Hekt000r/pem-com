import { FaEnvelopeCircleCheck, FaXmark } from "react-icons/fa6";
import Link from "next/link";

interface SubmitFailProps {
  error: string;
}

export default function SubmitFail({error}: SubmitFailProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 animate-in fade-in duration-700">
      <div className="bg-red-50 p-6 rounded-full">
        <FaXmark className="w-20 h-20 text-red-800" />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-legacy-montserrat text-gray-900">
          Ka ndodhur një gabim!
        </h2>
        <p className="text-lg text-gray-600 font-legacy-montserrat max-w-md mx-auto">
          {
            error == "email-in-use" ? `Ky email është përdor më parë për regjistrimin e një kompanie.` : `Ka ndodhur një gabim i papranueshëm gjatë aplikimit.
          Ju lutëm provoni përsëri.` 
          }
        </p>
      </div>
      <p className=" text-gray-600 font-legacy-montserrat max-w-md mx-auto">
        <code>{error}</code>
      </p>
    </div>
  );
}
