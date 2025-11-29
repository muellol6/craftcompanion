import { MongoClient } from "mongodb";
import { MONGODB_URI } from "$env/static/private";

let client;
let db;

export async function connectDB() {
    if (!client) {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db("CraftCompanion");
        console.log("MongoDB connected");
    }
    return db;
}
