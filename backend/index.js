require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/generate-script
 * Body: { "prompt": string }
 * Returns: { "script": string }
 */
app.post("/api/generate-script", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use GPT-4 family model; adjust as needed
      messages: [
        {
          role: "system",
          content:
            "You are a creative assistant that writes concise, engaging short-form video scripts (<= 150 words).",
        },
        {
          role: "user",
          content: `Create a short, engaging script about: "${prompt}"`,
        },
      ],
    });

    const script = completion.choices?.[0]?.message?.content?.trim();

    if (!script) throw new Error("No script generated");

    return res.json({ script });
  } catch (error) {
    console.error("OpenAI error:", error);
    return res.status(500).json({ error: "Failed to generate script" });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend API server listening on http://localhost:${PORT}`);
});