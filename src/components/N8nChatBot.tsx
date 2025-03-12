
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import { useToast } from '@/components/ui/use-toast';

interface N8nChatBotProps {
  className?: string;
}

const N8nChatBot: React.FC<N8nChatBotProps> = ({ className }) => {
  const { toast } = useToast();
  const webhookUrl = "https://n8n-tejkg.ondigitalocean.app/webhook/066ad635-ecfa-470c-8761-5d200b645136/chat";
  const chatInitialized = useRef(false);
  
  useEffect(() => {
    if (chatInitialized.current) return;
    
    try {
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
          skipInitialHistoryLoad: true,
          preventAutoRequests: true // Add custom flag to prevent automatic requests
        },
        // Override the default session loading behavior
        session: {
          id: `session-${Date.now()}`, // Generate a unique session ID each time
          loadPrevious: false, // Disable automatic loading of previous session
        }
      });

      console.log('Chat widget initialized successfully');
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
  }, [toast, webhookUrl]);

  return (
    <div className={cn('', className)}>
      <div id="n8n-chat-container" className="h-full w-full"></div>
    </div>
  );
};

export default N8nChatBot;
