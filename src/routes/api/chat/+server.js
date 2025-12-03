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
                model: "gpt-4o-mini",      // nur Modell
                input: message             // Nachricht
            })
        });

        const data = await response.json();

        // Wenn OpenAI Fehler zurückgibt:
        if (data.error) {
            console.error("❌ OpenAI API Error:", data.error);
            return json(
                { reply: "AI Error: " + data.error.message },
                { status: 500 }
            );
        }

        // Erfolgreiche Antwort
        return json({
            reply: data.output_text || "No response."
        });

    } catch (err) {
        console.error("❌ Request failed:", err);
        return json(
            { reply: "Server error talking to OpenAI." },
            { status: 500 }
        );
    }
}
