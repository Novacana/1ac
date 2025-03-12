
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
        // Disable automatic chat history loading
        metadata: {
          skipInitialHistoryLoad: true
        }
      });

      console.log('Chat widget initialized successfully');
      chatInitialized.current = true;
      
      // Clean up function
      return () => {
        // If the chat library provides a cleanup method, we would call it here
        console.log('Chat widget unmounted');
        chatInitialized.current = false;
      };
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
