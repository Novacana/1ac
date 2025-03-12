
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
  const styleEl = useRef<HTMLStyleElement | null>(null);
  const [chatInstance, setChatInstance] = useState<any>(null);
  
  // Function to inject custom styles
  const injectCustomStyles = () => {
    // Remove any existing style element to prevent duplication
    if (styleEl.current) {
      document.head.removeChild(styleEl.current);
    }
    
    // Create and append the new style element
    const newStyleElement = document.createElement('style');
    newStyleElement.id = 'n8n-chat-custom-styles';
    newStyleElement.textContent = `
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
      
      /* IMPORTANT: Remove the 'Powered by n8n' footer and branding */
      .n8n-chat-footer,
      .n8n-chat-branding,
      .n8n-powered-by {
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
      
      /* Hide automatic messages */
      .n8n-chat-message-bubble.initial-message {
        display: none !important;
      }
    `;
    
    document.head.appendChild(newStyleElement);
    styleEl.current = newStyleElement;
    
    console.log('Custom styles injected for n8n chat');
  };
  
  // Clean up function to remove the chat instance
  const cleanupChat = () => {
    if (chatInstance) {
      // Attempt to clean up the chat instance
      try {
        if (typeof chatInstance.unmount === 'function') {
          chatInstance.unmount();
        }
      } catch (error) {
        console.error('Error unmounting chat instance:', error);
      }
      
      setChatInstance(null);
    }
    
    // Remove the style element
    if (styleEl.current) {
      document.head.removeChild(styleEl.current);
      styleEl.current = null;
    }
    
    // Reset the initialization flag
    chatInitialized.current = false;
    
    console.log('Chat cleanup complete');
  };
  
  useEffect(() => {
    if (chatInitialized.current) return;
    
    try {
      console.log('Initializing chat, user authenticated:', isAuthenticated);
      
      // Inject custom styles first
      injectCustomStyles();
      
      // After a small delay to ensure styles are applied
      setTimeout(() => {
        const instance = createChat({
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
        
        setChatInstance(instance);
        chatInitialized.current = true;
        console.log('Chat widget initialized successfully');
        
        // Run a check to ensure styles are applied correctly
        const checkAndReapplyStyles = () => {
          // If the branding elements are still visible, reapply styles
          const footerExists = document.querySelector('.n8n-chat-footer, .n8n-chat-branding, .n8n-powered-by');
          if (footerExists) {
            console.log('Reapplying styles to ensure branding is hidden');
            injectCustomStyles();
          }
        };
        
        // Check multiple times to catch any late-rendered elements
        setTimeout(checkAndReapplyStyles, 1000);
        setTimeout(checkAndReapplyStyles, 3000);
      }, 300);
      
      // Add event listener to intercept and handle messages
      const chatContainer = document.getElementById('n8n-chat-container');
      if (chatContainer) {
        const messageHandler = (event) => {
          if (event.target.matches('.n8n-chat-welcome-screen button')) {
            console.log('Welcome screen button clicked');
            
            // Re-hide any branding elements after welcome screen is gone
            setTimeout(() => {
              injectCustomStyles();
            }, 500);
          }
        };
        
        chatContainer.addEventListener('click', messageHandler);
        
        // Clean up event listener on unmount
        return () => {
          chatContainer.removeEventListener('click', messageHandler);
          cleanupChat();
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
    
    // Clean up when component unmounts
    return cleanupChat;
  }, [toast, webhookUrl, isAuthenticated, user]);

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      <div id="n8n-chat-container" className="h-[500px] w-[350px]"></div>
    </div>
  );
};

export default N8nChatBot;
