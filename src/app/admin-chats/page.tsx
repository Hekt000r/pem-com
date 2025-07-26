"use client";
import Navbar from "@/Components/Navbar";
import "@/Components/components.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FaRegSmile, FaSearch } from "react-icons/fa";
import { FaLink, FaPlus } from "react-icons/fa6";
import Loading from "../loading";
import { LuSend } from "react-icons/lu";
import Pusher from "pusher-js";
import CompanyAdminNavbar from "@/Components/CompanyAdminNavbar";

type Message = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
};

type User = { _id: string; image: string };
type Company = {
  _id: string;
  imgURL: string;
  name: string;
  displayName: string;
};

type Conversation = { _id: string };

export default function Page() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => redirect("/"),
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [data, setData] = useState<
    Record<string, { image?: string; name?: string }>
  >({});
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<Company>();
  const [users, setUsers] = useState<Record<string, User>>({});
  const [enteredMessage, setEnteredMessage] = useState<string>("");
  const [company, setCompany] = useState<Company | null>(null);
  const pusherRef = useRef<Pusher | null>(null);
  const [profiles, setProfiles] = useState<
    Record<string, { firstName: string; surname: string }>
  >({});

  // Fetch logged-in-company info
  useEffect(() => {
    if (!session?.user?.oauthId) return;
    axios
      .get(`/api/getUserAdminCompany?oid=${session.user.oauthId}`)
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, [session?.user?.oauthId]);

  // ✅ Fetch conversations & other member info
  useEffect(() => {
    if (!session?.user?.oauthId) return;
    if (!user) return;

    axios
      .get("/api/getCompanyConversations?companyId=" + user!._id)
      .then(async (res) => {
        setConversations(res.data);
        if (res.data.length > 0 && !activeConversation) {
          setActiveConversation(res.data[0]._id);
        }

        const names: Record<string, { image?: string; name?: string }> = {};
        const profiles: Record<string, { firstName: string; surname: string }> =
          {};
        await Promise.all(
          res.data.map(async (convo: any) => {
            const resp = await axios.get(
              `/api/getCompanyOtherConversationMembers?companyId=${user._id}&convoID=${convo._id}`
            );
            const resp2 = await axios.get(
              `/api/getUserProfile?oid=${resp.data.oauthId}`
            );

            console.log(
              "Profile API result for user",
              resp.data.oauthId,
              resp2.data
            );

            names[convo._id] = resp.data || {};
            profiles[convo._id] = resp2.data || {};
          })
        );
        setData(names);
        setProfiles(profiles);
      })
      .catch(console.error);
  }, [session?.user?.oauthId, user]);

  // chatgpt ahh code

  // Fetch messages for activeConversation
  useEffect(() => {
    if (!activeConversation) return;
    axios
      .get(`/api/getConversationMessages?convoID=${activeConversation}`)
      .then((res) => setMessages(res.data))
      .catch((err) => {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      });

    // Setup Pusher for active convo
    if (pusherRef.current) {
      pusherRef.current.disconnect();
    }
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_key!, {
      cluster: "eu",
    });
    pusherRef.current = pusher;
    const channel = pusher.subscribe(activeConversation);
    channel.bind("newMessageEvent", (data: any) => {
      const newMessage: Message = data.newMessage;
      if (newMessage.conversationId === activeConversation) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(activeConversation);
      pusher.disconnect();
    };
  }, [activeConversation]);

  // Ensure company is always defined before rendering CompanyAdminNavbar
  useEffect(() => {
    if (user) setCompany(user);
  }, [user]);
  // Fetch user info for user senders
  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.senderId !== user?._id && !users[msg.senderId]) {
        axios
          .get(`/api/getEntityById?id=${msg.senderId}`)
          .then((res) => {
            setUsers((prev) => ({ ...prev, [msg.senderId]: res.data.data }));
          })
          .catch(console.error);
      }
    });
  }, [messages, user]);

  if (!user) return <Loading />;

  if (!company) return <Loading />;

  return (
    <div>
      <CompanyAdminNavbar company={company} imgURL={company.imgURL} />
      <div className="h-[calc(85vh)] flex">
        {/* Sidebar */}
        <div className="my-8 ml-8 w-[25%] h-full border border-gray-300 rounded-lg p-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold">Mesazhet</h1>
            <button className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded flex items-center">
              <FaPlus className="mr-2" /> Bisedë të ri
            </button>
          </div>
          <div className="flex justify-center mt-3">
            <label className="input">
              <FaSearch />
              <input
                type="search"
                className="grow"
                placeholder="Kërko një kontakt.."
              />
            </label>
          </div>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex flex-col space-y-4">
            {conversations.map((convo) => (
              <div
                key={convo._id}
                onClick={() => setActiveConversation(convo._id)}
                className={`cursor-pointer p-2 flex items-center space-x-4 rounded-md border ${
                  activeConversation === convo._id
                    ? "border-blue-500 shadow"
                    : "border-gray-300"
                }`}
              >
                <img
                  className="w-12 h-12 rounded-full"
                  src={data[convo._id]?.image || "/default-avatar.png"}
                />
                <span className="font-medium">
                  {profiles?.[convo._id]?.firstName || "..."}{" "}
                  {profiles?.[convo._id]?.surname || "..."}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Panel */}
        <div className="flex-1 h-full mt-8 ml-2 rounded-md border border-gray-300 p-8 flex flex-col overflow-y-auto">
          <div className="flex-1">
            {messages.map((message) => {
              const isCurrent = message.senderId === company._id;
              const avatar = isCurrent
                ? company.imgURL || "/default-avatar.png"
                : users[message.senderId]?.image || "/default-avatar.png";

              return (
                <div
                  key={message._id}
                  className={`chat ${isCurrent ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img src={avatar} alt="avatar" />
                    </div>
                  </div>
                  <div
                    className={`chat-bubble ${
                      isCurrent
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
          <div className="flex items-center h-16 mt-auto border border-gray-300 rounded-full shadow-lg px-4">
            <input
              type="text"
              className="flex-1"
              placeholder="Shkruani mesazhin tuaj..."
              value={enteredMessage}
              onChange={(e) => setEnteredMessage(e.target.value)}
            />
            <button className="btn btn-ghost px-2">
              <FaRegSmile className="w-5 h-5" />
            </button>
            <button className="btn btn-ghost px-2">
              <FaLink className="w-5 h-5" />
            </button>
            <button
              className="btn btn-success ml-2"
              onClick={() => {
                if (!activeConversation) return;
                axios.get(
                  `/api/companySendMessage?companyID=${company._id}&message=${enteredMessage}&channel=${activeConversation}`
                );
                setEnteredMessage("");
              }}
            >
              <LuSend className="w-6 h-6 stroke-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
