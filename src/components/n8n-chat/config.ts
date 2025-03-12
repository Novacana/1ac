
/**
 * Configuration options for the N8nChatBot
 */
export const chatConfig = {
  webhookUrl: "https://n8n-tejkg.ondigitalocean.app/webhook/066ad635-ecfa-470c-8761-5d200b645136/chat",
  
  // Chat window configuration
  chatOptions: {
    chatInputKey: 'chatInput',
    mode: 'window',
    showWelcomeScreen: true,
    defaultLanguage: 'en',
  },
  
  // Translations
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
  
  // Initial messages shown to the user
  initialMessages: [
    'Willkommen beim Cannabis Berater. Wie kann ich Ihnen heute helfen?',
    'Bitte beachten Sie, dass ich medizinische Informationen gemäß DSGVO und HIPAA verarbeite und FHIR-Kommunikationsstandards anwende.'
  ],
  
  // DOM element where the chat will be rendered
  targetElement: '#n8n-chat-container',
};
