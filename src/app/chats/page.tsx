"use client";
import Navbar from "@/Components/Navbar";
import "@/Components/components.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FaRegSmile, FaSearch } from "react-icons/fa";
import { FaLink, FaPlus } from "react-icons/fa6";
import Loading from "../loading";
import { LuSend } from "react-icons/lu";
import Pusher from "pusher-js";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import Linkify from "linkify-react";

const linkifyOptions = {
  target: "_blank",
  rel: "noopener noreferrer",
  className: "underline",
};

type Message = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
};

type User = { _id: string };
type Company = { _id: string; imgURL: string; name: string };

type Conversation = { _id: string };

export default function Page() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => redirect("/login"),
  });
  const searchParams = useSearchParams();
  const jumpTo = searchParams.get("jumpTo"); // <-- get param

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [data, setData] = useState<
    Record<string, { imgURL?: string; name?: string }>
  >({});
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Record<string, Company>>({});
  const [enteredMessage, setEnteredMessage] = useState<string>("");
  const pusherRef = useRef<Pusher | null>(null);
  const [emojiActive, setEmojiActive] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setEnteredMessage((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setEmojiActive(false);
      }
    }

    if (emojiActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiActive]);

  // Fetch conversations & other member info
  useEffect(() => {
    if (!session?.user?.oauthId) return;
    axios
      .get(`/api/getUserConversations?oid=${session.user.oauthId}`)
      .then(async (res) => {
        setConversations(res.data);

        // If jumpTo param is present and valid, use it
        if (jumpTo && res.data.some((c: any) => c._id === jumpTo)) {
          setActiveConversation(jumpTo);
        } else if (res.data.length > 0 && !activeConversation) {
          setActiveConversation(res.data[0]._id);
        }

        const names: Record<string, { imgURL?: string; name?: string }> = {};
        await Promise.all(
          res.data.map(async (convo: any) => {
            const resp = await axios.get(
              `/api/getOtherConversationMembers?oid=${session.user.oauthId}&convoID=${convo._id}`
            );
            names[convo._id] = resp.data || {};
          })
        );
        setData(names);
      });
  }, [session?.user?.oauthId, jumpTo]);

  // Fetch logged-in user info
  useEffect(() => {
    if (!session?.user?.oauthId) return;
    axios
      .get(`/api/getUserByOauthId?oauthid=${session.user.oauthId}`)
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, [session?.user?.oauthId]);

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

  // Fetch company info for non-user senders
  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.senderId !== user?._id && !companies[msg.senderId]) {
        axios
          .get(`/api/getCompanyByID?companyID=${msg.senderId}`)
          .then((res) => {
            setCompanies((prev) => ({ ...prev, [msg.senderId]: res.data }));
          })
          .catch(console.error);
      }
    });
  }, [messages, user]);

  if (!user) return <Loading />;

  return (
    <div>
      <Navbar page="chats" />
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
                  src={data[convo._id]?.imgURL || "/default-avatar.png"}
                />
                <span className="font-medium">
                  {data[convo._id]?.name || "..."}
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
            {messages.map((message) => {
              const isCurrent = message.senderId === user._id;
              const avatar = isCurrent
                ? session?.user.image || "/default-avatar.png"
                : companies[message.senderId]?.imgURL || "/default-avatar.png";

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

          {/* Input Area */}
          <div className="h-16 mt-auto border border-gray-300 rounded-full shadow-lg px-4 flex items-center m-4 relative">
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
                    `/api/sendMessage?oid=${
                      session?.user.oauthId
                    }&message=${encodeURIComponent(
                      enteredMessage
                    )}&channel=${activeConversation}`
                  );
                  setEnteredMessage("");
                }
              }}
            />

            {/* Emoji button */}
            <button
              className="btn btn-ghost px-2"
              onClick={() => setEmojiActive((prev) => !prev)}
            >
              <FaRegSmile className="w-5 h-5" />
            </button>

            {/* Emoji picker */}
            {emojiActive && (
              <div
                ref={emojiPickerRef}
                style={{
                  position: "absolute",
                  bottom: "80px",
                  right: "60px",
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
                axios.post(`/api/sendMessage`, {
                  message: enteredMessage,
                  channel: activeConversation
                })
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
