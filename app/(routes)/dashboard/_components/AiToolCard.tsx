"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ResumeUploadDialog from "./ResumeUploadDialog";

interface TOOL {
  name: string;
  desc: string;
  icon: string;
  button: string;
  path: string;
}

type AIToolProps = {
  tool: TOOL;
};

function AiToolCard({ tool }: AIToolProps) {
  const id = uuidv4();
  const { user } = useUser();
  const router = useRouter();
  const [openResumeUpload, setOpenResumeUpload] = useState(false);

  const onClickButton = async () => {
    if (tool.name === "AI Resume Analyzer") {
      setOpenResumeUpload(true);
      return;
    }

    const result = await axios.post("/api/history", {
      recordId: id,
      content: [],
      aiAgentType: tool.path,
    });

    router.push(tool.path + "/" + id);
  };

  return (
    <div className="p-3 border rounded-xl">
      <Image src={tool.icon} width={40} height={40} alt="icon" />
      <h2 className="font-bold mt-2">{tool.name}</h2>
      <p className="text-gray-400">{tool.desc}</p>

      {/* ✅ No <Link> here */}
      <Button onClick={onClickButton} className="w-full mt-3">
        {tool.button}
      </Button>

      <ResumeUploadDialog
        openResumeUpload={openResumeUpload}
        setOpenResumeUpload={setOpenResumeUpload}
      />
    </div>
  );
}

export default AiToolCard;
