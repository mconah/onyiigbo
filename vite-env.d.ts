/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string
  readonly VITE_APPWRITE_PROJECT_ID: string
  readonly VITE_APPWRITE_DATABASE_ID: string
  readonly VITE_APPWRITE_USERS_COLLECTION_ID: string
  readonly VITE_APPWRITE_SERVICE_REQUESTS_COLLECTION_ID: string
  readonly VITE_APPWRITE_BLOG_POSTS_COLLECTION_ID: string
  readonly VITE_APPWRITE_NEWS_POSTS_COLLECTION_ID: string
  readonly VITE_APPWRITE_CHATS_COLLECTION_ID: string
  readonly VITE_APPWRITE_MESSAGES_COLLECTION_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
