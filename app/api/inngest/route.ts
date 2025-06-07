// route.ts
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { AiCareerAgent, AiResumeAgent } from "@/inngest/functions"; // make sure these are actual Inngest functions

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    AiCareerAgent,
    AiResumeAgent,
    // do NOT include agents or empty objects here
  ],
});
