// src/routes/api/chat/+server.js
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    const { message } = await request.json();
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        console.error("❌ API key not loaded");
        return json({ reply: "API key missing." }, { status: 500 });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                input: message
            })
        });

        const data = await response.json();
        console.log(data); // <-- Zum Debuggen

        return json({
            reply: data.output_text // ⚡ NEUE API → klappt zuverlässig!
        });

    } catch (err) {
        console.error("AI Request failed:", err);
        return json({ reply: "Server error talking to OpenAI." }, { status: 500 });
    }
}
