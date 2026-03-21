import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Props {
  activeConversation: string | null;
  userType: "user" | "company";
  companyID?: string;
}

export default function useChatLogic({ activeConversation, userType, companyID }: Props) {
  const queryClient = useQueryClient();
  const [enteredMessage, setEnteredMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const [emojiActive, setEmojiActive] = useState(false);
  const pusherRef = useRef<Pusher | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch messages using Tanstack Query
  const { 
    data: messages = [], 
    isLoading: messagesLoading,
    refetch: refetchMessages 
  } = useQuery<Message[]>({
    queryKey: ["messages", activeConversation, userType, companyID],
    queryFn: async () => {
      if (!activeConversation) return [];
      const endpoint = userType === "user"
        ? `/api/getConversationMessages?convoID=${activeConversation}`
        : `/api/getConversationMessages?convoID=${activeConversation}&companyID=${companyID}`;
      const res = await axios.get(endpoint);
      return res.data;
    },
    enabled: !!activeConversation,
    staleTime: 0, // Always fetch on mount/refocus
  });

  // Fetch entity info for senders
  const senderIds = Array.from(new Set(messages.map((m) => m.senderId))).filter(
    (id) => id !== (userType === "company" ? companyID : undefined)
  );

  const { data: entities = {} } = useQuery<Record<string, any>>({
    queryKey: ["entities", senderIds, userType],
    queryFn: async () => {
      const results: Record<string, any> = {};
      await Promise.all(
        senderIds.map(async (id) => {
          const endpoint = userType === "user"
            ? `/api/getCompanyByID?companyID=${id}`
            : `/api/getEntityById?id=${id}`;
          try {
            const res = await axios.get(endpoint);
            results[id] = userType === "user" ? res.data : res.data.data;
          } catch (err) {
            console.error(`Failed to fetch entity ${id}:`, err);
          }
        })
      );
      return results;
    },
    enabled: senderIds.length > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Pusher real-time updates - Syncing with Tanstack Query cache
  useEffect(() => {
    if (!activeConversation) return;

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
        // Update query cache directly so it's always in sync with Pusher
        queryClient.setQueryData(
          ["messages", activeConversation, userType, companyID],
          (old: Message[] = []) => {
            // Check if message already exists to avoid duplicates
            if (old.some((m) => m._id === newMessage._id)) return old;
            return [...old, newMessage];
          }
        );
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`private-chat-${activeConversation}`);
      pusher.disconnect();
    };
  }, [activeConversation, queryClient, userType, companyID]);

  const getFileUrl = async (filePath: string) => {
    if (fileUrls[filePath]) return fileUrls[filePath];
    try {
      const res = await axios.get("/api/getPrivateFile", {
        params: {
          userType,
          convoID: activeConversation,
          filePath,
          ...(companyID && { companyID }),
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onEmojiClick = (emojiData: any) => {
    setEnteredMessage((prev) => prev + emojiData.emoji);
  };

  const invalidateMessages = () => {
    queryClient.invalidateQueries({ queryKey: ["messages", activeConversation, userType, companyID] });
  };

  return {
    messages,
    messagesLoading,
    refetchMessages: invalidateMessages,
    enteredMessage,
    setEnteredMessage,
    selectedFile,
    setSelectedFile,
    fileUrls,
    getFileUrl,
    handleFileClick,
    handleFileChange,
    removeSelectedFile,
    emojiActive,
    setEmojiActive,
    onEmojiClick,
    fileInputRef,
    entities,
  };
}