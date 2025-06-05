"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LoaderCircle, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import EmptyState from "../_components/EmptyState";
import axios from "axios";
import Markdown from "marked-react";
import { useParams } from "next/navigation";

type messages = {
  content: string;
  role: string;
  type: string;
};

function AiChat() {
  const [userInput, setUserInput] = useState<string>();

  const [loading, setLoading] = useState(false);

  const [messageList, setMessageList] = useState<messages[]>([]);

  const { chatid }: any = useParams();
  console.log(chatid);

  const onSend = async () => {
    setLoading(true);
    setMessageList((prev) => [
      ...prev,
      {
        content: userInput || "",
        role: "user",
        type: "text",
      },
    ]);
    setUserInput("");
    const result = await axios.post("/api/ai-career-chat-agent", {
      userInput: userInput,
    });
    setMessageList((prev) => [...prev, result.data]);
    setLoading(false);
  };
  useEffect(() => {
    // save messages to database
    messageList.length > 0 && updateMessagesList();
  }, [messageList]);

  const updateMessagesList = async () => {
    const result = await axios.put("/api/history", {
      content: messageList,
      recordId: chatid,
    });
    console.log(result);
  };
  return (
    <div className="px-10 md:px-24 lg:px-36 xl:px-48 h-[75vh] overflow-auto">
      <div className="flex items-center justify-between gap-8">
        <div>
          <h2 className="font-bold text-lg">Ai Career Q/A Chat</h2>
          <p>Smarter Career decisions start here with AI Ask questions</p>
        </div>
        <Button>+ New Chat</Button>
      </div>

      <div className="flex flex-col h-[65vh]">
        {messageList?.length <= 0 && (
          <div className="mt-5">
            {/* Empty State Option */}
            <EmptyState selectedQuestion={(q: string) => setUserInput(q)} />
          </div>
        )}
        <div className="flex-1 mt-5">
          {/* Message List */}
          {messageList.map((message, index) => {
            return (
              <div>
                <div
                  key={index}
                  className={`flex mb-2 ${
                    message.role == "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg gap-2 ${
                      message.role == "user"
                        ? "bg-gray-200 text-black rounded-lg"
                        : "bg-gray-50 text-black"
                    } `}
                  >
                    <Markdown>{message.content}</Markdown>
                  </div>
                </div>
                {loading && messageList?.length - 1 == index && (
                  <div className="flex justify-start p-3 rounded-lg gap-2 bg-gray-50 text-black mb-2">
                    <LoaderCircle className="animate-spin" /> Thinking...
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-3 absolute bottom-5 w-[50%]">
          {/* Input Field and Send Button */}
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
