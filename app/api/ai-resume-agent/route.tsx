import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { inngest } from "@/inngest/client";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const FormData = await req.formData();
  const resumeFile: any = FormData.get("resumeFile");
  const recordId = FormData.get("recordId");
  const user = await currentUser();
  // 1. Load PDF content
  const loader = new WebPDFLoader(resumeFile);
  const docs = await loader.load();
  const pdfText = docs[0]?.pageContent;

  // 2. Convert to base64
  const arrayBuffer = await resumeFile.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  // 3. Send event to Inngest
  const sendResult = await inngest.send({
    name: "AiResumeAgent",
    data: {
      recordId,
      base64Resumefile: base64,
      pdfText,
      aiAgentType: "/ai-tools/ai-resume-analyzer",
      userEmail: user?.primaryEmailAddress?.emailAddress,
    },
  });

  const eventId = sendResult.ids[0];

  // 4. Poll for run associated with the eventId
  let runOutput = null;

  while (true) {
    const runsResponse = await getRuns(eventId); // note: eventId, not runId
    const run = runsResponse?.data?.[0];

    if (run?.status === "Completed") {
      const maybeOutput = run?.output?.output;
      runOutput =
        Array.isArray(maybeOutput) && maybeOutput.length > 0
          ? maybeOutput[0]
          : run?.output || {};
      break;
    }

    if (run?.status === "Failed") {
      throw new Error("Function failed: " + JSON.stringify(run));
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  try {
    return NextResponse.json(runOutput);
  } catch (err) {
    console.error("Serialization error in runOutput:", err);
    return NextResponse.json({ error: "Serialization failed", details: err });
  }
}

export async function getRuns(eventId: string) {
  const result = await axios.get(
    `${process.env.INNGEST_SERVER_HOST}/v1/events/${eventId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );
  return result.data;
}
