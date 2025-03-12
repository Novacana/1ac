
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
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
      background: hsl(var(--background)) !important;
      font-family: 'Inter var', sans-serif !important;
    }
    
    .n8n-chat-window-header {
      background: hsl(222, 47%, 11%) !important;
      color: hsl(var(--primary-foreground)) !important;
      padding: 1.25rem !important;
      border-radius: 0.75rem 0.75rem 0 0 !important;
      font-family: 'Inter var', sans-serif !important;
      font-size: 1.75rem !important;
      font-weight: 600 !important;
    }
    
    .n8n-chat-messages-container {
      background: hsl(var(--background)) !important;
      color: hsl(var(--foreground)) !important;
      font-family: 'Inter var', sans-serif !important;
      font-size: 1rem !important;
      padding: 1rem !important;
    }
    
    .n8n-chat-message-bubble.from-user {
      background: hsl(142, 54%, 42%) !important;
      color: hsl(var(--primary-foreground)) !important;
      font-family: 'Inter var', sans-serif !important;
      font-size: 1rem !important;
      padding: 0.875rem 1.25rem !important;
      border-radius: 0.75rem !important;
      margin: 0.5rem 0 !important;
    }
    
    .n8n-chat-message-bubble.from-bot {
      background: hsl(var(--secondary)) !important;
      color: hsl(var(--secondary-foreground)) !important;
      font-family: 'Inter var', sans-serif !important;
      font-size: 1rem !important;
      padding: 0.875rem 1.25rem !important;
      border-radius: 0.75rem !important;
      margin: 0.5rem 0 !important;
    }
    
    .n8n-chat-input {
      background: hsl(var(--background)) !important;
      color: hsl(var(--foreground)) !important;
      border: 1px solid hsl(var(--border)) !important;
      font-family: 'Inter var', sans-serif !important;
      font-size: 1rem !important;
      padding: 0.875rem 1.25rem !important;
      border-radius: 0.75rem !important;
      margin: 0.5rem !important;
    }
    
    .n8n-chat-input::placeholder {
      color: hsl(var(--muted-foreground)) !important;
      font-family: 'Inter var', sans-serif !important;
      font-size: 1rem !important;
    }
    
    .n8n-chat-send-button {
      background: hsl(142, 54%, 42%) !important;
      color: hsl(var(--primary-foreground)) !important;
      border-radius: 0.75rem !important;
      padding: 0.75rem !important;
      margin: 0.5rem !important;
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

/**
 * Reapplies styles to ensure they override n8n's default styles
 * @returns The created style element for later cleanup
 */
export const reapplyStyles = (): HTMLStyleElement => {
  return injectN8nChatStyles();
};
