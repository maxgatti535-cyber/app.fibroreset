import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    const allowedOrigins = [
        'https://app-fibroreset.vercel.app'
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, system, history } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt mancante" });
    }

    try {
        let apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Configurazione incompleta: GEMINI_API_KEY non trovata su Vercel." });
        }

        apiKey = apiKey.trim();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: history || [],
            systemInstruction: {
                parts: [{ text: system || `Sei l'AI Coach ufficiale del "Metodo RESET FIBRO™" di Equilibria Reset.` }]
            },
        });

        const result = await chat.sendMessage(prompt);
        const text = result.response.text();

        res.status(200).json({ answer: text });
    } catch (e) {
        console.error("Gemini Error:", e);
        res.status(500).json({ 
            error: `Coach service error: ${e.message || "Unknown error"}.` 
        });
    }
}
