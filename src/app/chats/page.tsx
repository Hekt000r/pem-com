"use client";
import Navbar from "@/Components/Navbar";
import "@/Components/components.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FaRegSmile, FaSearch } from "react-icons/fa";
import { FaLink, FaPaperPlane, FaPlus, FaRegPaperPlane } from "react-icons/fa6";
import Loading from "../loading";
import { LuSend } from "react-icons/lu";
import Pusher from "pusher-js";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import Linkify from "linkify-react";
import { FaFilePdf, FaDownload } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

const linkifyOptions = {
  target: "_blank",
  rel: "noopener noreferrer",
  className: "underline",
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

type Message = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  attachments: Attachment[];
  attachment?: Attachment; // Fallback
};

type Attachment = {
  name: string;
  type: string;
  size: number;
  url?: string;
  path?: string;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const pusherRef = useRef<Pusher | null>(null);
  const [emojiActive, setEmojiActive] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setEnteredMessage((prev) => prev + emojiData.emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getFileUrl = async (filePath: string) => {
    if (fileUrls[filePath]) return fileUrls[filePath];
    try {
      const res = await axios.get("/api/getPrivateFile", {
        params: {
          userType: "user",
          convoID: activeConversation,
          filePath: filePath,
        },
      });
      const url = res.data.url;
      setFileUrls((prev) => ({ ...prev, [filePath]: url }));
      return url;
    } catch (err) {
      console.error("Error fetching private file:", err);
      return null;
    }
  };

  const handleFileClick = async (filePath: string) => {
    const url = await getFileUrl(filePath);
    if (url) window.open(url, "_blank");
  };

  // Pre-fetch URLs for all attachments in messages
  useEffect(() => {
    if (!messages.length || !activeConversation) return;

    messages.forEach((msg: Message) => {
       // Check new attachments array
       msg.attachments?.forEach((att: Attachment) => {
        if (att.path && !fileUrls[att.path]) {
          getFileUrl(att.path);
        }
      });
      // Check legacy attachment field
      if (msg.attachment?.path && !fileUrls[msg.attachment.path]) {
        getFileUrl(msg.attachment.path);
      }
    });
  }, [messages, activeConversation, user?._id]);

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
      authEndpoint: "/api/pusher/auth",
    });
    pusherRef.current = pusher;
    const channel = pusher.subscribe(`private-chat-${activeConversation}`);
    channel.bind("newMessageEvent", (data: any) => {
      const newMessage: Message = data.newMessage;
      if (newMessage.conversationId === activeConversation) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`private-chat-${activeConversation}`);
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
            <label className="input rounded-md">
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

                    {/* Support for new 'attachments' array */}
                    {message?.attachments?.map((att: Attachment, idx: number) => {
                      return att.type?.startsWith("image/") ? (
                        <div 
                          key={idx}
                          className={`mt-3 overflow-hidden rounded-xl border cursor-pointer hover:opacity-95 transition-all duration-200 ${
                            isCurrent ? "border-white/20" : "border-black/10"
                          }`}
                          onClick={() => handleFileClick(att.path || att.url || "")}
                        >
                          <img 
                            src={fileUrls[att.path || ""] || att.url || "/image-placeholder.png"} 
                            alt={att.name}
                            className={`w-full h-auto max-h-64 object-cover block ${att.path && !fileUrls[att.path] ? "animate-pulse bg-gray-300" : ""}`}
                          />
                        </div>
                      ) : (
                        <div
                          key={idx}
                          className={`mt-3 p-3 rounded-xl border flex items-center gap-3 transition-all duration-200 group cursor-pointer ${
                            isCurrent
                              ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                              : "bg-black/5 border-black/10 hover:bg-black/10 text-black"
                          }`}
                          onClick={() => handleFileClick(att.path || att.url || "")}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm shrink-0 ${
                              isCurrent ? "bg-white/20 text-white" : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            <FaFilePdf size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate leading-tight">
                              {att.name}
                            </div>
                            <div
                              className={`text-[11px] mt-0.5 font-medium uppercase tracking-wider ${
                                isCurrent ? "text-blue-100/80" : "text-gray-500"
                              }`}
                            >
                              {att.type?.split("/")[1]?.toUpperCase() || "FILE"} •{" "}
                              {formatFileSize(att.size || 0)}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileClick(att.path || att.url || "");
                            }}
                            className={`p-2 rounded-full transition-colors shrink-0 ${
                              isCurrent
                                ? "hover:bg-white/20 text-white"
                                : "hover:bg-black/10 text-gray-700"
                            }`}
                          >
                            <FaDownload size={16} />
                          </button>
                        </div>
                      );
                    })}
                    
                    {/* Fallback for legacy single 'attachment' */}
                    {message?.attachment && !message?.attachments?.length && (
                      (() => {
                        const att = message.attachment as Attachment;
                        return att.type?.startsWith("image/") ? (
                          <div 
                            className={`mt-3 overflow-hidden rounded-xl border cursor-pointer hover:opacity-95 transition-all duration-200 ${
                              isCurrent ? "border-white/20" : "border-black/10"
                            }`}
                            onClick={() => handleFileClick(att.path || att.url || "")}
                          >
                            <img 
                              src={fileUrls[att.path || ""] || att.url || "/image-placeholder.png"} 
                              alt={att.name}
                              className={`w-full h-auto max-h-64 object-cover block ${att.path && !fileUrls[att.path] ? "animate-pulse bg-gray-300" : ""}`}
                            />
                          </div>
                        ) : (
                          <div
                            className={`mt-3 p-3 rounded-xl border flex items-center gap-3 transition-all duration-200 group cursor-pointer ${
                              isCurrent
                                ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                                : "bg-black/5 border-black/10 hover:bg-black/10 text-black"
                            }`}
                            onClick={() => handleFileClick(att.path || att.url || "")}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm shrink-0 ${
                                isCurrent ? "bg-white/20 text-white" : "bg-red-500/10 text-red-600"
                              }`}
                            >
                              <FaFilePdf size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold truncate leading-tight">
                                {att.name}
                              </div>
                              <div
                                className={`text-[11px] mt-0.5 font-medium uppercase tracking-wider ${
                                  isCurrent ? "text-blue-100/80" : "text-gray-500"
                                }`}
                              >
                                {att.type?.split("/")[1]?.toUpperCase() || "FILE"} •{" "}
                                {formatFileSize(att.size || 0)}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileClick(att.path || att.url || "");
                              }}
                              className={`p-2 rounded-full transition-colors shrink-0 ${
                                isCurrent
                                  ? "hover:bg-white/20 text-white"
                                  : "hover:bg-black/10 text-gray-700"
                              }`}
                            >
                              <FaDownload size={16} />
                            </button>
                          </div>
                        );
                      })()
                    )}
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
                  if (!activeConversation || (!enteredMessage.trim() && !selectedFile)) return;
                  
                  const formData = new FormData();
                  formData.append("channel", activeConversation);
                  formData.append("message", enteredMessage);
                  if (selectedFile) {
                    formData.append("attachment", selectedFile);
                  }

                  axios.post(`/api/sendMessage`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                  });
                  setEnteredMessage("");
                  removeSelectedFile();
                }
              }}
            />

            {selectedFile && (
              <div className="absolute bottom-20 left-4 bg-gray-100 border border-gray-300 rounded-lg p-2 flex items-center gap-2 shadow-md z-10">
                <div className="bg-blue-500 text-white p-1.5 rounded-md">
                  <FaFilePdf size={14} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold truncate max-w-[150px]">
                    {selectedFile.name}
                  </span>
                  <span className="text-[10px] text-gray-500 italic">
                    {formatFileSize(selectedFile.size)}
                  </span>
                </div>
                <button 
                  onClick={removeSelectedFile}
                  className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaPlus className="rotate-45 size-4" />
                </button>
              </div>
            )}

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

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,image/*"
            />
            <button 
              className={`btn btn-ghost px-2 ${selectedFile ? 'text-blue-500' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <FaLink className="w-5 h-5" />
            </button>
            <button
              className="btn btn-success ml-2 rounded-full px-2.5 flex items-center justify-center"
              onClick={() => {
                if (!activeConversation || (!enteredMessage.trim() && !selectedFile)) return;
                
                const formData = new FormData();
                formData.append("channel", activeConversation);
                formData.append("message", enteredMessage);
                if (selectedFile) {
                  formData.append("attachment", selectedFile);
                }

                axios.post(`/api/sendMessage`, formData, {
                  headers: { "Content-Type": "multipart/form-data" }
                });
                setEnteredMessage("");
                removeSelectedFile();
              }}
            >
              <IoSend className="w-5 h-5 stroke-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
