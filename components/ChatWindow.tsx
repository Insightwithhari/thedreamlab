
import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import MessageComponent from './Message';
import Loader from './Loader';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <MessageComponent key={msg.id} message={msg} />
      ))}
      {isLoading && <Loader />}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatWindow;
