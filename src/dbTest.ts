import pool from "./config/database.js";

async function testDBConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully!");

    // Optional: test a simple query
    const res = await client.query("SELECT NOW()");
    console.log("Current time from DB:", res.rows[0]);

    client.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  } finally {
    await pool.end(); // close pool after test
  }
}

testDBConnection();
