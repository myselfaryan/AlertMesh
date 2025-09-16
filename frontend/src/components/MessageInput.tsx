import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  ExclamationTriangleIcon,
  MapPinIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { cn } from '../utils';

interface MessageInputProps {
  onSendMessage: (message: string, type?: 'normal' | 'emergency') => void;
  isLoading?: boolean;
  isEmergencyMode?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isLoading = false,
  isEmergencyMode = false 
}) => {
  const [message, setMessage] = useState('');
  const [showEmergencyOptions, setShowEmergencyOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const emergencyTemplates = [
    "🚨 MEDICAL EMERGENCY - Need immediate medical assistance",
    "🔥 FIRE - Fire emergency, need fire department",
    "🆘 RESCUE - Trapped and need rescue assistance", 
    "🏠 SHELTER - Need emergency shelter",
    "📍 LOCATION - Sharing my current location for help"
  ];

  const handleSend = (messageType: 'normal' | 'emergency' = 'normal') => {
    if (message.trim() === '') return;
    
    onSendMessage(message.trim(), messageType);
    setMessage('');
    setShowEmergencyOptions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(isEmergencyMode ? 'emergency' : 'normal');
    }
  };

  const handleEmergencyTemplate = (template: string) => {
    setMessage(template);
    setShowEmergencyOptions(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (isEmergencyMode) {
      inputRef.current?.focus();
    }
  }, [isEmergencyMode]);

  return (
    <div className={cn(
      "border-t backdrop-blur-sm px-6 py-4 flex-shrink-0",
      isEmergencyMode 
        ? "bg-red-600/20 border-red-400/50" 
        : "bg-gray-800/90 border-gray-700"
    )}>
      {/* Emergency Templates */}
      <AnimatePresence>
        {showEmergencyOptions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 space-y-2"
          >
            <div className="text-sm text-yellow-400 font-medium mb-2">
              Emergency Templates:
            </div>
            {emergencyTemplates.map((template, index) => (
              <motion.button
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleEmergencyTemplate(template)}
                className="block w-full text-left px-3 py-2 text-sm bg-red-600/30 hover:bg-red-600/50 text-red-100 rounded-lg transition-colors"
              >
                {template}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end space-x-3">
        {/* Emergency Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEmergencyOptions(!showEmergencyOptions)}
          className={cn(
            "flex-shrink-0 p-2 rounded-lg transition-colors",
            showEmergencyOptions || isEmergencyMode
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white"
          )}
          title="Emergency Templates"
        >
          <ExclamationTriangleIcon className="w-5 h-5" />
        </motion.button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isEmergencyMode 
                ? "Type emergency message..." 
                : "Type your message..."
            }
            disabled={isLoading}
            className={cn(
              "w-full px-4 py-3 rounded-2xl bg-gray-700 text-white placeholder-gray-400 border-2 transition-all duration-200",
              "focus:outline-none focus:ring-2",
              isEmergencyMode
                ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/50"
                : "border-gray-600 focus:border-blue-500 focus:ring-blue-500/50",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            maxLength={500}
          />
          
          {/* Character Count */}
          <div className="absolute -bottom-6 right-0 text-xs text-gray-500">
            {message.length}/500
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
            title="Share Location"
          >
            <MapPinIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-green-400 transition-colors"
            title="Attach Image"
          >
            <PhotoIcon className="w-5 h-5" />
          </motion.button>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSend(isEmergencyMode ? 'emergency' : 'normal')}
            disabled={isLoading || message.trim() === ''}
            className={cn(
              "p-3 rounded-xl font-medium transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isEmergencyMode
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white",
              message.trim() === '' && "opacity-50"
            )}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
