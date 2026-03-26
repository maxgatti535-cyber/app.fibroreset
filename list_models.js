import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
    const key = process.env.API_KEY;
    if (!key) {
        console.error("ERRORE: API_KEY non trovata nel file .env.local");
        return;
    }
    console.log("Listing models for key:", key.substring(key.length - 4));

    try {
        // We use a raw fetch to see everything
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("MODELLI DISPONIBILI:");
            data.models.forEach(m => console.log("- " + m.name));
        } else {
            console.log("Nessun modello trovato o errore:", JSON.stringify(data));
        }
    } catch (e) {
        console.error("ERRORE:", e.message);
    }
}

listModels();
