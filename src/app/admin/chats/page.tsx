"use client";

import { useCompany } from "@/contexts/CompanyContext";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { FaRegSmile, FaSearch } from "react-icons/fa";
import { FaLink, FaPlus } from "react-icons/fa6";
import Pusher from "pusher-js";
import Linkify from "linkify-react";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { LuSend } from "react-icons/lu";

const linkifyOptions = {
  target: "_blank",
  rel: "noopener noreferrer",
  className: "underline",
};

export default function AdminChats() {
  const [convos, setConvos] = useState<Array<Conversation>>([]);

  /* Conversation Data */
  const [activeConversation, setActiveConversation] = useState<string>("");
  const [data, setData] = useState<ConversationMembersNames>({});
  const [profiles, setProfiles] = useState<ConversationMembersProfiles>();

  const [users, setUsers] = useState<any>({});

  const [messages, setMessages] = useState<any>([]);

  /* Form Data */
  const [enteredMessage, setEnteredMessage] = useState<any>("");
  const [active, setActive] = useState(false);

  /* Refs */

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<Pusher | null>(null);

  const { company, billingData } = useCompany();
  const { data: session, status } = useSession();

  /* Fetch conversations */
  useEffect(() => {
    axios
      .get(`/api/getCompanyConversations?companyId=${company?._id}`)
      .then((res) => {
        setConvos(res.data);
        if (res.data.length > 0 && !activeConversation) {
          setActiveConversation(res.data[0]._id);
        }
      });
  }, []);

  /** FETCHING DATA FOR MESSAGING APP **/
  useEffect(() => {
    if (!session?.user?.oauthId) return;
    if (!company) return;

    axios
      .get("/api/getCompanyConversations?companyId=" + company._id)
      .then(async (res) => {
        const names: ConversationMembersNames = {};
        const profiles: ConversationMembersProfiles = {};
        await Promise.all(
          res.data.map(async (convo: any) => {
            const resp = await axios.get(
              `/api/getCompanyOtherConversationMembers?companyId=${company._id}&convoID=${convo._id}`
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
  }, [session?.user?.oauthId, company]);

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
        setMessages((prev: any) => [...prev, newMessage]);
      }
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(activeConversation);
      pusher.disconnect();
    };
  }, [activeConversation]);

  // Fetch user info for user senders
  useEffect(() => {
    messages.forEach((msg: Message) => {
      if (msg.senderId !== company?._id && !users[msg.senderId]) {
        axios
          .get(`/api/getEntityById?id=${msg.senderId}`)
          .then((res) => {
            setUsers((prev: any) => ({
              ...prev,
              [msg.senderId]: res.data.data,
            }));
          })
          .catch(console.error);
      }
    });
  }, [messages, company]);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setEnteredMessage((prev: any) => prev + emojiData.emoji);
  };

  return (
    <div>
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
            {convos?.map((convo) => (
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
        <div className="flex-1 h-full mt-8 ml-2 rounded-md border border-gray-300 flex flex-col">
          <div
            className="flex-1 overflow-y-auto px-8 py-4 space-y-4"
            ref={(el) => {
              if (el) el.scrollTop = el.scrollHeight; // Auto-scroll to bottom
            }}
          >
            {messages.map((message: any) => {
              const isCurrent = message.senderId === company?._id;
              const avatar = isCurrent
                ? company?.imgURL || "/default-avatar.png"
                : users[message.senderId]?.image ?? "/default-avatar.png";

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
                    className={`chat-bubble whitespace-pre-wrap break-words max-w-xs ${
                      isCurrent
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    <Linkify options={linkifyOptions}>
                      {message.content}
                    </Linkify>
                    <div
                      className={`text-[10px] mt-1 text-right ${
                        isCurrent ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Bar */}
          <div className="flex items-center h-16 mt-auto border border-gray-300 rounded-full shadow-lg px-4 m-4 relative">
            <input
              type="text"
              className="flex-1 outline-0"
              placeholder="Shkruani mesazhin tuaj..."
              value={enteredMessage}
              onChange={(e) => setEnteredMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!activeConversation || !enteredMessage.trim()) return;
                  axios.get(
                    `/api/companySendMessage?companyID=${
                      company?._id
                    }&message=${encodeURIComponent(
                      enteredMessage
                    )}&channel=${activeConversation}`
                  );
                  setEnteredMessage("");
                }
              }}
            />
            <button
              onClick={() => setActive(!active)}
              className="btn btn-ghost px-2"
            >
              <FaRegSmile className="w-5 h-5" />
            </button>

            {active && (
              <div
                ref={emojiPickerRef}
                style={{
                  position: "absolute",
                  bottom: "80px",
                  right: "20px",
                  zIndex: 999,
                }}
              >
                <EmojiPicker
                  emojiStyle={"native" as EmojiStyle}
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}

            <button className="btn btn-ghost px-2">
              <FaLink className="w-5 h-5" />
            </button>
            <button
              className="btn btn-success ml-2"
              onClick={() => {
                if (!activeConversation || !enteredMessage.trim()) return;
                axios.get(
                  `/api/companySendMessage?companyID=${
                    company?._id
                  }&message=${encodeURIComponent(
                    enteredMessage
                  )}&channel=${activeConversation}`
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
