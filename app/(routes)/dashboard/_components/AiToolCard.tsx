"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { v4 as uuidv4 } from "uuid";
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

  const onClickButton = async () => {
    // create new record to history table
    const result = await axios.post("/api/history", {
      recordId: id,
      content: [],
    });
    console.log(result);
    router.push(tool.path + "/" + id);
  };
  return (
    <div className="p-3 border rounded-xl">
      <Image src={tool.icon} width={40} height={40} alt="icon" />
      <h2 className="font-bold mt-2">{tool.name}</h2>
      <p className="text-gray-400">{tool.desc}</p>
      <Link href={tool.path + "/" + id}>
        <Button onClick={onClickButton} className="w-full mt-3">
          {tool.button}
        </Button>
      </Link>
    </div>
  );
}

export default AiToolCard;
