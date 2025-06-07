"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { File, Loader2Icon, Sparkles, SparklesIcon } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

function ResumeUploadDialog({ openResumeUpload, setOpenResumeUpload }: any) {
  const [file, setFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file.name);
      setFile(file);
    }
  };

  const onUploadAndAnalyze = async () => {
    setLoading(true);
    const recordId = uuidv4();
    const formData = new FormData();
    formData.append("recordId", recordId);
    formData.append("resumeFile", file);

    //  Now send formData to backend Server
    const result = await axios.post("/api/ai-resume-agent", formData);
    console.log(result.data);
    setLoading(false);
    router.push("/ai-tools/ai-resume-analyzer/" + recordId);
    setOpenResumeUpload(false);
  };
  return (
    <Dialog open={openResumeUpload} onOpenChange={setOpenResumeUpload}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Resume PDF File</DialogTitle>
            <DialogDescription>
              <div>
                <label
                  htmlFor="resumeUpload"
                  className="flex flex-col items-center justify-center p-7 border border-dashed rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  <File className="h-10 w-10 text-gray-500" />
                  {file ? (
                    <h2 className="mt-3 text-blue-600 text-sm">{file.name}</h2>
                  ) : (
                    <h2 className="mt-3 text-sm">
                      Click Here to upload pdf file
                    </h2>
                  )}
                </label>
                <input
                  className="hidden"
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  onChange={onFileChange}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"outline"}>Cancel</Button>
            <Button disabled={!file} onClick={onUploadAndAnalyze}>
              {loading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <SparklesIcon />
              )}
              Upload and Analyze
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default ResumeUploadDialog;
