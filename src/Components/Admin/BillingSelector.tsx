"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaRocket, FaBuilding, FaCrown, FaSpinner } from "react-icons/fa";

const ICON_MAP: Record<string, any> = {
  "Standard": FaRocket,
  "Pro": FaBuilding,
  "Enterprise": FaCrown
};

const COLOR_MAP: Record<string, string> = {
  "Standard": "blue",
  "Pro": "indigo",
  "Enterprise": "purple",
  "default": "blue"
};

export default function BillingSelector({ companyName }: { companyName: string }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("/api/getBillingPlans");
        setPlans(res.data);
      } catch (err) {
        console.error("Failed to fetch billing plans", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <FaSpinner className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Duke ngarkuar planet...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold font-legacy-montserrat text-gray-900 leading-tight">
          Zgjidhni një plan për kompaninë tuaj <span className="text-blue-700">{companyName}</span>
        </h2>
        <p className="text-xl text-gray-600 font-legacy-montserrat max-w-2xl mx-auto">
          Për të filluar postimin e vendeve të lira të punës, ju lutemi zgjidhni planin që i përshtatet më së miri nevojave tuaja.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
        {plans.length > 0 ? (
          plans.map((plan, idx) => {
            const Icon = ICON_MAP[plan.displayName] || FaRocket;
            const color = COLOR_MAP[plan.displayName] || COLOR_MAP.default;
            const isPopular = plan.displayName === "Pro";

            return (
              <div 
                key={plan._id || idx} 
                className={`relative flex flex-col p-8 bg-white border-2 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-full md:w-[320px] ${
                  isPopular ? 'border-blue-600 shadow-xl' : 'border-gray-100 shadow-sm'
                }`}
              >
                {isPopular && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                    Më Popullori
                  </span>
                )}

                <div className={`p-3 rounded-xl bg-${color}-50 w-fit mb-6`}>
                  <Icon className={`w-8 h-8 text-${color}-600`} />
                </div>

                <h3 className="text-2xl font-bold font-legacy-montserrat text-gray-900 mb-2">{plan.displayName}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-gray-900">€0.00</span>
                  <span className="text-gray-500">/muaj</span>
                </div>
                
                <p className="text-gray-600 mb-8 min-h-[3rem]">
                  Zgjidhja ideale për nevojat e kompanisë tuaj.
                </p>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-${color}-100 flex items-center justify-center`}>
                      <FaCheck className={`w-3 h-3 text-${color}-600`} />
                    </div>
                    <span>Deri në {plan.maxPosts} postime</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-${color}-100 flex items-center justify-center`}>
                      <FaCheck className={`w-3 h-3 text-${color}-600`} />
                    </div>
                    <span>{plan.maxAdmins} llogari administruese</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-${color}-100 flex items-center justify-center`}>
                      <FaCheck className={`w-3 h-3 text-${color}-600`} />
                    </div>
                    <span>{plan.maxMessages} mesazhe / muaj</span>
                  </li>
                </ul>

                <button 
                  className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                    isPopular 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' 
                    : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {isPopular ? "Fillo tani" : "Zgjidh Planin"}
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 italic">Asnjë plan nuk u gjet në databazë.</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => window.location.href = '/'}
        className="btn btn-outline btn-primary rounded-md px-10"
      >
        Kthehu në ballinë
      </button>

      <p className="text-gray-500 font-medium italic">
        * Pagesat procesohen në mënyrë të sigurt përmes partnerëve tanë.
      </p>
    </div>
  );
}
