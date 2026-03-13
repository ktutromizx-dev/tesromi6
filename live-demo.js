const http = require('http');

const request = (options, data) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') }));
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

async function runDemo() {
  console.log("--- STARTING LIVE API DEMO ---");
  
  try {
    // 1. Get initial products
    console.log("\n1. Fetching initial products...");
    const initial = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products',
      method: 'GET'
    });
    console.log(`Status: ${initial.statusCode}`);
    console.log(`Current products count: ${initial.body.length}`);

    // 2. Add a new Laptop
    console.log("\n2. Adding a new Laptop (MacBook Pro)...");
    const addProduct = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: "MacBook Pro M3",
      category: "Laptop",
      price: 2500,
      stock: 5
    });
    console.log(`Status: ${addProduct.statusCode}`);
    console.log("Response:", addProduct.body);
    console.log(`Verified Server-side Logic: Tax=$${addProduct.body.tax}, Discount=$${addProduct.body.discount}`);

    // 3. Verify in list
    console.log("\n3. Fetching updated products list...");
    const updated = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products',
      method: 'GET'
    });
    console.log(`New products count: ${updated.body.length}`);
    
    // 4. Test Bulk Restock
    console.log("\n4. Testing Bulk Restock (+10 units)...");
    const bulk = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products/bulk-restock',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { amount: 10 });
    console.log(`Status: ${bulk.statusCode}`);
    console.log("Response:", bulk.body);

    // 5. Check Inventory Logs
    console.log("\n5. Fetching Audit Logs...");
    const logs = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/inventory-logs',
      method: 'GET'
    });
    console.log(`Logs found: ${logs.body.length}`);
    if (logs.body.length > 0) {
      console.log(`Latest log: ${logs.body[0].note} with change ${logs.body[0].changeAmount}`);
    }

    console.log("\n--- LIVE DEMO COMPLETED SUCCESSFULLY ---");
  } catch (err) {
    console.error("Demo failed:", err.message);
  }
}

runDemo();
