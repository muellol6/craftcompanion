import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    const { message } = await request.json();
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        return json({ reply: "API key missing." }, { status: 500 });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
`Du bist der CraftBot, ein freundlicher Minecraft-Experte.
Antworten müssen:
- nur über Minecraft handeln
- kurz & präzise sein (maximal 2–3 Sätze)
- keine Themen außerhalb von Minecraft beantworten.

Wenn eine Frage nicht zu Minecraft gehört, sage:
"Ich kann nur Fragen zu Minecraft beantworten."`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("OpenAI Error:", data.error);
            return json({ reply: "AI Error: " + data.error.message }, { status: 500 });
        }

        const reply = data.choices?.[0]?.message?.content ?? "No reply.";

        return json({ reply });

    } catch (err) {
        console.error("❌ Chat request failed:", err);
        return json({ reply: "Server error" }, { status: 500 });
    }
}
