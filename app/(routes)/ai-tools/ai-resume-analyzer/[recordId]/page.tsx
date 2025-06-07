"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Report from "./_component/Report";
import { Loader } from "lucide-react";

function AiResumeAnalyzer() {
  const { recordId } = useParams();
  const [pdfUrl, setPdfUrl] = useState();
  const [aiReport, setAiReport] = useState();
  useEffect(() => {
    recordId && getResumeAnalyzerRecord();
  }, [recordId]);
  const getResumeAnalyzerRecord = async () => {
    const result = await axios.get("/api/history?recordId=" + recordId);
    console.log(result.data);
    setPdfUrl(result.data?.metaData);
    setAiReport(result.data?.content);
  };
  return (
    <div className="grid lg:grid-cols-5 md:grid-cols-1 gap-20">
      <div className="col-span-2">
        <Report aiReport={aiReport} />
      </div>
      <div className="col-span-3">
        <h2 className="font-bold text-3xl">Resume Preview</h2>
        {pdfUrl ? (
          <iframe
            src={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0"}
            width={"100%"}
            height={1200}
            className="max-w-lg rounded-lg"
            style={{
              border: "none",
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-[100%]">
            <Loader className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

export default AiResumeAnalyzer;
