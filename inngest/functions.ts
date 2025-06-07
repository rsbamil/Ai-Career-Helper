import { db } from "@/configs/db";
import { inngest } from "./client";
import { createAgent, anthropic, gemini } from "@inngest/agent-kit";
import ImageKit from "imagekit";
import { HistoryTable } from "@/configs/schema";
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

var imagekit = new ImageKit({
  // @ts-ignore
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  // @ts-ignore
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  // @ts-ignore
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL,
});

export const AiResumeAnalyzerAgent = createAgent({
  name: "AiResumeAnalyzerAgent",
  description: "AI Resume Analyzer Agent help in Return Report",
  system: `You are an advanced AI Resume Analyzer Agent.
Your task is to evaluate a candidate’s resume and return a detailed analysis in the following structured JSON schema format.
The schema must match the layout and structure of a visual UI that includes overall score, section scores, summary feedback, improvement tips, strengths, and weaknesses.

📥 INPUT: I will provide a plain text resume.

🎯 GOAL: Output a JSON report as per the schema below. The report should reflect:

overall_score (0–100)

overall_feedback (short message e.g., "Excellent", "Needs improvement")

summary_comment (1–2 sentence evaluation summary)

Section scores for:

Contact Info

Experience

Education

Skills

Each section should include:

Score (as percentage)

Optional comment about that section

Tips for improvement (3–5 tips)
What’s Good (1–3 strengths)
Needs Improvement (1–3 weaknesses)
{
  "overall_score": 85,
  "overall_feedback": "Excellent",
  "summary_comment": "Your resume is strong, but there are areas to refine.",
  "sections": {
    "contact_info": {
      "score": 95,
      "comment": "Perfectly structured and complete."
    },
    "experience": {
      "score": 88,
      "comment": "Strong bullet points and impact."
    },
    "education": {
      "score": 72,
      "comment": "Consider adding relevant coursework."
    },
    "skills": {
      "score": 68,
      "comment": "Expand on specific skill proficiencies."
    }
  },
  "tips_for_improvement": [
    "Add more numbers and metrics to your experience section to show impact.",
    "Integrate more industry-specific keywords relevant to your target roles.",
    "Start bullet points with strong action verbs to make your achievements stand out."
  ],
  "whats_good": [
    "Clean and professional formatting.",
    "Clear and concise contact information.",
    "Relevant work experience."
  ],
  "needs_improvement": [
    "Skills section lacks detail.",
    "Some experience bullet points could be stronger.",
    "Missing a professional summary/objective."
  ]
}`,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});

export const AiResumeAgent = inngest.createFunction(
  { id: "AiResumeAgent" },
  { event: "AiResumeAgent" },
  async ({ event, step }) => {
    const { recordId, base64Resumefile, pdfText, aiAgentType, userEmail } =
      event.data;

    const uploadFileUrl = await step.run("uploadImage", async () => {
      try {
        let formattedBase64 = base64Resumefile;
        if (!base64Resumefile.startsWith("data:application/pdf;base64,")) {
          formattedBase64 = `data:application/pdf;base64,${base64Resumefile}`;
        }

        const imageKitFile = await imagekit.upload({
          file: formattedBase64,
          fileName: `${Date.now()}.pdf`,
          isPublished: true,
        });

        return imageKitFile.url;
      } catch (error) {
        console.error("ImageKit upload failed:", error);
        throw error;
      }
    });
    const aiResumeReport = await AiResumeAnalyzerAgent.run(pdfText);
    // @ts-ignore
    const rawContent = aiResumeReport.output[0]?.content;
    const rawContentJson = rawContent.replace("```json", "").replace("```", "");
    const parseJson = JSON.parse(rawContentJson);
    // return parseJson;

    // save to DB

    const saveToDb = await step.run("saveToDb", async () => {
      const result = await db.insert(HistoryTable).values({
        recordId: recordId,
        content: parseJson,
        aiAgentType: aiAgentType,
        createdAt: new Date().toString(),
        userEmail: userEmail,
        metaData: uploadFileUrl,
      });
      console.log(result);
      return parseJson;
    });
  }
);
