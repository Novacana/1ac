
import { useEffect, useRef, useState } from 'react';
import { createChat } from '@n8n/chat';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { injectN8nChatStyles, reapplyStyles } from './ChatStyles';

interface UseChatInitializationProps {
  webhookUrl: string;
}

export const useChatInitialization = ({ webhookUrl }: UseChatInitializationProps) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const chatInitialized = useRef(false);
  const [chatInstance, setChatInstance] = useState<any>(null);
  
  useEffect(() => {
    if (chatInitialized.current) return;
    
    let styleElement: HTMLStyleElement | null = null;
    
    try {
      styleElement = injectN8nChatStyles();
      
      const instance = createChat({
        webhookUrl: webhookUrl,
        target: '#n8n-chat-container',
        mode: 'window',
        showWelcomeScreen: true,
        defaultLanguage: 'en',
        i18n: {
          en: {
            title: 'Cannabis Berater',
            subtitle: "Haben Sie Fragen zu medizinischem Cannabis? Ich bin hier, um Ihnen zu helfen.",
            footer: '',
            getStarted: 'Neue Beratung starten',
            inputPlaceholder: 'Schreiben Sie Ihre Frage...',
            closeButtonTooltip: 'Chat schließen',
          },
        },
        initialMessages: [],
        webhookConfig: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        },
        metadata: {
          skipInitialHistoryLoad: true,
          userId: isAuthenticated ? user?.id : undefined
        }
      });
      
      setChatInstance(instance);
      chatInitialized.current = true;
      
      // Re-apply styles after a delay to ensure they override n8n's styles
      setTimeout(() => {
        styleElement = reapplyStyles();
      }, 1000);
      
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: "Fehler",
        description: "Der Chat konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    }
    
    return () => {
      if (chatInstance) {
        try {
          if (typeof chatInstance.unmount === 'function') {
            chatInstance.unmount();
          }
        } catch (error) {
          console.error('Error unmounting chat:', error);
        }
      }
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
      chatInitialized.current = false;
    };
  }, [toast, webhookUrl, isAuthenticated, user]);

  return { chatInstance };
};
