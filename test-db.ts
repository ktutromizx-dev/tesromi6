import { db } from "./src/lib/db";
import { products } from "./src/lib/db/schema";

async function testConnection() {
    try {
        console.log("Testing Drizzle Relational Query API...");
        const allProducts = await db.query.products.findMany();
        console.log("Query successful. Products count:", allProducts.length);
        console.log("Products:", allProducts);
    } catch (error) {
        console.error("Query failed:", error);
    }
}

testConnection();
