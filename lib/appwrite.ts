import { Client, Databases } from "appwrite"

// Replace with your actual Appwrite Project ID and Endpoint
const client = new Client()
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "YOUR_APPWRITE_ENDPOINT") // Your Appwrite Endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "YOUR_APPWRITE_PROJECT_ID") // Your Appwrite Project ID

export const databases = new Databases(client)
export { client }

// Appwrite Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "YOUR_APPWRITE_DATABASE_ID" // Replace with your database ID
export const COLLECTION_ID_MESSAGES = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || "YOUR_APPWRITE_COLLECTION_ID" // Replace with your messages collection ID

