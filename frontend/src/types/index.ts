export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  type: 'normal' | 'emergency' | 'system';
  status: 'sent' | 'delivered' | 'failed';
}

export interface User {
  id: string;
  nickname: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  isEmergency?: boolean;
}

export interface ConnectionStatus {
  isConnected: boolean;
  peerCount: number;
  networkQuality: 'excellent' | 'good' | 'poor' | 'offline';
  roomName: string;
}

export interface EmergencyAlert {
  id: string;
  type: 'medical' | 'fire' | 'rescue' | 'shelter' | 'general';
  message: string;
  sender: string;
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface AppState {
  messages: Message[];
  users: User[];
  connectionStatus: ConnectionStatus;
  currentUser: User;
  emergencyAlerts: EmergencyAlert[];
  isEmergencyMode: boolean;
}
