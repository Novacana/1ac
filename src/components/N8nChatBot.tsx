import React, { useEffect, useRef } from 'react';
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
  
  useEffect(() => {
    if (chatInitialized.current) return;
    
    try {
      console.log('Initializing chat, user authenticated:', isAuthenticated);
      
      // Inject CSS to enhance the chat interface and remove branding
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        /* Modern chat window styling */
        .n8n-chat-window {
          border-radius: 1.25rem !important;
          border: 1px solid rgba(var(--primary), 0.2) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
          background-color: hsl(var(--background)) !important;
          overflow: hidden !important;
          transition: all 0.3s ease !important;
          max-height: 600px !important;
        }
        
        .n8n-chat-window-header {
          background-color: hsl(222, 47%, 11%) !important;
          color: white !important;
          padding: 1rem !important;
          border-top-left-radius: 1.25rem !important;
          border-top-right-radius: 1.25rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          font-weight: 600 !important;
          letter-spacing: 0.02em !important;
        }
        
        .n8n-chat-messages-container {
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          padding: 1.25rem !important;
          background-image: radial-gradient(
            rgba(var(--primary), 0.03) 1px, 
            transparent 1px
          ) !important;
          background-size: 20px 20px !important;
        }
        
        .n8n-chat-message-bubble {
          border-radius: 1rem !important;
          padding: 0.875rem 1.25rem !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
          margin-bottom: 0.875rem !important;
          max-width: 85% !important;
          line-height: 1.5 !important;
          transition: transform 0.2s ease !important;
        }
        
        .n8n-chat-message-bubble:hover {
          transform: translateY(-1px) !important;
        }
        
        .n8n-chat-message-bubble.from-user {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border-bottom-right-radius: 0.25rem !important;
        }
        
        .n8n-chat-message-bubble.from-bot {
          background-color: hsl(var(--secondary)) !important;
          color: hsl(var(--secondary-foreground)) !important;
          border-bottom-left-radius: 0.25rem !important;
        }
        
        .n8n-chat-input-container {
          border-top: 1px solid rgba(var(--primary), 0.1) !important;
          padding: 1rem !important;
          background-color: hsl(var(--background)) !important;
        }
        
        .n8n-chat-input {
          border-radius: 1.5rem !important;
          border: 1px solid hsl(var(--border)) !important;
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          padding: 0.75rem 1.25rem !important;
          font-size: 0.95rem !important;
          transition: all 0.2s ease !important;
        }
        
        .n8n-chat-input:focus {
          border-color: hsl(var(--primary)) !important;
          box-shadow: 0 0 0 2px rgba(var(--primary), 0.2) !important;
          outline: none !important;
        }
        
        .n8n-chat-send-button {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border-radius: 50% !important;
          width: 2.75rem !important;
          height: 2.75rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-left: 0.75rem !important;
          box-shadow: 0 2px 10px rgba(var(--primary), 0.2) !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        
        .n8n-chat-send-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(var(--primary), 0.3) !important;
        }
        
        .n8n-chat-welcome-screen {
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          padding: 2rem !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          height: 100% !important;
        }
        
        .n8n-chat-welcome-screen h1 {
          font-size: 1.75rem !important;
          font-weight: 700 !important;
          margin-bottom: 1rem !important;
          color: hsl(222, 47%, 11%) !important;
        }
        
        .n8n-chat-welcome-screen p {
          font-size: 1rem !important;
          text-align: center !important;
          margin-bottom: 2rem !important;
          max-width: 80% !important;
          line-height: 1.6 !important;
        }
        
        .n8n-chat-welcome-screen button {
          background-color: hsl(var(--primary)) !important;
          color: white !important;
          border: none !important;
          border-radius: 2rem !important;
          padding: 0.875rem 1.75rem !important;
          font-size: 1rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 4px 12px rgba(var(--primary), 0.25) !important;
        }
        
        .n8n-chat-welcome-screen button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 16px rgba(var(--primary), 0.35) !important;
        }
        
        /* Dark mode adjustments */
        .dark .n8n-chat-window {
          border-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
        }
        
        .dark .n8n-chat-welcome-screen h1 {
          color: white !important;
        }
        
        .dark .n8n-chat-message-bubble.from-bot {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }
        
        /* IMPORTANT: Remove the 'Powered by n8n' footer */
        .n8n-chat-footer,
        .n8n-chat-branding {
          display: none !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      const chatInstance = createChat({
        webhookUrl: webhookUrl,
        chatInputKey: 'chatInput',
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
          skipInitialHistoryLoad: !isAuthenticated,
          preventAutoRequests: true,
          userId: isAuthenticated ? user?.id : undefined
        }
      });

      console.log('Chat widget initialized successfully', isAuthenticated ? 'with user ID: ' + user?.id : 'without user ID');
      chatInitialized.current = true;
      
      // Add event listener to only send requests when user submits input
      const chatContainer = document.getElementById('n8n-chat-container');
      if (chatContainer) {
        const submitHandler = (event) => {
          if (event.target.closest('.n8n-chat-input-form')) {
            console.log('User submitted chat input');
          }
        };
        chatContainer.addEventListener('submit', submitHandler);
        
        // Clean up event listener on unmount
        return () => {
          chatContainer.removeEventListener('submit', submitHandler);
          chatInitialized.current = false;
          document.head.removeChild(styleElement);
          console.log('Chat widget unmounted');
        };
      }
    } catch (error) {
      console.error('Error initializing chat widget:', error);
      toast({
        title: "Fehler",
        description: "Der Chat konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    }
  }, [toast, webhookUrl, isAuthenticated, user]);

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      <div id="n8n-chat-container" className="h-[500px] w-[350px]"></div>
    </div>
  );
};

export default N8nChatBot;
