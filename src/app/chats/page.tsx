"use client";
import Navbar from "@/Components/Navbar";
import "@/Components/components.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegSmile, FaSearch } from "react-icons/fa";
import { FaLink, FaPlus } from "react-icons/fa6";
import Loading from "../loading";
import { LuSend } from "react-icons/lu";
import Pusher from "pusher-js";

/*
fyi: code here is a mess, half of it is from chatgpt and the other half is from brute forcing
different things over and over */

type Message = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
};

type User = {
  _id: string;
};

type Company = {
  _id: string;
  imgURL: string;
  name: string;
};

export default function Page() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [data, setData] = useState<{
    [convoId: string]: { imgURL?: string; name?: string };
  }>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User>();
  const [companies, setCompanies] = useState<{ [id: string]: Company }>({});
  const [enteredMessage, setEnteredMessage] = useState<string>("");

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  // Fetch conversations and the other participant info
  useEffect(() => {
    if (!session?.user?.oauthId) return;

    axios
      .get(`/api/getUserConversations?oid=${session.user.oauthId}`)
      .then(async (res) => {
        setConversations(res.data);

        const names: { [convoId: string]: { imgURL?: string; name?: string } } =
          {};
        await Promise.all(
          res.data.map(async (convo: any) => {
            const resp = await axios.get(
              `/api/getOtherConversationMembers?oid=${session.user.oauthId}&convoID=${convo._id}`
            );
            names[convo._id] = resp.data ? resp.data : {};
          })
        );
        setData(names);
      });
  }, [session?.user?.oauthId]);

  // Fetch messages from first conversation
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

  // Fetch logged-in user info
  useEffect(() => {
    if (!session?.user?.oauthId) return;
    axios
      .get(`/api/getUserByOauthId?oauthid=${session.user.oauthId}`)
      .then((res) => setUser(res.data));
  }, [session?.user?.oauthId]);

  // Fetch company info for each non-user message sender
  const fetchCompanyByID = async (companyID: string) => {
    if (companies[companyID]) return;

    try {
      const res = await axios.get(`/api/getCompanyByID?companyID=${companyID}`);
      const companyData = res.data;

      if (companyData && companyData._id) {
        setCompanies((prev) => ({ ...prev, [companyID]: companyData }));
      }
    } catch (err) {
      console.error(`Failed to fetch company with ID ${companyID}:`, err);
    }
  };

  // On message change, fetch any needed company info
  useEffect(() => {
    messages.forEach((message) => {
      const isCurrentUser = message.senderId === user?._id;
      if (!isCurrentUser) {
        fetchCompanyByID(message.senderId);
      }
    });
  }, [messages, user]);

  useEffect(() => {
    if (!conversations.length || !conversations[0]._id) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_key!, {
      cluster: "eu",
    });

    const convoID = conversations[0]._id;
    const channel = pusher.subscribe(convoID);

    channel.bind("newMessageEvent", (data: any) => {
      alert("Message received: " + JSON.stringify(data?.message));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [conversations]);

  if (!user) return <Loading />;

  return (
    <div className="">
      <Navbar page="chats" />
      <div className="h-[calc(85vh)] flex">
        {/* Left Sidebar */}
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
            <div
              key={convo._id}
              className="shadow-md border-1 border-gray-300 rounded-md p-2 flex space-x-4"
            >
              <img
                className="w-12 h-12 rounded-full"
                src={data[convo._id]?.imgURL || "/default-avatar.png"}
                alt=""
              />
              <h1 className="text-lg font-montserrat font-medium">
                {data[convo._id]?.name || "..."}
              </h1>
            </div>
          ))}
        </div>

        {/* Message Panel */}
        <div className="w-[150vh] h-[85vh] rounded-md mt-8 border-1 border-gray-300 ml-0.5 flex flex-col p-8 overflow-y-auto">
          <div>
            {messages.map((message) => {
              const isCurrentUser = message.senderId === user._id;
              const avatarSrc = isCurrentUser
                ? session?.user.image ?? "/default-avatar.png"
                : companies[message.senderId]?.imgURL ?? "/default-avatar.png";

              return (
                <div
                  key={message._id}
                  className={`chat ${
                    isCurrentUser ? "chat-end" : "chat-start"
                  }`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                      <img src={avatarSrc} alt="avatar" />
                    </div>
                  </div>
                  <div
                    className={`chat-bubble ${
                      isCurrentUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex  mt-auto shadow-lg w-full rounded-4xl border-1 items-center justify-center border-gray-300 h-16">
            <label className="input ml-4 w-[85%] rounded-4xl">
              <input
                type="text"
                onChange={(e) => setEnteredMessage(e.target.value)}
                className="grow"
                placeholder="Shkruani mesazhin tuaj..."
              />
              <button className="btn btn-ghost rounded-full px-2.5">
                <FaRegSmile className="w-5 h-5" />
              </button>
              <button className="btn btn-ghost rounded-full px-2.5">
                <FaLink className="w-5 h-5" />
              </button>
            </label>
            <div
              onClick={() => {
                axios.get(
                  `/api/sendMessage?oid=${session?.user.oauthId}&message=${enteredMessage}&channel=${conversations[0]._id}`
                );
              }}
              className="ml-4"
            >
              <button className="btn btn-success">
                <LuSend className="w-6 h-6  stroke-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
