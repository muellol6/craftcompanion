import { connectDB } from "$lib/server/db";
import { json } from "@sveltejs/kit";

export async function GET() {
    const db = await connectDB();
    const items = await db.collection("ItemList").find().toArray();

    return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" }
    });
}

export async function POST({ request }) {
    const data = await request.json();
    const db = await connectDB();

    // Always convert amount to number
    data.amount = Number(data.amount);

    if (!data.name || isNaN(data.amount) || data.amount < 1) {
        return new Response(
            JSON.stringify({ error: "Invalid fields" }),
            { status: 400 }
        );
    }

    /* ---------------------------------------------------
       1️⃣ Kategorie aus ItemAvailable auslesen
    --------------------------------------------------- */
    const referenceItem = await db.collection("ItemAvailable").findOne({
        name: data.name
    });

    if (!referenceItem) {
        return new Response(
            JSON.stringify({ error: "Item does not exist in ItemAvailable" }),
            { status: 400 }
        );
    }

    const category = referenceItem.category; // << Kategorie hier!

    /* ---------------------------------------------------
       2️⃣ Wenn Item existiert → Menge erhöhen
    --------------------------------------------------- */
    const existingItem = await db.collection("ItemList").findOne({
        name: data.name
    });

    if (existingItem) {
        await db.collection("ItemList").updateOne(
            { _id: existingItem._id },
            {
                $inc: { amount: data.amount }
            }
        );

        return json({ status: "stacked" });
    }

    /* ---------------------------------------------------
       3️⃣ Neues Item speichern – MIT KATEGORIE!
    --------------------------------------------------- */
    await db.collection("ItemList").insertOne({
        name: data.name,
        amount: data.amount,
        category: category,         // << HIER WICHTIG!
        createdAt: new Date()
    });

    return json({ status: "ok" });
}

export async function DELETE({ request }) {
    const { id } = await request.json();

    if (!id) {
        return new Response(
            JSON.stringify({ error: "Missing id" }),
            { status: 400 }
        );
    }

    const db = await connectDB();
    const { ObjectId } = await import("mongodb");

    await db.collection("ItemList").deleteOne({ _id: new ObjectId(id) });

    return json({ status: "deleted" });
}
