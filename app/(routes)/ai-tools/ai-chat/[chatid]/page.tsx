"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import EmptyState from "../_components/EmptyState";
import axios from "axios";
import Markdown from "marked-react";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

type Message = {
  content: string;
  role: string;
  type: string;
};

function AiChat() {
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [messageList, setMessageList] = useState<Message[]>([]);

  const { chatid }: any = useParams();
  const router = useRouter();
  const id = uuidv4();

  useEffect(() => {
    if (chatid) {
      getMessageList();
    }
  }, [chatid]);

  const getMessageList = async () => {
    try {
      const result = await axios.get("/api/history?recordId=" + chatid);
      const content = result?.data?.content;

      if (Array.isArray(content)) {
        setMessageList(content);
      } else {
        console.warn("Expected array but got:", content);
        setMessageList([]);
      }
    } catch (error) {
      console.error("Error fetching message list:", error);
      setMessageList([]);
    }
  };

  const onSend = async () => {
    if (!userInput?.trim()) return;

    setLoading(true);
    setMessageList((prev) => [
      ...prev,
      {
        content: userInput,
        role: "user",
        type: "text",
      },
    ]);
    setUserInput("");

    try {
      const result = await axios.post("/api/ai-career-chat-agent", {
        userInput: userInput,
      });
      setMessageList((prev) => [...prev, result.data]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messageList.length > 0) {
      updateMessagesList();
    }
  }, [messageList]);

  const updateMessagesList = async () => {
    try {
      const result = await axios.put("/api/history", {
        content: messageList,
        recordId: chatid,
      });
      console.log(result);
    } catch (error) {
      console.error("Error updating messages list:", error);
    }
  };

  const onNewChat = async () => {
    try {
      const result = await axios.post("/api/history", {
        recordId: id,
        content: [],
      });
      console.log(result);
      router.replace("/ai-tools/ai-chat/" + id);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  return (
    <div className="px-10 md:px-24 lg:px-36 xl:px-48 h-[75vh] overflow-auto">
      <div className="flex items-center justify-between gap-8">
        <div>
          <h2 className="font-bold text-lg">AI Career Q/A Chat</h2>
          <p>Smarter career decisions start here. Ask questions to AI.</p>
        </div>
        <Button onClick={onNewChat}>+ New Chat</Button>
      </div>

      <div className="flex flex-col h-[65vh]">
        {messageList.length <= 0 && (
          <div className="mt-5">
            <EmptyState selectedQuestion={(q: string) => setUserInput(q)} />
          </div>
        )}
        <div className="flex-1 mt-5">
          {messageList.map((message, index) => (
            <div key={index}>
              <div
                className={`flex mb-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg gap-2 ${
                    message.role === "user"
                      ? "bg-gray-200 text-black"
                      : "bg-gray-50 text-black"
                  }`}
                >
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
              {loading && messageList.length - 1 === index && (
                <div className="flex justify-start p-3 rounded-lg gap-2 bg-gray-50 text-black mb-2">
                  <LoaderCircle className="animate-spin" /> Thinking...
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 absolute bottom-5 w-[50%]">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a question"
          />
          <Button onClick={onSend} disabled={loading}>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AiChat;
