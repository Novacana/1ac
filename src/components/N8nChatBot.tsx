
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface N8nChatBotProps {
  className?: string;
}

const N8nChatBot: React.FC<N8nChatBotProps> = ({ className }) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const webhookUrl = "https://n8n-tejkg.ondigitalocean.app/webhook/066ad635-ecfa-470c-8761-5d200b645136/chat";
  const chatInitialized = useRef(false);
  const [chatInstance, setChatInstance] = useState<any>(null);
  
  const injectStyles = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      .n8n-chat-window {
        border-radius: 1.25rem !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
        background: hsl(var(--background)) !important;
      }
      
      .n8n-chat-window-header {
        background: hsl(222, 47%, 11%) !important;
        color: white !important;
        padding: 1rem !important;
        border-radius: 1.25rem 1.25rem 0 0 !important;
      }
      
      .n8n-chat-messages-container {
        background: hsl(var(--background)) !important;
        color: hsl(var(--foreground)) !important;
      }
      
      .n8n-chat-message-bubble.from-user {
        background: hsl(var(--primary)) !important;
        color: hsl(var(--primary-foreground)) !important;
      }
      
      .n8n-chat-message-bubble.from-bot {
        background: hsl(var(--secondary)) !important;
        color: hsl(var(--secondary-foreground)) !important;
      }
      
      .n8n-chat-input {
        background: hsl(var(--background)) !important;
        color: hsl(var(--foreground)) !important;
        border: 1px solid hsl(var(--border)) !important;
      }
      
      .n8n-chat-send-button {
        background: hsl(var(--primary)) !important;
        color: hsl(var(--primary-foreground)) !important;
      }
      
      /* Completely hide n8n branding and footer */
      .n8n-chat-footer,
      .n8n-chat-branding,
      .n8n-powered-by,
      div[class*="n8n-branding"],
      div[class*="powered-by"],
      .initial-message {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        position: absolute !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
    return style;
  };

  useEffect(() => {
    if (chatInitialized.current) return;
    
    let styleElement: HTMLStyleElement | null = null;
    
    try {
      styleElement = injectStyles();
      
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
        styleElement = injectStyles();
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

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      <div id="n8n-chat-container" className="h-[500px] w-[350px]"></div>
    </div>
  );
};

export default N8nChatBot;
