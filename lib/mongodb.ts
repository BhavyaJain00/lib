import "server-only";
import { MongoClient, type Db } from "mongodb";

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "navya_computech";

/**
 * Whether MongoDB is configured. Works with any MongoDB — a local server
 * (mongodb://localhost:27017, browsable in MongoDB Compass) or an Atlas cloud
 * cluster (mongodb+srv://...). The whole site is built to run without it
 * (falling back to the sample data in lib/data.ts), so every data path checks
 * this and degrades gracefully.
 */
export const isDbConfigured = Boolean(URI);

// Cache the client across hot reloads in dev, and across lambda invocations in
// production — otherwise every request opens a new connection pool.
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> | null {
  if (!URI) return null;
  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(URI, {
      // Keep the pool small — serverless/dev friendly.
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    });
    globalForMongo._mongoClientPromise = client.connect();
  }
  return globalForMongo._mongoClientPromise;
}

/**
 * Returns the database handle, or null when MONGODB_URI is not set or the
 * connection fails (e.g. the local MongoDB service isn't running). Callers
 * fall back to static sample data.
 */
export async function getDb(): Promise<Db | null> {
  try {
    // getClientPromise() is inside the try because `new MongoClient(uri)`
    // throws synchronously on a malformed URI (e.g. a half-pasted Atlas
    // string). Without this, a typo in MONGODB_URI would crash every page
    // instead of falling back to the sample data.
    const promise = getClientPromise();
    if (!promise) return null;
    const client = await promise;
    return client.db(DB_NAME);
  } catch (err) {
    console.error(
      "[mongodb] connection failed — falling back to sample data:",
      (err as Error).message,
    );
    // Let a later request retry with a fresh connection.
    globalForMongo._mongoClientPromise = undefined;
    return null;
  }
}

export const COLLECTIONS = {
  courses: "courses",
  inquiries: "inquiries",
  activity: "activity",
} as const;
