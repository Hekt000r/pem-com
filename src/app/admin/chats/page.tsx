"use client";
import { useCompany } from "@/contexts/CompanyContext";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ChatLayout from "@/Components/ChatLayout";
import { useQuery } from "@tanstack/react-query";

export default function AdminChats() {
  const { company } = useCompany();
  const { data: session } = useSession();

  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  // Fetch conversations and data
  const { data: chatData, isLoading: conversationsLoading } = useQuery({
    queryKey: ["adminConversations", company?._id, session?.user?.oauthId],
    queryFn: async () => {
      const res = await axios.get(`/api/getCompanyConversations?companyId=${company?._id}`);
      const conversations = res.data;

      const names: ConversationMembersNames = {};
      const profiles: ConversationMembersProfiles = {};
      await Promise.all(
        conversations.map(async (convo: any) => {
          const resp = await axios.get(
            `/api/getCompanyOtherConversationMembers?companyId=${company?._id}&convoID=${convo._id}`
          );
          const resp2 = await axios.get(
            `/api/getUserProfile?oid=${resp.data.oauthId}`
          );
          names[convo._id] = resp.data || {};
          profiles[convo._id] = resp2.data || {};
        })
      );
      return { conversations, names, profiles };
    },
    enabled: !!company?._id && !!session?.user?.oauthId,
  });

  // Handle active conversation selection
  if (chatData?.conversations && !activeConversation) {
    if (chatData.conversations.length > 0) {
      setActiveConversation(chatData.conversations[0]._id);
    }
  }

  const handleSendMessage = (message: string, selectedFile: File | null) => {
    if (!activeConversation || !company) return;

    const formData = new FormData();
    formData.append("companyID", company._id.toString());
    formData.append("channel", activeConversation);
    formData.append("message", message);
    if (selectedFile) {
      formData.append("attachment", selectedFile);
    }

    axios.post(`/api/companySendMessage/`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };

  if (!company || conversationsLoading) return <div className="p-8 text-center text-xl font-medium">Po ngarkohet...</div>;

  return (
    <ChatLayout
      conversations={chatData?.conversations || []}
      activeConversation={activeConversation}
      setActiveConversation={setActiveConversation}
      currentUser={company}
      userType="company"
      companyID={company._id.toString()}
      data={{}} 
      profiles={chatData?.profiles}
      onSendMessage={handleSendMessage}
    />
  );
}
