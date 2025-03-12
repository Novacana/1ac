
/**
 * Creates and injects custom styles for the N8n chat component
 * @returns The created style element for later cleanup
 */
export const injectN8nChatStyles = (): HTMLStyleElement => {
  const style = document.createElement('style');
  style.innerHTML = `
    .n8n-chat-window {
      border-radius: 0.75rem !important;
      border: 1px solid hsl(var(--border)) !important;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
      background: hsl(var(--background)) !important;
      font-family: 'Inter var', sans-serif !important;
      overflow: hidden !important;
    }
    
    .n8n-chat-window-header {
      background: hsl(142, 54%, 42%) !important;
      color: white !important;
      padding: 1rem 1.25rem !important;
      border-radius: 0.75rem 0.75rem 0 0 !important;
      font-family: 'Inter var', sans-serif !important;
      font-size: 1.25rem !important;
      font-weight: 600 !important;
      letter-spacing: -0.01em !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    
    .n8n-chat-messages-container {
      background: hsl(var(--background)) !important;
      color: hsl(var(--foreground)) !important;
      font-family: 'Inter var', sans-serif !important;
      font-size: 0.95rem !important;
      padding: 1rem !important;
      line-height: 1.5 !important;
    }
    
    .n8n-chat-message-bubble.from-user {
      background: hsl(142, 54%, 42%) !important;
      color: white !important;
      font-family: 'Inter var', sans-serif !important;
      font-size: 0.95rem !important;
      padding: 0.75rem 1rem !important;
      border-radius: 1rem 1rem 0 1rem !important;
      margin: 0.5rem 0 !important;
      max-width: 85% !important;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05) !important;
      border: none !important;
    }
    
    .n8n-chat-message-bubble.from-bot {
      background: hsl(var(--secondary)) !important;
      color: hsl(var(--secondary-foreground)) !important;
      font-family: 'Inter var', sans-serif !important;
      font-size: 0.95rem !important;
      padding: 0.75rem 1rem !important;
      border-radius: 1rem 1rem 1rem 0 !important;
      margin: 0.5rem 0 !important;
      max-width: 85% !important;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05) !important;
      border: none !important;
    }
    
    .n8n-chat-input {
      background: hsl(var(--background)) !important;
      color: hsl(var(--foreground)) !important;
      border: 1px solid hsl(var(--border)) !important;
      font-family: 'Inter var', sans-serif !important;
      font-size: 0.95rem !important;
      padding: 0.75rem 1rem !important;
      border-radius: 0.75rem !important;
      margin: 0.5rem !important;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05) !important;
      transition: border-color 0.2s, box-shadow 0.2s !important;
    }
    
    .n8n-chat-input:focus {
      border-color: hsl(142, 54%, 42%) !important;
      box-shadow: 0 0 0 2px rgba(58, 154, 64, 0.25) !important;
      outline: none !important;
    }
    
    .n8n-chat-input::placeholder {
      color: hsl(var(--muted-foreground)) !important;
      font-family: 'Inter var', sans-serif !important;
      font-size: 0.95rem !important;
      opacity: 0.7 !important;
    }
    
    .n8n-chat-send-button {
      background: hsl(142, 54%, 42%) !important;
      color: white !important;
      border-radius: 0.5rem !important;
      padding: 0.5rem !important;
      margin: 0.5rem !important;
      border: none !important;
      cursor: pointer !important;
      transition: background-color 0.2s !important;
    }
    
    .n8n-chat-send-button:hover {
      background: hsl(142, 54%, 35%) !important;
    }
    
    .n8n-chat-send-button svg {
      fill: white !important;
    }
    
    /* Apply different styling for dark mode */
    .dark .n8n-chat-window {
      border-color: rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
    }
    
    .dark .n8n-chat-message-bubble.from-bot {
      background: hsl(217.2, 32.6%, 17.5%) !important;
      color: hsl(210, 40%, 98%) !important;
    }
    
    .dark .n8n-chat-input {
      background: hsl(222, 47%, 11%) !important;
      border-color: hsl(217.2, 32.6%, 17.5%) !important;
    }
    
    /* Completely hide n8n branding and footer */
    .n8n-chat-footer,
    .n8n-chat-branding,
    .n8n-powered-by,
    div[class*="n8n-branding"],
    div[class*="powered-by"],
    .initial-message,
    a[href*="n8n.io"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      position: absolute !important;
      pointer-events: none !important;
      z-index: -999 !important;
      clip: rect(0, 0, 0, 0) !important;
      overflow: hidden !important;
    }
    
    /* Force all n8n elements to use our styles */
    .n8n-chat-window * {
      font-family: 'Inter var', sans-serif !important;
    }
    
    /* Ensure proper spacings */
    .n8n-chat-messages {
      padding: 0.5rem !important;
    }
    
    /* Fix any potential layout issues */
    .n8n-chat-window-container {
      position: relative !important;
      height: 100% !important;
      width: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
    }
  `;
  document.head.appendChild(style);
  return style;
};

/**
 * Reapplies styles to ensure they override n8n's default styles
 * @returns The created style element for later cleanup
 */
export const reapplyStyles = (): HTMLStyleElement => {
  return injectN8nChatStyles();
};
