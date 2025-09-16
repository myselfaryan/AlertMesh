import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { Message } from '../types';
import { formatTime, generateAvatarColor, getInitials, cn } from '../utils';

interface ChatMessageProps {
  message: Message;
  isOwn?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwn = false }) => {
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckIcon className="w-4 h-4 text-blue-400" />;
      case 'failed':
        return <XMarkIcon className="w-4 h-4 text-red-400" />;
    }
  };

  const getMessageTypeStyle = () => {
    switch (message.type) {
      case 'emergency':
        return 'bg-red-600/20 border border-red-500/50 text-red-100';
      case 'system':
        return 'bg-blue-600/20 border border-blue-500/50 text-blue-100';
      default:
        return isOwn 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-700 text-gray-100';
    }
  };

  const avatarColor = generateAvatarColor(message.sender);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex space-x-3 mb-4",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold",
            avatarColor
          )}
        >
          {getInitials(message.sender)}
        </motion.div>
      )}

      <div className={cn("max-w-xs lg:max-w-md", isOwn && "order-first")}>
        {!isOwn && (
          <div className="text-xs text-gray-400 mb-1 font-medium">
            {message.sender}
          </div>
        )}
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={cn(
            "px-4 py-3 rounded-2xl shadow-lg",
            getMessageTypeStyle(),
            isOwn ? "rounded-tr-md" : "rounded-tl-md"
          )}
        >
          {message.type === 'emergency' && (
            <div className="flex items-center space-x-2 mb-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-300" />
              <span className="text-xs font-bold text-red-300 uppercase tracking-wide">
                Emergency
              </span>
            </div>
          )}
          
          <p className="text-sm leading-relaxed break-words">
            {message.content}
          </p>
          
          <div className={cn(
            "flex items-center justify-between mt-2 pt-2 border-t border-white/10",
            "text-xs"
          )}>
            <span className={cn(
              isOwn ? "text-blue-200" : "text-gray-400"
            )}>
              {formatTime(message.timestamp)}
            </span>
            
            {isOwn && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {getStatusIcon()}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {isOwn && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold"
        >
          You
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
