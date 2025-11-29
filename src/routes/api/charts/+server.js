import { connectDB } from "$lib/server/db";

export async function GET() {
    const db = await connectDB();

    const itemList = await db.collection("ItemList").find().toArray();
    const itemAvailable = await db.collection("ItemAvailable").find().toArray();

    const counts = {};

    for (const entry of itemList) {
        const item = itemAvailable.find(a => a.name === entry.name);
        if (!item || !item.category) continue;

        if (!counts[item.category]) counts[item.category] = 0;
        counts[item.category] += Number(entry.amount) || 1;
    }

    return new Response(JSON.stringify(counts), {
        headers: { "Content-Type": "application/json" }
    });
}
