"use client"
import { useCompany } from "@/contexts/CompanyContext"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { BsMegaphoneFill } from "react-icons/bs";
import { FaListAlt, FaPlusSquare } from "react-icons/fa";
import { FaBell, FaGraduationCap, FaMessage } from "react-icons/fa6";
import { IoChatbubble } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";

export default function Page() {

    const {data: session,status} = useSession()
    const {company, billingData, admins} = useCompany()

    return (
        <div>
          <div className="p-4 m-4">
            <div>
              <h1 className="font-montserrat text-3xl font-semibold">
                Përshëndetje, {session?.user.name} !
              </h1>
              <h2 className="text-gray-700 text-lg mt-2">
                Menaxho kompaninë, krijo postime, ose bisedo me klientët.
              </h2>
            </div>
    
            <div className="flex space-x-8 ml-8">
              <div className="flex justify-center items-center mt-8 space-x-12 flex-wrap">
                <div className="lg:flex lg:space-x-10">
                  <div className="shadow-md h-56 w-[40rem] mt-2 border-[1px] border-gray-300 rounded-2xl ">
                    <div className="m-4">
                      <div className="grid grid-flow-col auto-rows-max grid-rows-3 gap-y-6 gap-x-8">
                        {/* Plan Overview */}
    
                        <div className="flex">
                          <img
                            className="w-13 mr-2 rounded-lg h-13"
                            src={company?.imgURL}
                            alt="Company Logo"
                          />
                          <div className="flex flex-col">
                            <h1 className="text-xl font-montserrat font-semibold">
                              {company?.displayName}
                            </h1>
                            <h2 className="font-montserrat font-medium">
                              Plani: {billingData?.BillingPlanInfo.displayName}
                            </h2>
                          </div>
                        </div>
    
                        {/* Active Admins*/}
    
                        <div className="flex">
                          <MdAdminPanelSettings className="w-10 mr-2 bg-gray-300 rounded-lg h-10" />
                          <div className="flex flex-col">
                            <h1 className="text-md font-montserrat font-medium">
                              Adminët aktiv ({billingData?.CompanyBillingInfo.admins}
                              /{billingData?.BillingPlanInfo.maxAdmins})
                            </h1>
    
                            <progress
                              value={billingData?.CompanyBillingInfo.admins}
                              max={billingData?.BillingPlanInfo.maxAdmins}
                              className="progress progress-primary w-56 mt-1"
                            />
                          </div>
                        </div>
    
                        {/* Messages this month */}
                        <div className="flex">
                          <div className="w-10 mr-2 flex items-center justify-center bg-gray-300 rounded-lg h-10">
                            <FaMessage className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col">
                            <h1 className="text-md font-montserrat font-medium">
                              Mesazhet këtë muaj (
                              {billingData?.CompanyBillingInfo.messages}/
                              {billingData?.BillingPlanInfo.maxMessages})
                            </h1>
    
                            <progress
                              value={billingData?.CompanyBillingInfo.messages}
                              max={billingData?.BillingPlanInfo.maxMessages}
                              className="progress progress-primary w-56 mt-1"
                            />
                          </div>
                        </div>
    
                        {/* Change Plan*/}
                        <div className="btn btn-primary">Ndrysho planin</div>
    
                        {/* Total Posts*/}
    
                        <div className="flex">
                          <div className="w-10 mr-2 flex items-center justify-center bg-gray-300 rounded-lg h-10">
                            <FaListAlt className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col">
                            <h1 className="text-md font-montserrat font-medium">
                              Postimet këtë muaj (
                              {billingData?.CompanyBillingInfo.posts}/
                              {billingData?.BillingPlanInfo.maxPosts})
                            </h1>
    
                            <progress
                              value={billingData?.CompanyBillingInfo.posts}
                              max={billingData?.BillingPlanInfo.maxPosts}
                              className="progress progress-primary w-56 mt-1"
                            />
                          </div>
                        </div>
    
                        {/* Conversations this month */}
                        <div className="flex">
                          <div className="w-10 mr-2 flex items-center justify-center bg-gray-300 rounded-lg h-10">
                            <BsMegaphoneFill className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col">
                            <h1 className="text-md font-montserrat font-medium">
                              Reklama këtë muaj (
                              {billingData?.CompanyBillingInfo.ads}/
                              {billingData?.BillingPlanInfo.maxAds})
                            </h1>
    
                            <progress
                              value={billingData?.CompanyBillingInfo.ads}
                              max={billingData?.BillingPlanInfo.maxAds}
                              className="progress progress-primary w-56 mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    
              <div className="flex justify-center items-center mt-8 space-x-12 flex-wrap">
                <div className="lg:flex lg:space-x-10">
                  <div className="shadow-md h-56 w-[40rem] mt-2 border-[1px] border-gray-300 rounded-2xl ">
                    <div className="m-6">
                      <div className="flex items-center">
                        <h1 className="text-2xl mr-4 font-montserrat font-medium">
                          Adminët
                        </h1>
                        <button className="btn btn-primary">
                          <FaPlusSquare className="w-6 h-6" /> Shto një admin
                        </button>
                      </div>
    
                      <div className="m-2 outline-gray-400 outline-1 rounded-xl h-32 grid grid-cols-2 overflow-y-auto">
                        {/**/}
                        {admins?.map((admin: any, key: any) => (
                          <div key={admin} className="m-2 max-h-12">
                            <div className="flex bg-base-200 outline-1 outline-gray-300 rounded-md p-1">
                              <img
                                className="h-11 mr-2 rounded-lg"
                                src={session?.user.image!}
                                alt=""
                              />
                              <div>
                                <h1 className="font-montserrat font-medium">
                                  {admin.profile.firstName} {admin.profile.surname} 
                                </h1>
                                <h2 className="font-montserrat text-sm">
                                  {admin.user.email}
                                </h2>
                              </div>
                            </div>
                          </div>
                        ))}
                        {/**/}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    
            <div className="mt-12 ml-8 flex flex-row space-x-8">
              <div className="h-60 shadow-lg rounded-2xl border-gray-300 border-1 w-[50%]">
                <div className="m-6 p-2">
                  <h1 className="font-montserrat text-3xl font-medium">
                    Veprimet e shpejta
                  </h1>
                  <button
                    onClick={() => {
                      redirect("/newpost");
                    }}
                    className="mt-4 rounded-xl h-32 w-72 hover:cursor-pointer hover:brightness-90 bg-linear-to-r from-blue-500 to-sky-500"
                  >
                    <div className="flex flex-col items-center">
                      <FaPlusSquare className="text-white w-8 h-8" />
                      <a className="text-white font-medium">
                        Krijo një postim të ri
                      </a>
                    </div>
                  </button>
                  <button className="mt-4 ml-8 rounded-xl h-32 w-72 hover:cursor-pointer hover:brightness-90 border-4 border-sky-500">
                    <div className="flex flex-col items-center">
                      <FaListAlt className="text-sky-500 w-8 h-8" />
                      <h1 className="text-sky-500 font-medium">
                        Shiko të gjitha postimet
                      </h1>
                    </div>
                  </button>
                </div>
              </div>
              <div className="border-1 border-gray-300 rounded-xl w-[50%]">
                <div className=" m-8 p-1">
                  <div className="flex items-center">
                    <FaBell className="w-8 h-8 mr-2" />{" "}
                    <h1 className="text-xl font-montserrat font-medium">
                      Njoftimet
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}