"use client";

import { FaClock, FaCheckCircle, FaUserShield } from "react-icons/fa";
import { FaHourglassHalf } from "react-icons/fa6";

export default function PendingVerification({ companyName }: { companyName: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="bg-blue-100 p-8 rounded-full">
          <FaHourglassHalf className="w-20 h-20 text-blue-600 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
          <FaUserShield className="w-8 h-8 text-blue-800" />
        </div>
      </div>

      <div className="space-y-4 max-w-5xl">
        <h2 className="text-2xl font-bold font-legacy-montserrat text-gray-900 leading-tight text-center">
          Kompania <span className="text-blue-700">{companyName}</span> është në proces për verifikim
        </h2>
        <div className="space-y-3 text-center">
          <p className="text-xl text-gray-600 font-legacy-montserrat">
            Aplikimi juaj është pranuar dhe tani po shqyrtohet nga ekipi ynë.
          </p>
          <p className="text-gray-500 font-legacy-montserrat">
            Ne do t'ju njoftojmë me email sapo kompania juaj të verifikohet dhe të jetë gati për të postuar punë.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center space-y-3">
          <FaCheckCircle className="text-green-500 w-8 h-8" />
          <span className="font-medium">Dorëzimi i të dhënave</span>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm flex flex-col items-center space-y-3">
          <FaClock className="text-blue-500 w-8 h-8 animate-spin-slow" />
          <span className="font-medium text-blue-800">Kontrollimi i të dhenave</span>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center space-y-3 opacity-50">
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400" />
          <span className="font-medium">Aktivizimi i plotë</span>
        </div>
      </div>

      <button 
        onClick={() => window.location.href = '/'}
        className="btn btn-outline btn-primary rounded-md px-10"
      >
        Kthehu në ballinë
      </button>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
