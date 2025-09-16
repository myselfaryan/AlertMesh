import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Bars3Icon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import {
  Header,
  ChatInterface,
  MessageInput,
  Sidebar,
  ConnectionStatus,
  EmergencyFeatures
} from './components';

import { useMessages } from './hooks/useMessages';
import type { ConnectionStatus as ConnectionStatusType, User, EmergencyAlert } from './types';
import { cn } from './utils';

function App() {
  const { messages, sendMessage, isLoading } = useMessages();
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEmergencyFeatures, setShowEmergencyFeatures] = useState(false);
  
  // Connection status - will be dynamic in future
  const [connectionStatus] = useState<ConnectionStatusType>({
    isConnected: true,
    peerCount: 0,
    networkQuality: 'good',
    roomName: 'emergency-chat'
  });
  
  const [users] = useState<User[]>([]);
  
  const [emergencyAlerts] = useState<EmergencyAlert[]>([]);

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const toggleEmergencyMode = () => {
    setIsEmergencyMode(!isEmergencyMode);
  };

  const handleEmergencyAlert = async (type: string, message: string) => {
    try {
      await sendMessage(`[${type.toUpperCase()}] ${message}`);
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
    }
  };

  useEffect(() => {
    // Handle escape key to close sidebar
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  return (
    <div className={cn(
      "h-screen w-screen bg-gradient-to-br transition-all duration-500 overflow-hidden",
      isEmergencyMode 
        ? "from-red-950 via-red-900 to-orange-900" 
        : "from-gray-900 via-slate-900 to-blue-950"
    )}>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-gray-800 text-white',
          duration: 3000,
        }}
      />
      
      <div className="flex h-full w-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
          {/* Header */}
          <Header 
            connectionStatus={connectionStatus}
            isEmergencyMode={isEmergencyMode}
            onEmergencyToggle={toggleEmergencyMode}
          />

          {/* Connection Status Bar */}
          <div className="px-6 py-2 border-b border-gray-700/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <ConnectionStatus connectionStatus={connectionStatus} />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
              >
                <Bars3Icon className="w-5 h-5" />
                <span className="text-sm">Users</span>
              </motion.button>
            </div>
          </div>

          {/* Chat Interface */}
          <ChatInterface 
            messages={messages}
            isEmergencyMode={isEmergencyMode}
            currentUser="You"
          />

          {/* Message Input */}
          <MessageInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isEmergencyMode={isEmergencyMode}
          />
        </div>

        {/* Desktop Sidebar */}
        <div className="lg:flex hidden w-80 flex-shrink-0">
          <Sidebar 
            users={users}
            emergencyAlerts={emergencyAlerts}
            connectionStatus={connectionStatus}
            isOpen={true}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
        
        {/* Mobile Sidebar */}
        <Sidebar 
          users={users}
          emergencyAlerts={emergencyAlerts}
          connectionStatus={connectionStatus}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Emergency Features Component */}
      <EmergencyFeatures
        onEmergencyAlert={handleEmergencyAlert}
        isVisible={showEmergencyFeatures}
      />

      {/* Floating Emergency Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowEmergencyFeatures(!showEmergencyFeatures)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-2xl flex items-center justify-center lg:hidden"
      >
        <motion.div
          animate={{ rotate: showEmergencyFeatures ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {showEmergencyFeatures ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <ExclamationTriangleIcon className="w-6 h-6" />
          )}
        </motion.div>
      </motion.button>

      {/* Footer Credit */}
      <AnimatePresence>
        {!sidebarOpen && !showEmergencyFeatures && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 z-20 max-w-sm"
          >
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
              <p className="text-xs text-gray-400">
                AlertMesh - Emergency Communication System
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
