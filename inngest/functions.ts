import { inngest } from "./client";
import { createAgent, anthropic, gemini } from "@inngest/agent-kit";

// Sample hello-world function
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

// Create AI career chat agent
export const aiCareerChatAgent = createAgent({
  name: "Ai Career Chat Agent",
  description: "An Ai Agent that answers career related questions.",
  system: `You are a helpful Ai Agent that answers career related questions. You should always answer in a way that is relevant to the question and provides relevant information.`,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});

// Inngest function to handle AiCareerAgent events
export const AiCareerAgent = inngest.createFunction(
  { id: "AiCareerAgent" },
  { event: "AiCareerAgent" },
  async ({ event, step }) => {
    const { userInput } = await event?.data;
    const result = await aiCareerChatAgent.run(userInput);
    return result;
  }
);
