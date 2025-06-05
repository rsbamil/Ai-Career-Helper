// route.ts
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { helloWorld, AiCareerAgent } from "@/inngest/functions"; // make sure these are actual Inngest functions

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    AiCareerAgent,
    // do NOT include agents or empty objects here
  ],
});
