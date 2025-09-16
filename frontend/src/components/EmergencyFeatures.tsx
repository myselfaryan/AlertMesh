import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  MapPinIcon,
  MegaphoneIcon,
  HeartIcon,
  FireIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface EmergencyFeaturesProps {
  onEmergencyAlert: (type: string, message: string) => void;
  isVisible: boolean;
}

const EmergencyFeatures: React.FC<EmergencyFeaturesProps> = ({
  onEmergencyAlert,
  isVisible
}) => {
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const emergencyTypes = [
    {
      type: 'medical',
      icon: HeartIcon,
      label: 'Medical Emergency',
      color: 'bg-red-600 hover:bg-red-500',
      message: '🚨 MEDICAL EMERGENCY - Need immediate medical assistance at my location'
    },
    {
      type: 'fire',
      icon: FireIcon,
      label: 'Fire Emergency',
      color: 'bg-orange-600 hover:bg-orange-500',
      message: '🔥 FIRE EMERGENCY - Fire detected, need fire department assistance'
    },
    {
      type: 'rescue',
      icon: ExclamationTriangleIcon,
      label: 'Rescue Needed',
      color: 'bg-yellow-600 hover:bg-yellow-500',
      message: '🆘 RESCUE NEEDED - Trapped and need immediate rescue assistance'
    },
    {
      type: 'shelter',
      icon: HomeIcon,
      label: 'Need Shelter',
      color: 'bg-blue-600 hover:bg-blue-500',
      message: '🏠 SHELTER NEEDED - Need emergency shelter and assistance'
    }
  ];

  const handleEmergencyAlert = (type: string, message: string) => {
    onEmergencyAlert(type, message);
    toast.success(`${type.toUpperCase()} alert sent to all connected peers!`);
  };

  const handleLocationShare = () => {
    if ('geolocation' in navigator) {
      setShowLocationPrompt(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationMessage = `📍 My current location: https://maps.google.com/maps?q=${latitude},${longitude}`;
          onEmergencyAlert('location', locationMessage);
          toast.success('Location shared with all peers!');
          setShowLocationPrompt(false);
        },
        () => {
          toast.error('Failed to get location. Please enable location services.');
          setShowLocationPrompt(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error('Geolocation is not supported by this device.');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed inset-x-4 bottom-20 z-50 lg:inset-x-auto lg:right-4 lg:w-80"
        >
          <div className="bg-gray-900/95 backdrop-blur-sm border border-red-500/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold text-red-400">Emergency Features</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {emergencyTypes.map((emergency) => {
                const IconComponent = emergency.icon;
                return (
                  <motion.button
                    key={emergency.type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEmergencyAlert(emergency.type, emergency.message)}
                    className={`${emergency.color} text-white p-3 rounded-xl flex flex-col items-center space-y-2 text-sm font-medium transition-colors`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span>{emergency.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Location Sharing */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLocationShare}
              disabled={showLocationPrompt}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 text-white p-3 rounded-xl flex items-center justify-center space-x-2 font-medium transition-colors"
            >
              {showLocationPrompt ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <MapPinIcon className="w-5 h-5" />
              )}
              <span>
                {showLocationPrompt ? 'Getting Location...' : 'Share My Location'}
              </span>
            </motion.button>

            {/* Broadcast Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const broadcastMessage = '📢 ATTENTION ALL PEERS - This is a general emergency broadcast message';
                onEmergencyAlert('broadcast', broadcastMessage);
                toast.success('Emergency broadcast sent!');
              }}
              className="w-full mt-3 bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl flex items-center justify-center space-x-2 font-medium transition-colors"
            >
              <MegaphoneIcon className="w-5 h-5" />
              <span>Emergency Broadcast</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmergencyFeatures;
