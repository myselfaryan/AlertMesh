import { format, isToday, isYesterday } from 'date-fns';
import type { Message } from '../types';

export const formatTime = (date: Date): string => {
  try {
    // Check if date is valid
    if (!date || isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  } catch (error) {
    console.error('Error formatting date:', date, error);
    return 'Invalid date';
  }
};

export const parseMessage = (rawMessage: string): Message => {
  // Remove any trailing newlines or whitespace
  const cleanMessage = rawMessage.trim();
  
  // Parse messages like "Received message at 2025-05-24 18:56:46.496570947 +0530 IST from Aaradhya: Hello this is aaradhya"
  const messageRegex = /^Received message at (.+?) from (.+?): (.+)$/;
  const match = cleanMessage.match(messageRegex);
  
  if (match) {
    const [, timestamp, sender, content] = match;
    // Parse timestamp more safely
    // Format: "2025-09-04 12:58:26.580751408 +0530 IST"
    const timestampStr = timestamp.split(' +')[0]; // "2025-09-04 12:58:26.580751408"
    // Remove microseconds beyond milliseconds (keep only 3 decimal places)
    const cleanTimestamp = timestampStr.replace(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\.(\d{3})\d*/, '$1.$2');
    
    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      sender: sender.trim(),
      timestamp: new Date(cleanTimestamp),
      type: content.toLowerCase().includes('emergency') ? 'emergency' : 'normal',
      status: 'delivered'
    };
  }
  
  // For direct messages (legacy format) - these are likely from older stored messages
  // Treat them as system messages or messages from unknown sender
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content: cleanMessage,
    sender: 'Unknown',
    timestamp: new Date(),
    type: cleanMessage.toLowerCase().includes('emergency') ? 'emergency' : 'normal',
    status: 'delivered'
  };
};

export const generateAvatarColor = (name: string): string => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// API functions
export const sendMessage = async (message: string): Promise<void> => {
  const response = await fetch('http://localhost:3001/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
};

export const fetchMessages = async (): Promise<string[]> => {
  console.log('Fetching from API URL: http://localhost:3001/messages');
  const response = await fetch('http://localhost:3001/messages');
  console.log('API Response status:', response.status, response.statusText);
  
  if (!response.ok) {
    console.error('API Error:', response.status, response.statusText);
    throw new Error('Failed to fetch messages');
  }
  
  const data = await response.json();
  console.log('API Response data:', data);
  return data;
};
