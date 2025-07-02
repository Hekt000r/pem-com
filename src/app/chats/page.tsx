"use client"
import Navbar from "@/Components/Navbar";
import "@/Components/components.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

export default function Page() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [data, setData] = useState<{ [convoId: string]: { imgURL?: string; name?: string } }>({});
  const [messages, setMessages] = useState<any[]>([])
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  useEffect(() => {
    if (!session?.user?.oauthId) return;
    axios
      .get(`/api/getUserConversations?oid=${session.user.oauthId}`)
      .then(async (res) => {
        setConversations(res.data);

        // Fetch other user names for each conversation
        const names: { [convoId: string]: { imgURL?: string; name?: string } } = {};
        await Promise.all(
          res.data.map(async (convo: any) => {
            const resp = await axios.get(
              `/api/getOtherConversationMembers?oid=${session.user.oauthId}&convoID=${convo._id}`
            );
            // Expect resp.data to be an object with imgURL and name
            names[convo._id] = resp.data ? resp.data : {};
          })
        );
        setData(names);
      });
  }, [session?.user?.oauthId]);

  useEffect(() => {
    if (conversations.length > 0) {
      const firstConvoId = conversations[0]._id;
      axios
        .get(`/api/getConversationMessages?convoID=${firstConvoId}`)
        .then((res) => {
          setMessages(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch messages:", err);
          setMessages([]);
        });
    }
  }, [conversations]);


  return (
    <div className="">
      <Navbar page="chats" />
      <div className=" h-[calc(85vh)] flex">
        <div className="my-8 ml-8 w-[25%] h-full border-1 border-gray-300 rounded-lg p-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-montserrat font-semibold">Mesazhet</h1>
            <div className="ml-auto">
              <button className="text-center cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded flex items-center">
                <FaPlus className="mr-2" /> Bisedë të ri
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <label className="input">
              <FaSearch className="fill-gray-500" />
              <input
                type="search"
                className="grow"
                placeholder="Kërko një kontakt.."
              />
            </label>
          </div>

          <hr className="border-t border-gray-300 my-4" />

            {conversations.map((convo) => (
              <div key={convo._id} className="shadow-md border-1 border-gray-300 rounded-md p-2 flex space-x-4">
                <img className="w-12 h-12 rounded-full" src={data[convo._id]?.imgURL || "/default-avatar.png"} alt="" />
                <h1 className="text-lg font-montserrat font-medium">{data[convo._id]?.name || "..."}</h1>
              </div>
            ))}
          </div>
          <div className="w-[150vh] h-[85vh] rounded-md mt-8 border-1 border-gray-300 ml-0.5">
            {messages.map((message) => (<>
            <h1 key={message.content}>{message.content}</h1>
            </>))}
          </div>
        </div>
      </div>
  );
}
