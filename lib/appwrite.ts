import { Client, Account, Databases } from 'appwrite';

// Appwrite configuration from environment variables
const client = new Client();
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT!)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID!);

export { client }; // Export client
export const account = new Account(client);
export const databases = new Databases(client);


// Database and Collection IDs
export const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID!;
export const usersCollectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID!;
export const serviceRequestsCollectionId = import.meta.env.VITE_APPWRITE_SERVICE_REQUESTS_COLLECTION_ID!;
export const blogPostsCollectionId = import.meta.env.VITE_APPWRITE_BLOG_POSTS_COLLECTION_ID!;
export const newsPostsCollectionId = import.meta.env.VITE_APPWRITE_NEWS_POSTS_COLLECTION_ID!;
export const chatsCollectionId = import.meta.env.VITE_APPWRITE_CHATS_COLLECTION_ID!;
export const messagesCollectionId = import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID!;