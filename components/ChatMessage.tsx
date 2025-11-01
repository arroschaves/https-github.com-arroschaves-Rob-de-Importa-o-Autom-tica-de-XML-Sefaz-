
import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const wrapperClasses = `flex items-end gap-2 max-w-xl lg:max-w-2xl ${isUser ? 'justify-end ml-auto' : 'justify-start mr-auto'}`;
  const bubbleClasses = `px-4 py-3 rounded-2xl shadow-sm ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`;
  const contentClasses = "prose prose-sm dark:prose-invert max-w-none break-words";
  
  const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
      U
    </div>
  );

  const ModelAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
      R
    </div>
  );

  const formattedContent = message.content
    .replace(/\n/g, '<br />')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');


  return (
    <div className={wrapperClasses}>
       {!isUser && <ModelAvatar />}
        <div className={bubbleClasses}>
            <div className={contentClasses} dangerouslySetInnerHTML={{ __html: formattedContent }} />
        </div>
       {isUser && <UserAvatar />}
    </div>
  );
};
