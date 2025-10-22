import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatState, setChatState] = useState({
    isOpen: false,
    activeChat: null,
  });

  const openChat = (chat) => {
    setChatState({ isOpen: true, activeChat: chat });
  };

  const closeChat = () => {
    setChatState({ isOpen: false, activeChat: null });
  };

  return (
    <ChatContext.Provider value={{ ...chatState, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
