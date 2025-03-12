
import { useEffect, useRef } from 'react';
import { createChat } from '@n8n/chat';
import { useToast } from '@/components/ui/use-toast';
import { chatConfig } from './config';
import { chatStyles } from './styles';

/**
 * Hook to initialize and manage the N8n chat widget
 */
export const useChat = () => {
  const { toast } = useToast();
  const chatInitialized = useRef(false);
  
  useEffect(() => {
    if (chatInitialized.current) return;
    
    try {
      console.log('Initializing chat');
      
      // Add custom CSS for styling the chat widget to match the website
      const styleElement = document.createElement('style');
      styleElement.textContent = chatStyles;
      document.head.appendChild(styleElement);
      
      // Create the chat instance
      createChat({
        webhookUrl: chatConfig.webhookUrl,
        target: chatConfig.targetElement,
        ...chatConfig.chatOptions,
        i18n: chatConfig.i18n,
        initialMessages: chatConfig.initialMessages
      });

      console.log('Chat widget initialized successfully');
      chatInitialized.current = true;
      
      // Clean up event listener on unmount
      return () => {
        chatInitialized.current = false;
        document.head.removeChild(styleElement);
        console.log('Chat widget unmounted');
      };
    } catch (error) {
      console.error('Error initializing chat widget:', error);
      toast({
        title: "Fehler",
        description: "Der Chat konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    }
  }, [toast]);
};
