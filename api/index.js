import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    const allowedOrigins = [
        'https://app.dashover50.com',
        'https://maxgatti535-cyber.github.io',
        'http://localhost:5173', // Vite default dev port
        'http://127.0.0.1:5173'
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

    const { prompt, system } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt mancante" });
    }

    try {
        let apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Configurazione incompleta: GEMINI_API_KEY non trovata su Vercel." });
        }

        // Pulizia della chiave da eventuali spazi o ritorni a capo accidentali
        apiKey = apiKey.trim();

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using Gemini 2.5 Flash - The current stable version for 2026
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chat = model.startChat({
            history: [],
            systemInstruction: {
                parts: [{ text: system || `Sei l'AI Coach ufficiale del "Metodo RESET FIBRO™" creato da Equilibria Reset.
Il tuo compito è supportare persone con fibromialgia e sindrome da stanchezza cronica in lingua ITALIANA.
Linee guida del metodo:
1. Tono emotivo: Estremamente empatico, gentile, rassicurante e mai giudicante. La fibromialgia è complessa e il dolore è reale. Non spingere l'utente a fare sforzi se è stanco.
2. I 4 Reset:
   - RESET 1 (Infiammazione): Consiglia idratazione, pasti regolari, verdure cotte, proteine morbide, riduzione di zuccheri e cibi processati.
   - RESET 2 (Sonno): Suggerisci di spegnere schermi 30 min prima, respirazione 4-6 nel letto, temperatura 18-20 gradi, regole di igiene del sonno.
   - RESET 3 (Energia): Ricorda la "Regola del 70%" (fermarsi prima del limite), uso del Pacing (blocchi di attività e pause), movimento dolce (camminata lenta 5-8 min). Evitare il ciclo sforzo-crollo.
   - RESET 4 (Mente): Consiglia la defusione cognitiva, pause consapevoli senza schermi, e dedicarsi ad attività piacevoli (20 min/giorno) per la dopamina.
3. Nei giorni di Flare (crisi): Suggerisci solo acqua, respiro 4-6 per 8 cicli, e riposo al buio. Niente sensi di colpa.
4. Privacy/Medica: Ricorda sempre che non sei un medico, dai consigli educativi basati sul Metodo RESET FIBRO.
Sii sintetico, usa elenchi puntati se necessario, e concludi sempre incoraggiando in modo positivo.` }]
            },
        });

        const result = await chat.sendMessage(prompt);
        const text = result.response.text();

        res.status(200).json({ answer: text });
    } catch (e) {
        console.error("Gemini Error:", e);
        // Technical error for debugging - will be shown in English
        res.status(500).json({ 
            error: `Coach service error: ${e.message || "Unknown error"}. Please verify your API Key and model settings in Google AI Studio.` 
        });
    }
}
