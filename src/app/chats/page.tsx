"use client";
import Navbar from "@/Components/Navbar";
import "@/Components/components.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import Loading from "../loading";
import ChatLayout from "@/Components/ChatLayout";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => redirect("/login"),
  });
  const searchParams = useSearchParams();
  const jumpTo = searchParams.get("jumpTo");

  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  // Fetch logged-in user info
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", session?.user?.oauthId],
    queryFn: async () => {
      const res = await axios.get(`/api/getUserByOauthId?oauthid=${session?.user?.oauthId}`);
      return res.data;
    },
    enabled: !!session?.user?.oauthId,
  });

  // Fetch conversations & other member info
  const { data: chatData, isLoading: conversationsLoading } = useQuery({
    queryKey: ["conversations", session?.user?.oauthId],
    queryFn: async () => {
      const res = await axios.get(`/api/getUserConversations?oid=${session?.user?.oauthId}`);
      const conversations = res.data;

      const names: Record<string, any> = {};
      await Promise.all(
        conversations.map(async (convo: any) => {
          const resp = await axios.get(
            `/api/getOtherConversationMembers?oid=${session?.user?.oauthId}&convoID=${convo._id}`
          );
          names[convo._id] = resp.data || {};
        })
      );
      return { conversations, names };
    },
    enabled: !!session?.user?.oauthId,
  });

  // Handle active conversation selection
  if (chatData?.conversations && !activeConversation) {
    if (jumpTo && chatData.conversations.some((c: any) => c._id === jumpTo)) {
      setActiveConversation(jumpTo);
    } else if (chatData.conversations.length > 0) {
      setActiveConversation(chatData.conversations[0]._id);
    }
  }

  const handleSendMessage = (message: string, selectedFile: File | null) => {
    if (!activeConversation) return;

    const formData = new FormData();
    formData.append("channel", activeConversation);
    formData.append("message", message);
    if (selectedFile) {
      formData.append("attachment", selectedFile);
    }

    axios.post(`/api/sendMessage`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };

  if (userLoading || conversationsLoading) return <Loading />;

  return (
    <div>
      <Navbar page="chats" />
      <ChatLayout
        conversations={chatData?.conversations || []}
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        currentUser={user}
        userType="user"
        data={chatData?.names || {}}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
