import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client if API key is provided
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "UNI·MATE 2.0",
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// AI Academic Copilot Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, context } = req.body;
    const client = getGeminiClient();

    if (!client) {
      // Return structured response indicating API key is not set, client can provide smart fallback
      return res.status(200).json({
        fallback: true,
        message: "Gemini API key is not configured in environment. Utilizing UNI·MATE's local Academic Copilot Engine.",
      });
    }

    const systemInstruction = `You are UNI·MATE's Academic Copilot, an intelligent university advisor and study operating system assistant.
Your student is: ${context?.student?.name || "Student"} (${context?.student?.degree || "University Degree"}, ${context?.student?.year || "Year 3"}).

CURRENT ACADEMIC CONTEXT:
- Active Courses: ${JSON.stringify(context?.courses || [])}
- Upcoming Deadlines & Tasks: ${JSON.stringify(context?.tasks || [])}
- Upcoming Exams: ${JSON.stringify(context?.exams || [])}
- Current GPA: ${context?.gpa || "N/A"} / 10.0
- ECTS Progress: ${context?.ects || "N/A"}
- Workload Status: ${JSON.stringify(context?.workload || {})}
- Semester Health Score: ${context?.healthScore || "N/A"} / 10

GUIDELINES:
1. Speak with Apple/Linear-level calm, precision, and academic empathy.
2. Directly reference real courses, dates, tasks, and grades from the context. Never invent courses or exams not in the data.
3. Be concise and actionable. If recommending a study session or task, suggest concrete duration (e.g. 45 mins) and specific topic.
4. Provide structured suggestions when asked for a study plan.
5. If the user asks what to do right now, check their next class or free time in the schedule.`;

    const userMessage = messages[messages.length - 1]?.content || "Hello";

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemInstruction}\n\nUser Question:\n${userMessage}` }] }
      ],
    });

    const reply = response.text || "I have analyzed your academic schedule and courses.";

    return res.status(200).json({
      fallback: false,
      reply,
    });
  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process academic copilot request",
      fallback: true,
    });
  }
});

// Vite middleware in dev, static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`UNI·MATE 2.0 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
