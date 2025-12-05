import { json } from "@sveltejs/kit";
import { connectDB } from "$lib/server/db";

export async function PUT({ params, request }) {
    const { id } = params;
    const { text } = await request.json();

    const { ObjectId } = await import("mongodb");
    const db = await connectDB();

    await db.collection("notes").updateOne(
        { _id: new ObjectId(id) },
        { $set: { text } }
    );

    return json({ status: "updated" });
}

export async function DELETE({ params }) {
    const { id } = params;
    const { ObjectId } = await import("mongodb");

    const db = await connectDB();
    await db.collection("notes").deleteOne({ _id: new ObjectId(id) });

    return json({ status: "deleted" });
}
