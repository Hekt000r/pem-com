"use client";
import React, { useRef } from "react";
import { FaPlus, FaLink, FaFilePdf, FaDownload } from "react-icons/fa6";
import { FaSearch, FaRegSmile } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import Linkify from "linkify-react";
import useChatLogic from "@/hooks/UseChatLogic";

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

interface ChatLayoutProps {
  conversations: Conversation[];
  activeConversation: string | null;
  setActiveConversation: (id: string) => void;
  currentUser: any;
  userType: "user" | "company";
  companyID?: string;
  data: Record<string, any>;
  profiles?: Record<string, any>;
  onSendMessage: (message: string, file: File | null) => void;
  placeholder?: string;
}

export default function ChatLayout({
  conversations,
  activeConversation,
  setActiveConversation,
  currentUser,
  userType,
  companyID,
  data,
  profiles,
  onSendMessage,
  placeholder = "Shkruani mesazhin tuaj..."
}: ChatLayoutProps) {
  const {
    messages,
    messagesLoading,
    enteredMessage,
    setEnteredMessage,
    selectedFile,
    removeSelectedFile,
    fileUrls,
    handleFileClick,
    handleFileChange,
    emojiActive,
    setEmojiActive,
    onEmojiClick,
    fileInputRef,
    entities,
    refetchMessages
  } = useChatLogic({
    activeConversation,
    userType,
    companyID
  });

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!activeConversation || (!enteredMessage.trim() && !selectedFile)) return;
    onSendMessage(enteredMessage, selectedFile);
    setEnteredMessage("");
    removeSelectedFile();
    // Cache invalidation is handled by the page calling onSendMessage then refetch if needed,
    // but here we can at least ensure we don't have stale UI.
    setTimeout(refetchMessages, 500); // Small delay to allow DB update
  };

  return (
    <div className="h-[calc(85vh)] flex">
      {/* Sidebar */}
      <div className="my-8 ml-8 w-[25%] h-full border border-gray-300 rounded-lg p-4 flex flex-col">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">Mesazhet</h1>
          <button className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded flex items-center">
            <FaPlus className="mr-2" /> Bisedë të ri
          </button>
        </div>
        <div className="flex justify-center mt-3">
          <label className="input rounded-md w-full flex items-center gap-2 border border-gray-300 px-3 py-2">
            <FaSearch />
            <input
              type="search"
              className="grow outline-none bg-transparent"
              placeholder="Kërko një kontakt.."
            />
          </label>
        </div>
        <hr className="border-t border-gray-300 my-4" />
        <div className="flex-1 overflow-y-auto space-y-4">
          {conversations.map((convo) => {
            const displayName = userType === "company" 
              ? `${profiles?.[convo._id]?.firstName || "..."} ${profiles?.[convo._id]?.surname || "..."}`
              : data[convo._id]?.name || "...";
            const avatar = userType === "company"
              ? data[convo._id]?.image || "/default-avatar.png"
              : data[convo._id]?.imgURL || "/default-avatar.png";

            return (
              <div
                key={convo._id}
                onClick={() => setActiveConversation(convo._id)}
                className={`cursor-pointer p-2 flex items-center space-x-4 rounded-md border transition-all ${
                  activeConversation === convo._id
                    ? "border-blue-500 shadow bg-blue-50/50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <img className="w-12 h-12 rounded-full object-cover" src={avatar} alt={displayName} />
                <span className="font-medium truncate">{displayName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Messages Panel */}
      <div className="flex-1 h-full mt-8 ml-2 rounded-md border border-gray-300 flex flex-col overflow-hidden">
        <div
          className="flex-1 overflow-y-auto px-8 py-4 space-y-4 text-sm"
          ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}
        >
          {messagesLoading ? (
            <div className="h-full flex items-center justify-center">
              <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </div>
          ) : messages.map((message) => {
            const isCurrent = message.senderId === (userType === "company" ? companyID : currentUser?._id);
            const avatar = isCurrent
              ? (userType === "company" ? currentUser?.imgURL : currentUser?.image) || "/default-avatar.png"
              : (userType === "company" 
                  ? (entities[message.senderId]?.image || "/default-avatar.png") 
                  : (entities[message.senderId]?.imgURL || "/default-avatar.png"));

            return (
              <div key={message._id} className={`chat ${isCurrent ? "chat-end" : "chat-start"}`}>
                <div className="chat-image avatar">
                  <div className="w-10 h-10 rounded-full overflow-hidden border">
                    <img src={avatar} alt="avatar" />
                  </div>
                </div>
                <div
                  className={`chat-bubble whitespace-pre-wrap break-words max-w-xs ${
                    isCurrent ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  <Linkify options={linkifyOptions}>{message.content}</Linkify>

                  {message.attachments?.map((att, idx) => (
                    <div key={idx} className="mt-2">
                       {att.type?.startsWith("image/") ? (
                        <div 
                          className="rounded-xl border cursor-pointer hover:opacity-95 transition-all"
                          onClick={() => handleFileClick(att.path || att.url || "")}
                        >
                          <img 
                            src={fileUrls[att.path || ""] || att.url || "/image-placeholder.png"} 
                            alt={att.name}
                            className="w-full h-auto max-h-64 object-cover block rounded-lg"
                          />
                        </div>
                      ) : (
                        <div
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer ${
                            isCurrent ? "bg-white/10 border-white/20" : "bg-black/5 border-black/10"
                          }`}
                          onClick={() => handleFileClick(att.path || att.url || "")}
                        >
                          <FaFilePdf size={20} className={isCurrent ? "text-white" : "text-red-600"} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{att.name}</div>
                            <div className="text-[11px] opacity-70 uppercase">
                              {att.type?.split("/")[1]?.toUpperCase()} • {formatFileSize(att.size)}
                            </div>
                          </div>
                          <FaDownload size={16} />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className={`text-[10px] mt-1 text-right ${isCurrent ? "text-white/80" : "text-gray-500"}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-300 p-4 relative">
          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:border-blue-400">
            <input
              type="text"
              className="flex-1 outline-none bg-transparent"
              placeholder={placeholder}
              value={enteredMessage}
              onChange={(e) => setEnteredMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />

            {selectedFile && (
              <div className="absolute bottom-full left-4 mb-2 bg-gray-100 border border-gray-300 rounded-lg p-2 flex items-center gap-2 shadow-md">
                <FaFilePdf size={14} className="text-red-500" />
                <span className="text-xs font-semibold truncate max-w-[150px]">{selectedFile.name}</span>
                <button onClick={removeSelectedFile} className="text-gray-400 hover:text-red-500">
                  <FaPlus className="rotate-45 size-4" />
                </button>
              </div>
            )}

            <button onClick={() => setEmojiActive(!emojiActive)} className="p-2 hover:bg-gray-100 rounded-full">
              <FaRegSmile className="w-5 h-5 text-gray-500" />
            </button>

            {emojiActive && (
              <div ref={emojiPickerRef} className="absolute bottom-full right-4 mb-2 z-50">
                <EmojiPicker emojiStyle={EmojiStyle.NATIVE} onEmojiClick={onEmojiClick} />
              </div>
            )}

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded-full">
              <FaLink className={`w-5 h-5 ${selectedFile ? 'text-blue-500' : 'text-gray-500'}`} />
            </button>
            <button onClick={handleSend} className="bg-blue-500 text-white p-2.5 rounded-full hover:bg-blue-600 transition-colors">
              <IoSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
