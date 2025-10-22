

export interface User {
  $id: string; // Appwrite document ID
  appwrite_user_id: string; // Appwrite user ID from Auth
  name: string;
  email: string;
  role: 'Client' | 'Tutor' | 'Service Provider' | 'Admin';
  interests: string[];
  status: 'Active' | 'Verified' | 'Pending Verification' | 'Suspended';
  joined: string; // Date string 'YYYY-MM-DD'
  bio?: string;
  location?: string;
  specialty?: 'Beginner' | 'Conversational' | 'Advanced' | 'Children' | 'Business';
  avatar?: string;
  availability?: 'remote' | 'in-person'; // Added for Tutors
}

export interface Tutor {
  $id: string; // Appwrite document ID (from users_profile collection)
  appwrite_user_id: string; // NEW: Added appwrite_user_id for linking
  name: string;
  location: string;
  specialty: 'Beginner' | 'Conversational' | 'Advanced' | 'Children' | 'Business';
  availability: 'remote' | 'in-person';
  avatar: string;
  bio: string;
}

export interface ServiceRequest {
  $id: string; // Appwrite document ID
  service: string; // service_type
  client_appwrite_id: string; // Reference to User.appwrite_user_id
  clientName: string; // client_name
  description: string;
  date: string; // date_requested
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  assigned_provider_appwrite_id: string | null; // Reference to User.appwrite_user_id
  budget?: string;
  deadline?: string;
}

export interface Post {
    $id: string; // Appwrite document ID
    title: string;
    author: string; // author_name
    date: string; // date_published
    category: string;
    excerpt: string;
    content: string; // Lexical JSON string
}

export interface NewsPost {
    $id: string; // Appwrite document ID
    title: string;
    author: string; // author_name
    date: string; // date_published
    category: string;
    excerpt: string;
    content: string; // Lexical JSON string
    image: string;
}

// NEW: Chat Interfaces
export interface Chat {
  $id: string; // Appwrite document ID
  participant_ids: string[]; // Array of appwrite_user_id (exactly two)
  participant_names: string[]; // Array of user names (corresponding to participant_ids)
  last_message?: string;
  last_message_timestamp?: number;
  created_at: string; // ISO date string
  service_request_id?: string; // Optional: Link to a service request if chat originated from booking
}

export interface Message {
  $id: string; // Appwrite document ID
  chat_id: string; // Reference to Chat.$id
  sender_id: string; // Reference to User.appwrite_user_id
  sender_name: string;
  content: string;
  timestamp: number; // Unix timestamp
}