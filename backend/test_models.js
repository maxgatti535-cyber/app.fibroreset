import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function listModels() {
    try {
        // There isn't a direct listModels method on GenerativeModel, but usually on the client? 
        // The SDK exposes it differently. 
        // Actually the SDK doesn't always expose listModels easily in the simplified client.
        // Let's just try to call a simple model 'gemini-pro' and see if it works.
        console.log("Testing gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("gemini-pro success:", result.response.text());
    } catch (e) {
        console.error("gemini-pro failed:", e.message);
    }

    try {
        console.log("Testing gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.5-flash success:", result.response.text());
    } catch (e) {
        console.error("gemini-1.5-flash failed:", e.message);
    }
}

listModels();
