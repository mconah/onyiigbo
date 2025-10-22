import React, { useState, useEffect, useRef } from 'react';
import { User, Chat, Message } from '../../data/mockData';
import { databases, dbId, client } from '../../lib/appwrite';
import { ID, Query } from 'appwrite';
import Button from '../Button';

interface ChatInterfaceProps {
  user: User;
  chatsCollectionId: string;
  messagesCollectionId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, chatsCollectionId, messagesCollectionId }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user's chats
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          dbId,
          chatsCollectionId,
          [
            Query.search('participant_ids', user.appwrite_user_id),
            Query.orderDesc('$createdAt'),
            Query.limit(50)
          ]
        );
        const fetchedChats: Chat[] = response.documents.map((doc: any) => ({
          $id: doc.$id,
          participant_ids: doc.participant_ids,
          participant_names: doc.participant_names,
          last_message: doc.last_message,
          last_message_timestamp: doc.last_message_timestamp,
          created_at: doc.$createdAt,
          service_request_id: doc.service_request_id,
        }));
        setChats(fetchedChats);
      } catch (err) {
        console.error('Failed to fetch chats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [user.appwrite_user_id, dbId, chatsCollectionId]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const response = await databases.listDocuments(
          dbId,
          messagesCollectionId,
          [
            Query.equal('chat_id', selectedChat.$id),
            Query.orderAsc('timestamp'),
            Query.limit(100)
          ]
        );
        const fetchedMessages: Message[] = response.documents.map((doc: any) => ({
          $id: doc.$id,
          chat_id: doc.chat_id,
          sender_id: doc.sender_id,
          sender_name: doc.sender_name,
          content: doc.content,
          timestamp: doc.timestamp,
        }));
        setMessages(fetchedMessages);
        scrollToBottom();
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates for this chat
    const unsubscribe = client.subscribe(
      `databases.${dbId}.collections.${messagesCollectionId}.documents`,
      (response: any) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          const newMsg = response.payload;
          if (newMsg.chat_id === selectedChat.$id) {
            setMessages(prev => [...prev, {
              $id: newMsg.$id,
              chat_id: newMsg.chat_id,
              sender_id: newMsg.sender_id,
              sender_name: newMsg.sender_name,
              content: newMsg.content,
              timestamp: newMsg.timestamp,
            }]);
            scrollToBottom();
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedChat, dbId, messagesCollectionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || sending) return;

    setSending(true);
    try {
      const timestamp = Date.now();
      await databases.createDocument(
        dbId,
        messagesCollectionId,
        ID.unique(),
        {
          chat_id: selectedChat.$id,
          sender_id: user.appwrite_user_id,
          sender_name: user.name,
          content: newMessage.trim(),
          timestamp,
        }
      );

      // Update chat's last message
      await databases.updateDocument(
        dbId,
        chatsCollectionId,
        selectedChat.$id,
        {
          last_message: newMessage.trim(),
          last_message_timestamp: timestamp,
        }
      );

      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipantName = (chat: Chat): string => {
    const otherIndex = chat.participant_ids.findIndex(id => id !== user.appwrite_user_id);
    return chat.participant_names[otherIndex] || 'Unknown';
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <div className="text-center py-10 text-secondary-text">Loading chats...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-[600px] flex">
      {/* Chat List Sidebar */}
      <div className="w-1/3 border-r border-soft-gray overflow-y-auto">
        <div className="p-4 border-b border-soft-gray bg-light-lavender">
          <h3 className="font-bold text-lg text-primary-text">Messages</h3>
        </div>
        {chats.length === 0 ? (
          <div className="p-4 text-center text-secondary-text">
            <p>No conversations yet</p>
            <p className="text-sm mt-2">Start chatting with tutors or clients!</p>
          </div>
        ) : (
          <div>
            {chats.map(chat => (
              <div
                key={chat.$id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-soft-gray cursor-pointer hover:bg-light-lavender/30 transition ${
                  selectedChat?.$id === chat.$id ? 'bg-light-lavender/50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-primary-text truncate">{getOtherParticipantName(chat)}</p>
                    <p className="text-sm text-secondary-text truncate">{chat.last_message || 'No messages yet'}</p>
                  </div>
                  {chat.last_message_timestamp && (
                    <span className="text-xs text-secondary-text ml-2">{formatTimestamp(chat.last_message_timestamp)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-soft-gray bg-light-lavender">
              <h3 className="font-bold text-lg text-primary-text">{getOtherParticipantName(selectedChat)}</h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-secondary-text py-10">
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Start the conversation!</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isOwnMessage = msg.sender_id === user.appwrite_user_id;
                  return (
                    <div key={msg.$id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage 
                          ? 'bg-accent-primary text-white' 
                          : 'bg-white border border-soft-gray text-primary-text'
                      }`}>
                        {!isOwnMessage && (
                          <p className="text-xs font-bold mb-1 text-secondary-text">{msg.sender_name}</p>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isOwnMessage ? 'text-white/70' : 'text-secondary-text'}`}>
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-soft-gray bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text"
                  disabled={sending}
                />
                <Button type="submit" variant="primary" disabled={sending || !newMessage.trim()}>
                  {sending ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-secondary-text">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
