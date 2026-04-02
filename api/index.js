import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    const allowedOrigins = [
        'https://app-fibroreset.vercel.app',
        'http://localhost:5173',
        'http://localhost:5176'
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
        
        // Use standard model name without explicit API version to let SDK handle it
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Point 3: SDK is latest. We use history-based grounding to bypass field errors
        const systemPrompt = system || `Sei l'AI Coach ufficiale del "Metodo RESET FIBRO™" di Equilibria Reset. Rispondi sempre in ITALIANO.`;
        const groundedHistory = [
            { role: 'user', parts: [{ text: `ISTRUZIONI DI SISTEMA: ${systemPrompt}` }] },
            { role: 'model', parts: [{ text: 'Certamente. Ho compreso perfettamente il mio ruolo di AI Coach ufficiale del Metodo RESET FIBRO™.' }] },
            ...(history || [])
        ];

        const chat = model.startChat({
            history: groundedHistory,
        });

        const result = await chat.sendMessage(prompt);
        const text = result.response.text();

        res.status(200).json({ answer: text });
    } catch (e) {
        console.error("Gemini Error:", e);
        
        // Handle Rate Limit specifically
        if (e.message?.includes('429') || e.message?.includes('Too Many Requests')) {
            return res.status(429).json({ 
                error: "Il Coach sta riflettendo... troppe richieste simultanee. Riprovo tra un istante.",
                retryAfter: 5
            });
        }

        res.status(500).json({ 
            error: `Coach service error: ${e.message || "Unknown error"}.` 
        });
    }
}
