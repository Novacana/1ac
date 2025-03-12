
/**
 * Styles for the N8nChatBot component
 * Contains the CSS styles as a template string that will be injected
 * into the document head when the chat component is mounted
 */
export const chatStyles = `
  /* Remove the n8n branding */
  .n8n-chat-branding,
  .n8n-chat-footer,
  .n8n-chat-welcome-screen div:last-child,
  .n8n-chat-welcome-screen a {
    display: none !important;
  }
  
  /* Chat window styling */
  .n8n-chat-window {
    border-radius: 0 0 0.75rem 0.75rem !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    background-color: #f8f9fc !important;
    overflow: hidden !important;
    max-height: 500px !important;
    height: 100% !important;
  }
  
  /* Header styling - hide it since we have our own header */
  .n8n-chat-window-header {
    display: none !important;
  }
  
  /* Message container */
  .n8n-chat-messages-container {
    background-color: #f8f9fc !important;
    color: #1A1F2C !important;
    padding: 1rem !important;
    height: calc(100% - 60px) !important;
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
    color: white !important;
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
    border-radius: 0 0 0.75rem 0.75rem !important;
    position: relative !important;
    z-index: 1 !important;
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
    background-color: #E94A65 !important;
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
    background-color: #D43A55 !important;
    transform: scale(1.05) !important;
  }
  
  /* Welcome screen styling */
  .n8n-chat-welcome-screen {
    background-color: #f8f9fc !important;
    color: #1A1F2C !important;
    padding: 2rem !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    height: 100% !important;
    text-align: center !important;
  }
  
  /* Start chat button styling */
  .n8n-chat-start-button {
    background-color: #E94A65 !important;
    color: white !important;
    border-radius: 2rem !important;
    padding: 0.75rem 1.5rem !important;
    font-weight: 500 !important;
    margin-top: 2rem !important;
    border: none !important;
    transition: all 0.2s ease !important;
    font-size: 1rem !important;
  }
  
  .n8n-chat-start-button:hover {
    background-color: #D43A55 !important;
    transform: scale(1.02) !important;
  }
  
  /* Dark mode adjustments */
  .dark .n8n-chat-window {
    background-color: #121827 !important;
  }
  
  .dark .n8n-chat-messages-container {
    background-color: #121827 !important;
    color: white !important;
  }
  
  .dark .n8n-chat-message-bubble.from-bot {
    background-color: #1E293B !important;
    color: white !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  .dark .n8n-chat-input-container {
    background-color: #1A1F2C !important;
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
`;
