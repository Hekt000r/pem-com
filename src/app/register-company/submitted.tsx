import { FaEnvelopeCircleCheck } from "react-icons/fa6";
import Link from "next/link";

export default function SubmittedPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 animate-in fade-in duration-700">
      <div className="bg-blue-50 p-6 rounded-full">
        <FaEnvelopeCircleCheck className="w-20 h-20 text-blue-800" />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-legacy-montserrat text-gray-900">
          Kemi dërguar një email
        </h2>
        <p className="text-lg text-gray-600 font-legacy-montserrat max-w-md mx-auto">
          Për ta vazhduar aplikimin, kontrolloni email-in qe keni shenuar. Hapni
          email-in dhe shtypni butonin brenda.
        </p>
      </div>
      <p className=" text-gray-600 font-legacy-montserrat max-w-md mx-auto">
        Mund ta mbyllni këtë faqe pas shtypjes së butonit
      </p>
    </div>
  );
}
