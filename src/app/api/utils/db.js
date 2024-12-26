import { MongoClient } from "mongodb";

// MongoDB URI from environment variable
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const options = {};

// Global variable to hold MongoDB client promise (for connection reuse)
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use global to retain client connection between hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, just create a new connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Function to return the database instance
export async function getDB() {
  const client = await clientPromise;
  return client.db("affordmotors"); // You can specify your database name here
}
