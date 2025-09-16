import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationCircleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import type { ConnectionStatus as ConnectionStatusType } from '../types';
import { cn } from '../utils';

interface ConnectionStatusProps {
  connectionStatus: ConnectionStatusType;
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  connectionStatus, 
  className 
}) => {
  const getStatusColor = () => {
    if (!connectionStatus.isConnected) return 'text-red-400';
    
    switch (connectionStatus.networkQuality) {
      case 'excellent':
        return 'text-green-400';
      case 'good':
        return 'text-yellow-400';
      case 'poor':
        return 'text-orange-400';
      default:
        return 'text-red-400';
    }
  };

  const getStatusText = () => {
    if (!connectionStatus.isConnected) return 'Disconnected';
    return `Connected • ${connectionStatus.networkQuality}`;
  };

  const getSignalBars = () => {
    const bars = [];
    const maxBars = 4;
    let activeBars = 0;

    switch (connectionStatus.networkQuality) {
      case 'excellent':
        activeBars = 4;
        break;
      case 'good':
        activeBars = 3;
        break;
      case 'poor':
        activeBars = 2;
        break;
      default:
        activeBars = connectionStatus.isConnected ? 1 : 0;
    }

    for (let i = 0; i < maxBars; i++) {
      bars.push(
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.1 }}
          className={cn(
            "w-1 rounded-full",
            i < activeBars ? getStatusColor().replace('text-', 'bg-') : 'bg-gray-600'
          )}
          style={{ 
            height: `${(i + 1) * 4 + 4}px`,
            originY: 1 
          }}
        />
      );
    }

    return bars;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center space-x-3 px-4 py-2 rounded-lg backdrop-blur-sm",
        "bg-gray-800/50 border border-gray-700",
        className
      )}
    >
      {/* Connection Icon */}
      <motion.div
        animate={connectionStatus.isConnected ? {} : { rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, repeat: connectionStatus.isConnected ? 0 : Infinity }}
      >
        {connectionStatus.isConnected ? (
          <CheckCircleIcon className={cn("w-5 h-5", getStatusColor())} />
        ) : (
          <ExclamationCircleIcon className="w-5 h-5 text-red-400" />
        )}
      </motion.div>

      {/* Signal Bars */}
      <div className="flex items-end space-x-0.5 h-5">
        {getSignalBars()}
      </div>

      {/* Status Text */}
      <div className="text-sm">
        <div className={cn("font-medium", getStatusColor())}>
          {getStatusText()}
        </div>
        <div className="text-xs text-gray-400">
          {connectionStatus.peerCount} peer{connectionStatus.peerCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Room Name */}
      <div className="text-xs text-gray-500 hidden sm:block">
        Room: {connectionStatus.roomName}
      </div>

      {/* Pulse Animation for Active Connection */}
      {connectionStatus.isConnected && connectionStatus.peerCount > 0 && (
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="w-2 h-2 bg-green-400 rounded-full"
        />
      )}
    </motion.div>
  );
};

export default ConnectionStatus;
