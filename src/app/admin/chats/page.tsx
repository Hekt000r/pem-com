"use client";

import { useCompany } from "@/contexts/CompanyContext";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { FaRegSmile, FaSearch } from "react-icons/fa";
import { FaLink, FaPlus, FaFilePdf, FaDownload } from "react-icons/fa6";
import Pusher from "pusher-js";
import Linkify from "linkify-react";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { LuSend } from "react-icons/lu";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});

  /* Refs */

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<Pusher | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      .get(`/api/getConversationMessages?convoID=${activeConversation}&companyID=${company?._id}`)
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
        setMessages((prev: any) => [...prev, newMessage]);
      }
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`private-chat-${activeConversation}`);
      pusher.disconnect();
    };
  }, [activeConversation]);

  // Fetch user info for user senders
  useEffect(() => {
    messages.forEach((msg: Message) => {
      if (msg.senderId !== company?._id?.toString() && !users[msg.senderId]) {
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
          userType: "company",
          convoID: activeConversation,
          companyID: company?._id,
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

    messages.forEach((msg: any) => {
      // Check new attachments array
      msg.attachments?.forEach((att: any) => {
        if (att.path && !fileUrls[att.path]) {
          getFileUrl(att.path);
        }
      });
      // Check legacy attachment field
      if (msg.attachment?.path && !fileUrls[msg.attachment.path]) {
        getFileUrl(msg.attachment.path);
      }
    });
  }, [messages, activeConversation, company?._id]);

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
                    {/* Support for new 'attachments' array */}
                    {message?.attachments?.map((att: any, idx: number) => {
                      return att.type?.startsWith("image/") ? (
                        <div 
                          key={idx}
                          className={`mt-3 overflow-hidden rounded-xl border cursor-pointer hover:opacity-95 transition-all duration-200 ${
                            isCurrent ? "border-white/20" : "border-black/10"
                          }`}
                          onClick={() => handleFileClick(att.path)}
                        >
                          <img 
                            src={fileUrls[att.path] || "/image-placeholder.png"} 
                            alt={att.name}
                            className={`w-full h-auto max-h-64 object-cover block ${!fileUrls[att.path] ? "animate-pulse bg-gray-300" : ""}`}
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
                          onClick={() => handleFileClick(att.path || att.url)}
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
                              handleFileClick(att.path || att.url);
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
                        const att = message.attachment;
                        return att.type?.startsWith("image/") ? (
                          <div 
                            className={`mt-3 overflow-hidden rounded-xl border cursor-pointer hover:opacity-95 transition-all duration-200 ${
                              isCurrent ? "border-white/20" : "border-black/10"
                            }`}
                            onClick={() => handleFileClick(att.path || "")}
                          >
                            <img 
                              src={fileUrls[att.path || ""] || "/image-placeholder.png"} 
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
                  if (!activeConversation || (!enteredMessage.trim() && !selectedFile)) return;

                  const formData = new FormData();
                  formData.append("companyID", company?._id?.toString() || "")
                  formData.append("channel", activeConversation)
                  formData.append("message", enteredMessage)
                  if (selectedFile) {
                    formData.append("attachment", selectedFile);
                  }

                  axios.post(
                    `/api/companySendMessage/`, formData, {
                      headers: {"Content-Type": "multipart/form-data"}
                    }
                  )
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
              className="btn btn-success ml-2"
              onClick={() => {
                if (!activeConversation || (!enteredMessage.trim() && !selectedFile)) return;
                
                const formData = new FormData();
                formData.append("companyID", company?._id?.toString() || "")
                formData.append("channel", activeConversation)
                formData.append("message", enteredMessage)
                if (selectedFile) {
                  formData.append("attachment", selectedFile);
                }

                axios.post(
                  `/api/companySendMessage/`, formData, {
                    headers: {"Content-Type": "multipart/form-data"}
                  }
                )
                setEnteredMessage("");
                removeSelectedFile();
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
