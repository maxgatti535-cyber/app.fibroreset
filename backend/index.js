import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config(); // carica GOOGLE_API_KEY da .env

const app = express();
app.use(cors({ origin: true }));          // permette richieste dal frontend
app.use(express.json());                  // per body JSON

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// POST /chat → { prompt: "...", system: "..." }
app.post("/chat", async (req, res) => {
    const { prompt, system } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt mancante" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const chat = system
            ? model.startChat({ systemInstruction: system })
            : model.startChat();

        const result = await chat.sendMessage(prompt);
        const text = result.response.text();

        res.json({ answer: text });
    } catch (e) {
        console.error("Errore Gemini:", e);
        res.status(500).json({ error: "Errore interno del modello" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🛡️  Backend in ascolto su http://localhost:${PORT}`);
});
