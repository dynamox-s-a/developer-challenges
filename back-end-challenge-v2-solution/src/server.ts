import app from "./app.js";
import { connectDB } from "./config/database.js";
import { env } from "./config/env.js";

async function start() {
  try {
    await connectDB();
    console.log("✓ Connected to MongoDB");

    app.listen(env.PORT, () => {
      console.log(`✓ Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
}

start();
