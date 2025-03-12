
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
        /* Remove the n8n branding */
        .n8n-chat-branding {
          display: none !important;
        }
        
        /* Chat window styling */
        .n8n-chat-window {
          border-radius: 1rem !important;
          border: 1px solid rgba(var(--primary), 0.2) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
          background-color: hsl(var(--background)) !important;
          overflow: hidden !important;
        }
        
        /* Header styling */
        .n8n-chat-window-header {
          background-color: #1A1F2C !important; /* Dark header background matching the image */
          color: white !important;
          padding: 1rem !important;
          border-top-left-radius: 1rem !important;
          border-top-right-radius: 1rem !important;
          font-weight: 600 !important;
        }
        
        /* Message container */
        .n8n-chat-messages-container {
          background-color: #f7f8fb !important; /* Light gray background for messages */
          color: hsl(var(--foreground)) !important;
          padding: 1rem !important;
        }
        
        /* Message bubbles */
        .n8n-chat-message-bubble {
          border-radius: 0.75rem !important;
          padding: 0.75rem 1rem !important;
          max-width: 85% !important;
          margin-bottom: 0.75rem !important;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05) !important;
        }
        
        /* User message styling */
        .n8n-chat-message-bubble.from-user {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
        }
        
        /* Bot message styling */
        .n8n-chat-message-bubble.from-bot {
          background-color: white !important;
          color: #1A1F2C !important;
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
        }
        
        /* Input area styling */
        .n8n-chat-input-container {
          border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
          padding: 0.75rem !important;
          background-color: white !important;
        }
        
        /* Input field styling */
        .n8n-chat-input {
          border-radius: 1.5rem !important;
          border: 1px solid #E5E7EB !important;
          background-color: white !important;
          color: #1A1F2C !important;
          padding: 0.5rem 1rem !important;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
        }
        
        .n8n-chat-input:focus {
          border-color: hsl(var(--primary)) !important;
          box-shadow: 0 0 0 2px rgba(var(--primary), 0.2) !important;
        }
        
        /* Send button styling */
        .n8n-chat-send-button {
          background-color: #E94A65 !important; /* Pink button matching the image */
          color: white !important;
          border-radius: 50% !important;
          width: 2.5rem !important;
          height: 2.5rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-left: 0.5rem !important;
          transition: all 0.2s ease !important;
        }
        
        .n8n-chat-send-button:hover {
          background-color: #D43A55 !important; /* Darker pink on hover */
          transform: scale(1.05) !important;
        }
        
        /* Welcome screen styling */
        .n8n-chat-welcome-screen {
          background-color: #f7f8fb !important;
          color: #1A1F2C !important;
          padding: 2rem !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          height: 100% !important;
        }
        
        /* Start chat button styling */
        .n8n-chat-start-button {
          background-color: #E94A65 !important; /* Pink button matching the image */
          color: white !important;
          border-radius: 2rem !important;
          padding: 0.75rem 1.5rem !important;
          font-weight: 500 !important;
          margin-top: 2rem !important;
          border: none !important;
          transition: all 0.2s ease !important;
        }
        
        .n8n-chat-start-button:hover {
          background-color: #D43A55 !important; /* Darker pink on hover */
          transform: scale(1.02) !important;
        }
        
        /* Bot name styling */
        .n8n-chat-bot-name {
          font-size: 2rem !important;
          font-weight: 700 !important;
          margin-bottom: 1rem !important;
        }
        
        /* Bot subtitle styling */
        .n8n-chat-bot-subtitle {
          font-size: 1.1rem !important;
          text-align: center !important;
          margin-bottom: 1.5rem !important;
          color: #4B5563 !important;
        }
        
        /* Footer styling */
        .n8n-chat-footer {
          font-size: 0.8rem !important;
          color: #6B7280 !important;
          text-align: center !important;
          padding: 0.75rem !important;
          background-color: #f7f8fb !important;
          border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
        }
        
        /* Dark mode adjustments */
        .dark .n8n-chat-window {
          border-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
        }
        
        .dark .n8n-chat-messages-container {
          background-color: #121827 !important;
        }
        
        .dark .n8n-chat-message-bubble.from-bot {
          background-color: #1E293B !important;
          color: white !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .dark .n8n-chat-input-container {
          background-color: #121827 !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .dark .n8n-chat-input {
          background-color: #1E293B !important;
          color: white !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .dark .n8n-chat-welcome-screen {
          background-color: #121827 !important;
          color: white !important;
        }
        
        .dark .n8n-chat-bot-subtitle {
          color: #9CA3AF !important;
        }
        
        .dark .n8n-chat-footer {
          background-color: #121827 !important;
          color: #9CA3AF !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
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
            poweredBy: '' // Empty string to remove "Powered by n8n"
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
