import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Chat } from '../data/mockData';

interface ChatContextType {
  isOpen: boolean;
  activeChat: Chat | null;
  currentUser: User | null;
  openChat: (chat: Chat) => void;
  closeChat: () => void;
  createChat: (otherUserId: string, otherUserName: string, serviceRequestId?: string) => Promise<void>;
  openChatByServiceRequest: (otherUserId: string, otherUserName: string, serviceRequestId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
  currentUser?: User | null;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, currentUser = null }) => {
  const [chatState, setChatState] = useState<{
    isOpen: boolean;
    activeChat: Chat | null;
  }>({
    isOpen: false,
    activeChat: null,
  });

  const openChat = (chat: Chat) => {
    setChatState({ isOpen: true, activeChat: chat });
  };

  const closeChat = () => {
    setChatState({ isOpen: false, activeChat: null });
  };

  const createChat = async (otherUserId: string, otherUserName: string, serviceRequestId?: string): Promise<void> => {
    // This is a placeholder - actual implementation would create a chat in Appwrite
    console.log('Creating chat with:', otherUserId, otherUserName, serviceRequestId);
  };

  const openChatByServiceRequest = (otherUserId: string, otherUserName: string, serviceRequestId: string) => {
    // This is a placeholder - actual implementation would find or create a chat
    console.log('Opening chat for service request:', serviceRequestId, 'with:', otherUserId);
  };

  return (
    <ChatContext.Provider value={{ 
      ...chatState, 
      currentUser,
      openChat, 
      closeChat,
      createChat,
      openChatByServiceRequest 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
