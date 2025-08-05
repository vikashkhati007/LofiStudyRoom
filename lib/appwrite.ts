import { Client, Databases, Account } from "appwrite"

// Replace with your actual Appwrite Project ID and Endpoint
// For local development, endpoint might be 'http://localhost/v1'
const client = new Client()
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "YOUR_APPWRITE_ENDPOINT") // Your Appwrite Endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "YOUR_APPWRITE_PROJECT_ID") // Your Appwrite Project ID

export const account = new Account(client)
export const databases = new Databases(client)
export { client }

// Appwrite Database and Collection IDs
export const DATABASE_ID = "66ca805d0029c5fcac86" // Replace with your database ID
export const COLLECTION_ID_MESSAGES = "689222a1002376841a74" // Replace with your messages collection ID