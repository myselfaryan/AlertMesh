import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatInterfaceProps {
  messages: Message[];
  isEmergencyMode?: boolean;
  currentUser?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  isEmergencyMode = false,
  currentUser = 'You' 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 min-h-0 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-gray-400"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <ChatBubbleBottomCenterTextIcon className="w-20 h-20 mb-4 opacity-50" />
            </motion.div>
            <h3 className="text-xl font-medium mb-2">No messages yet</h3>
            <p className="text-center max-w-md">
              {isEmergencyMode 
                ? "Emergency mode is active. Send urgent messages to connected peers."
                : "Start a conversation with connected peers in your emergency network."
              }
            </p>
            {!isEmergencyMode && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm mt-4 text-center text-yellow-400"
              >
                💡 Tip: Use the emergency button for urgent communications
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1"
          >
            <AnimatePresence>
              {messages.map((message, index) => {
                const isOwn = message.sender === currentUser;
                const prevMessage = messages[index - 1];
                const showDateDivider = prevMessage && 
                  new Date(message.timestamp).toDateString() !== 
                  new Date(prevMessage.timestamp).toDateString();

                return (
                  <React.Fragment key={message.id}>
                    {/* Date Divider */}
                    {showDateDivider && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center py-4"
                      >
                        <div className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-400">
                          {new Date(message.timestamp).toDateString()}
                        </div>
                      </motion.div>
                    )}

                    {/* Message */}
                    <motion.div variants={messageVariants}>
                      <ChatMessage 
                        message={message} 
                        isOwn={isOwn}
                      />
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </AnimatePresence>
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </motion.div>
        )}

        {/* Emergency Mode Indicator */}
        <AnimatePresence>
          {isEmergencyMode && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30"
            >
              <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-red-400">
                🚨 Emergency Mode Active
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatInterface;
