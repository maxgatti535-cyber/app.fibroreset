
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');

let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GOOGLE_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env file");
}

if (!apiKey) {
    console.error("No API key found in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    try {
        console.log("Testing startChat with gemini-2.0-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Test 1: startChat without systemInstruction
        console.log("1. startChat() empty...");
        const chat1 = model.startChat();
        const result1 = await chat1.sendMessage("Hello");
        console.log("Result 1:", result1.response.text());

        // Test 2: startChat with systemInstruction (string)
        console.log("2. startChat() with systemInstruction string...");
        try {
            const chat2 = model.startChat({ systemInstruction: "You are a helpful assistant." });
            const result2 = await chat2.sendMessage("Hello");
            console.log("Result 2:", result2.response.text());
        } catch (e) {
            console.error("Test 2 failed:", e.message);
        }

    } catch (error) {
        console.error("Global Error:", error);
    }
}

run();
