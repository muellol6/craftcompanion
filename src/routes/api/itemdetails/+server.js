import { connectDB } from "$lib/server/db";

export async function GET({ url }) {
    const name = url.searchParams.get("name");

    if (!name) {
        return new Response(JSON.stringify({ error: "Missing name" }), { status: 400 });
    }

    const db = await connectDB();

    const item = await db.collection("ItemAvailable").findOne({ name });

    if (!item) {
        return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({
        name: item.name,
        requires: item.requires,     // Array: [{ name: "Iron Ingot", amount: 3 }]
        output: item.output          // z.B. "1" oder "4"
    }), {
        headers: { "Content-Type": "application/json" }
    });
}
