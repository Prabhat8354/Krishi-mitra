import "dotenv/config";
import mongoose from "mongoose";
import dns from "dns";

// Configure reliable DNS servers for Windows SRV record resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // Ignore if unsupported in environment
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/krishimitra";

/**
 * Global Mongoose Connection Cache for Next.js Serverless & Hot-Reloading
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // 1. If connection is already active (readyState === 1 Connected)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 2. If connection is currently connecting (readyState === 2 Connecting)
  if (mongoose.connection.readyState === 2 && cached.promise) {
    await cached.promise;
    return mongoose.connection;
  }

  // 3. Connection is disconnected (readyState 0) or uninitialized: Reset cache and initiate fresh connection
  cached.promise = null;
  cached.conn = null;

  const opts = {
    serverSelectionTimeoutMS: 10000,
    bufferCommands: true, // Enable standard command buffering during initial connection
  };

  console.log("⚡ [MONGODB INITIALIZING CONNECTION]:", MONGODB_URI.replace(/:([^@]+)@/, ":****@"));

  cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
    console.log("✅ [MONGODB CONNECTED SUCCESSFULLY]");
    return mongooseInstance;
  });

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    cached.conn = null;
    console.error("❌ [MONGODB CONNECTION EXCEPTION]:", e.message);
    throw new Error(`Database connection failed: ${e.message}`);
  }

  return cached.conn;
}

// Dummy export for backward compatibility with drizzle legacy imports
export const db = {} as any;
