import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon, 
  WifiIcon,
  UsersIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import type { ConnectionStatus } from '../types';
import { cn } from '../utils';

interface HeaderProps {
  connectionStatus: ConnectionStatus;
  isEmergencyMode: boolean;
  onEmergencyToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  connectionStatus, 
  isEmergencyMode, 
  onEmergencyToggle 
}) => {
  const getNetworkIcon = () => {
    switch (connectionStatus.networkQuality) {
      case 'excellent':
        return <WifiIcon className="w-6 h-6 text-green-400" />;
      case 'good':
        return <WifiIcon className="w-6 h-6 text-yellow-400" />;
      case 'poor':
        return <WifiIcon className="w-6 h-6 text-orange-400" />;
      default:
        return <WifiIcon className="w-6 h-6 text-red-400" />;
    }
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b backdrop-blur-sm',
        isEmergencyMode 
          ? 'bg-red-600/90 border-red-400' 
          : 'bg-gray-800/90 border-gray-700'
      )}
    >
      <div className="flex items-center space-x-4">
        <motion.div
          animate={{ 
            scale: isEmergencyMode ? [1, 1.1, 1] : 1,
            rotate: isEmergencyMode ? [0, 5, -5, 0] : 0
          }}
          transition={{ 
            repeat: isEmergencyMode ? Infinity : 0,
            duration: 1 
          }}
        >
          <ExclamationTriangleIcon 
            className={cn(
              "w-8 h-8",
              isEmergencyMode ? "text-yellow-300" : "text-yellow-400"
            )} 
          />
        </motion.div>
        
        <div>
          <h1 className="text-2xl font-bold text-white">
            AlertMesh
            {isEmergencyMode && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-yellow-300 ml-2 text-sm"
              >
                EMERGENCY MODE
              </motion.span>
            )}
          </h1>
          <p className="text-sm text-gray-300">
            Emergency Communication Network
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Network Status */}
        <div className="flex items-center space-x-2">
          {getNetworkIcon()}
          <div className="text-sm">
            <div className="text-white font-medium">
              {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="text-gray-300">
              Room: {connectionStatus.roomName}
            </div>
          </div>
        </div>

        {/* Peer Count */}
        <div className="flex items-center space-x-2">
          <UsersIcon className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">
            {connectionStatus.peerCount}
          </span>
        </div>

        {/* Emergency Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEmergencyToggle}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors",
            isEmergencyMode
              ? "bg-yellow-500 text-black hover:bg-yellow-400"
              : "bg-red-600 text-white hover:bg-red-500"
          )}
        >
          <ShieldExclamationIcon className="w-5 h-5" />
          <span>
            {isEmergencyMode ? 'Exit Emergency' : 'Emergency'}
          </span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
