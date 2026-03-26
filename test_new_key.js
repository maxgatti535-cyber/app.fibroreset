import { GoogleGenerativeAI } from "@google/generative-ai";

async function testKey() {
    const key = process.env.API_KEY;
    if (!key) {
        console.error("ERRORE: API_KEY non trovata nel file .env.local");
        return;
    }
    console.log("Testando modelli con chiave:", key.substring(key.length - 4));

    try {
        const genAI = new GoogleGenerativeAI(key);
        // Test gemini-pro instead of flash
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Ciao, rispondi con 'OK'");
        console.log("RISPOSTA GEMINI-PRO:", result.response.text());
    } catch (e) {
        console.error("ERRORE GEMINI-PRO:", e.message);
    }
}

testKey();
