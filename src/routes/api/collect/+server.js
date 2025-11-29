import { connectDB } from "$lib/server/db";

export async function GET() {
    const db = await connectDB();

    // 1. Alles aus ItemList holen
    const list = await db.collection("ItemList").find().toArray();

    // 2. Alle craftbaren Items aus ItemAvailable holen
    const recipes = await db.collection("ItemAvailable").find().toArray();

    // Map zum schnellen Zugriff
    const recipeMap = new Map();
    recipes.forEach(r => recipeMap.set(r.name, r));

    // 3. Materialien-Sammelbeutel
    const materials = {};

    // 4. Rekursive Funktion
    function addIngredients(itemName, amount) {
        const craft = recipeMap.get(itemName);

        // Wenn kein Rezept → direkt als Material zählen
        if (!craft) {
            materials[itemName] = (materials[itemName] || 0) + amount;
            return;
        }

        const output = craft.output || 1;
        const multiplier = amount / output;

        for (const [mat, qty] of Object.entries(craft.ingredients)) {
            const total = qty * multiplier;
            addIngredients(mat, total);
        }
    }

    // 5. Für alle Items in ItemList ausführen
    for (const entry of list) {
        addIngredients(entry.name, entry.amount);
    }

    // 6. In alphabetischer Reihenfolge zurückgeben
    const sorted = Object.entries(materials)
        .map(([name, amount]) => ({
            name,
            amount: Math.ceil(amount) // aufrunden
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    return new Response(JSON.stringify(sorted), {
        headers: { "Content-Type": "application/json" }
    });
}
