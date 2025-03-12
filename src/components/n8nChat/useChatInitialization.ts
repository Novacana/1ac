
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
  const styleElementRef = useRef<HTMLStyleElement | null>(null);
  
  useEffect(() => {
    if (chatInitialized.current) return;
    
    try {
      // Apply our custom styles before initialization
      styleElementRef.current = injectN8nChatStyles();
      
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
      
      // Re-apply styles multiple times to ensure they override n8n's styles
      // which might be loaded asynchronously
      const applyStylesRepeatedly = () => {
        // Clean up old style element if it exists
        if (styleElementRef.current) {
          document.head.removeChild(styleElementRef.current);
        }
        
        // Apply new styles
        styleElementRef.current = reapplyStyles();
      };
      
      // Apply immediately and then after a delay
      applyStylesRepeatedly();
      
      // Apply styles again after short delays to ensure they override n8n's styles
      const timeouts = [100, 500, 1000, 2000].map(delay => 
        setTimeout(applyStylesRepeatedly, delay)
      );
      
      return () => {
        // Clean up all timeouts
        timeouts.forEach(clearTimeout);
        
        if (chatInstance) {
          try {
            if (typeof chatInstance.unmount === 'function') {
              chatInstance.unmount();
            }
          } catch (error) {
            console.error('Error unmounting chat:', error);
          }
        }
        
        if (styleElementRef.current) {
          document.head.removeChild(styleElementRef.current);
        }
        
        chatInitialized.current = false;
      };
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: "Fehler",
        description: "Der Chat konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    }
  }, [toast, webhookUrl, isAuthenticated, user]);

  return { chatInstance };
};
