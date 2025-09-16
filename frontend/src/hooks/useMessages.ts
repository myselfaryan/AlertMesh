import { useState, useEffect, useCallback } from 'react';
import type { Message } from '../types';
import { parseMessage, fetchMessages as apiFetchMessages, sendMessage as apiSendMessage } from '../utils';
import toast from 'react-hot-toast';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      console.log('Fetching messages from API...');
      const rawMessages = await apiFetchMessages();
      console.log('Raw messages from API:', rawMessages);
      
      if (Array.isArray(rawMessages)) {
        const parsedMessages = rawMessages.map(parseMessage);
        console.log('Parsed messages:', parsedMessages);
        console.log('About to call setMessages with:', parsedMessages.length, 'messages');
        
        // Use functional update to avoid stale closure issues
        setMessages(() => parsedMessages);
        console.log('setMessages called successfully');
        
        // Clear any previous errors
        setError(null);
      } else {
        console.log('No messages or invalid format:', rawMessages);
        setMessages([]);
      }
    } catch (err) {
      setError('Failed to fetch messages');
      console.error('Error fetching messages:', err);
    }
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (message.trim() === '') return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await apiSendMessage(message);
      toast.success('Message sent!');
      
      // Immediately fetch messages to update the UI
      await fetchMessages();
    } catch (err) {
      setError('Failed to send message');
      toast.error('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchMessages]);

  // Poll for new messages
  useEffect(() => {
    const interval = setInterval(fetchMessages, 2000);
    fetchMessages(); // Initial fetch
    
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    refetch: fetchMessages
  };
};
