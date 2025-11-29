import { connectDB } from "$lib/server/db";

// GET: All items (for Finder search bar)
export async function GET() {
    const db = await connectDB();
    const items = await db.collection("ItemAvailable").find({}, { projection: { name: 1, _id: 0 } }).toArray();

    return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" }
    });
}
