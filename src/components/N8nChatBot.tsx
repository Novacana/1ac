
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
      
      // Add custom CSS for styling the chat widget to match the website
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .n8n-chat-window {
          border-radius: 1rem !important;
          border: 1px solid rgba(var(--primary), 0.2) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
          background-color: hsl(var(--background)) !important;
        }
        
        .n8n-chat-window-header {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          padding: 0.75rem 1rem !important;
          border-top-left-radius: 1rem !important;
          border-top-right-radius: 1rem !important;
        }
        
        .n8n-chat-messages-container {
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          padding: 1rem !important;
        }
        
        .n8n-chat-message-bubble {
          border-radius: 0.75rem !important;
          padding: 0.75rem 1rem !important;
          max-width: 85% !important;
        }
        
        .n8n-chat-message-bubble.from-user {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
        }
        
        .n8n-chat-message-bubble.from-bot {
          background-color: hsl(var(--secondary)) !important;
          color: hsl(var(--secondary-foreground)) !important;
        }
        
        .n8n-chat-input-container {
          border-top: 1px solid rgba(var(--primary), 0.1) !important;
          padding: 0.75rem !important;
          background-color: hsl(var(--background)) !important;
        }
        
        .n8n-chat-input {
          border-radius: 1.5rem !important;
          border: 1px solid hsl(var(--border)) !important;
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          padding: 0.5rem 1rem !important;
        }
        
        .n8n-chat-input:focus {
          border-color: hsl(var(--primary)) !important;
          box-shadow: 0 0 0 2px rgba(var(--primary), 0.2) !important;
        }
        
        .n8n-chat-send-button {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border-radius: 50% !important;
          width: 2.5rem !important;
          height: 2.5rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-left: 0.5rem !important;
        }
        
        .n8n-chat-welcome-screen {
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
        }
        
        .dark .n8n-chat-window {
          border-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
        }
        
        .dark .n8n-chat-message-bubble.from-bot {
          background-color: rgba(255, 255, 255, 0.1) !important;
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
            footer: 'Ihre Daten werden gemäß DSGVO und HIPAA verarbeitet.',
            getStarted: 'Neue Beratung starten',
            inputPlaceholder: 'Schreiben Sie Ihre Frage...',
            closeButtonTooltip: 'Chat schließen',
          },
        },
        initialMessages: [
          'Willkommen beim Cannabis Berater. Wie kann ich Ihnen heute helfen?',
          'Bitte beachten Sie, dass ich medizinische Informationen gemäß DSGVO und HIPAA verarbeite und FHIR-Kommunikationsstandards anwende.'
        ],
        webhookConfig: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        },
        metadata: {
          skipInitialHistoryLoad: !isAuthenticated, // Only skip history load if user is not authenticated
          preventAutoRequests: true, // Still prevent auto requests regardless of authentication
          userId: isAuthenticated ? user?.id : undefined // Include user ID if authenticated
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
