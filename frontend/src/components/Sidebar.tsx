import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UsersIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { User, EmergencyAlert, ConnectionStatus } from '../types';
import { generateAvatarColor, getInitials, formatTime, cn } from '../utils';

interface SidebarProps {
  users: User[];
  emergencyAlerts: EmergencyAlert[];
  connectionStatus: ConnectionStatus;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  users, 
  emergencyAlerts, 
  connectionStatus,
  isOpen,
  onClose 
}) => {
  const getStatusIcon = (status: User['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
      case 'away':
        return <ClockIcon className="w-4 h-4 text-yellow-400" />;
      default:
        return <XMarkIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEmergencyIcon = (type: EmergencyAlert['type']) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'medical':
        return <span className={`${iconClass} text-red-400`}>🏥</span>;
      case 'fire':
        return <span className={`${iconClass} text-orange-400`}>🔥</span>;
      case 'rescue':
        return <span className={`${iconClass} text-blue-400`}>🆘</span>;
      case 'shelter':
        return <span className={`${iconClass} text-green-400`}>🏠</span>;
      default:
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-400`} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 z-50 lg:relative lg:w-64 xl:w-80 lg:h-screen flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
              <h2 className="text-lg font-semibold text-white">Room Info</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Room Status */}
              <div className="p-6 border-b border-gray-700">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Room Name</span>
                    <span className="text-white font-medium">{connectionStatus.roomName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Network Quality</span>
                    <span className={cn(
                      "font-medium capitalize",
                      connectionStatus.networkQuality === 'excellent' && "text-green-400",
                      connectionStatus.networkQuality === 'good' && "text-yellow-400",
                      connectionStatus.networkQuality === 'poor' && "text-orange-400",
                      connectionStatus.networkQuality === 'offline' && "text-red-400"
                    )}>
                      {connectionStatus.networkQuality}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Alerts */}
              {emergencyAlerts.length > 0 && (
                <div className="p-6 border-b border-gray-700">
                  <h3 className="flex items-center space-x-2 text-red-400 font-medium mb-4">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span>Active Emergencies</span>
                  </h3>
                  <div className="space-y-3">
                    {emergencyAlerts.slice(0, 3).map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 bg-red-600/20 border border-red-500/30 rounded-lg"
                      >
                        <div className="flex items-start space-x-2">
                          {getEmergencyIcon(alert.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-red-100 font-medium">
                              {alert.sender}
                            </p>
                            <p className="text-xs text-red-300 truncate">
                              {alert.message}
                            </p>
                            <p className="text-xs text-red-400 mt-1">
                              {formatTime(alert.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Users */}
              <div className="p-6">
                <h3 className="flex items-center space-x-2 text-white font-medium mb-4">
                  <UsersIcon className="w-5 h-5" />
                  <span>Connected Users ({users.length})</span>
                </h3>
                
                <div className="space-y-3">
                  {users.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold relative",
                        generateAvatarColor(user.nickname)
                      )}>
                        {getInitials(user.nickname)}
                        
                        {/* Status Indicator */}
                        <div className="absolute -bottom-1 -right-1">
                          {getStatusIcon(user.status)}
                        </div>
                        
                        {/* Emergency Indicator */}
                        {user.isEmergency && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                          >
                            <ExclamationTriangleIcon className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {user.nickname}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user.status === 'online' 
                            ? 'Online' 
                            : `Last seen ${formatTime(user.lastSeen)}`}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <UsersIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No users connected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
