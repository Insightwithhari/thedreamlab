
import type React from 'react';
import { Message, MessageAuthor } from '../types';
import { UserIcon, RhesusIcon } from './icons';

interface MessageProps {
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.author === MessageAuthor.USER;
  const isRhesus = message.author === MessageAuthor.RHESUS;

  const authorDetails = {
    [MessageAuthor.USER]: {
      name: 'You',
      icon: <UserIcon className="w-6 h-6 text-gray-400" />,
      bgColor: 'bg-gray-800',
      align: 'items-start',
    },
    [MessageAuthor.RHESUS]: {
      name: 'Dr. Rhesus',
      icon: <RhesusIcon className="w-6 h-6 text-cyan-400" />,
      bgColor: 'bg-gray-900',
      align: 'items-start',
    },
    [MessageAuthor.SYSTEM]: {
      name: 'System',
      icon: null,
      bgColor: 'bg-transparent',
      align: 'items-center',
    },
  };

  const details = authorDetails[message.author];

  return (
    <div className={`p-4 md:p-6 flex flex-col ${details.align}`}>
      <div className="flex items-start space-x-4 max-w-full">
        {details.icon && (
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-gray-700' : 'bg-gray-800'}`}>
                {details.icon}
            </div>
        )}
        <div className={`flex flex-col w-full overflow-hidden`}>
          <span className="font-bold text-gray-300">{details.name}</span>
          <div className="prose prose-invert prose-sm md:prose-base max-w-none text-gray-300">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
