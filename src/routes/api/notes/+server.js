import { json } from "@sveltejs/kit";
import { connectDB } from "$lib/server/db";

export async function GET() {
    const db = await connectDB();
    const notes = await db.collection("notes").find().toArray();

    return json(notes);
}

export async function POST({ request }) {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
        return json({ error: "Text is required" }, { status: 400 });
    }

    const db = await connectDB();

    await db.collection("notes").insertOne({
        text,
        createdAt: new Date()
    });

    return json({ status: "ok" });
}
