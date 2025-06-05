"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import React, { useState } from "react";
import EmptyState from "./_components/EmptyState";

function AiChat() {
  const [userInput, setUserInput] = useState<string>();

  return (
    <div className="px-10 md:px-24 lg:px-36 xl:px-48">
      <div className="flex items-center justify-between gap-8">
        <div>
          <h2 className="font-bold text-lg">Ai Career Q/A Chat</h2>
          <p>Smarter Career decisions start here with AI Ask questions</p>
        </div>
        <Button>+ New Chat</Button>
      </div>

      <div className="flex flex-col h-[65vh]">
        <div>
          {/* Empty State Option */}
          <EmptyState selectedQuestion={(q: string) => setUserInput(q)} />
        </div>
        <div className="flex-1">{/* Message List */}</div>
        <div className="flex items-center justify-between gap-3">
          {/* Input Field and Send Button */}
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a question"
          />
          <Button>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AiChat;
