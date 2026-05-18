import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini AI Setup for Metadata Extraction
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  // API Route: Extract Metadata from URL
  app.post("/api/extract", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract music metadata from this URL: ${url}. 
        Return a JSON object with: title, artist, album, coverArtUrl, duration (seconds), type (song/playlist/album/artist), and streamableId (if applicable).
        If you can't find specific data, make best guesses based on the URL context.`,
        config: { responseMimeType: "application/json" }
      });

      const metadata = JSON.parse(response.text);
      res.json(metadata);
    } catch (error) {
      console.error("Extraction error:", error);
      res.status(500).json({ error: "Failed to extract metadata" });
    }
  });

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
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
    console.log(`🚀 SonicStream Server running on http://localhost:${PORT}`);
  });
}

startServer();
