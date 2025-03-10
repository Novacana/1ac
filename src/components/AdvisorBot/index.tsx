
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Import hooks
import { useAdvisorState } from "./hooks/useAdvisorState";
import { useAdvisorInteractions } from "./hooks/useAdvisorInteractions";

// Import components
import AdvisorHeader from "./AdvisorHeader";
import ConfigPanel from "./ConfigPanel";
import BotIntroduction from "./BotIntroduction";
import QuickActions from "./QuickActions";
import ConversationView from "./ConversationView";
import InputArea from "./InputArea";
import GDPRConsentNotice from "./GDPRConsentNotice";

const ProductAdvisor = () => {
  const advisorState = useAdvisorState();
  const { 
    state, 
    refs, 
    setters 
  } = advisorState;
  
  const interactions = useAdvisorInteractions(advisorState);

  return (
    <>
      <Button
        onClick={interactions.toggleAdvisor}
        className={cn(
          "fixed bottom-4 right-4 rounded-full shadow-lg z-50 transition-all duration-300",
          state.isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
        )}
        size="icon"
      >
        {state.isOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </Button>

      <div
        className={cn(
          "fixed bottom-20 right-4 w-80 md:w-96 z-[100] transition-all duration-300 transform",
          state.isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <Card className="border shadow-lg overflow-hidden flex flex-col h-[600px]">
          <AdvisorHeader 
            isVoiceEnabled={state.isVoiceEnabled}
            toggleVoice={interactions.toggleVoice}
            toggleAdvisor={interactions.toggleAdvisor}
          />

          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={refs.messagesRef}>
            {!state.gdprConsent && (
              <GDPRConsentNotice 
                gdprConsent={state.gdprConsent}
                handleConsentChange={interactions.handleConsentChange}
              />
            )}

            <ConfigPanel 
              webhookUrl={state.webhookUrl}
              setWebhookUrl={setters.setWebhookUrl}
              useN8nAgent={state.useN8nAgent}
              setUseN8nAgent={setters.setUseN8nAgent}
            />

            <BotIntroduction />

            <QuickActions 
              onActionClick={interactions.processUserQuery}
              onNavigate={interactions.handleNavigate}
            />

            <ConversationView 
              conversationHistory={state.conversationHistory}
              isPlaying={state.isPlaying}
              transcript={state.transcript}
              isLoading={state.isLoading}
              recommendedProducts={state.recommendedProducts}
              showProducts={state.showProducts}
              onProductClick={() => setters.setIsOpen(false)}
            />

            <div ref={refs.bottomRef} />
          </div>

          <InputArea 
            userInput={state.userInput}
            setUserInput={setters.setUserInput}
            handleSendMessage={interactions.handleSendMessage}
            handleKeyPress={interactions.handleKeyPress}
            isLoading={state.isLoading}
            isListening={state.isListening}
            toggleListening={interactions.toggleListening}
            isVoiceEnabled={state.isVoiceEnabled}
            toggleVoice={interactions.toggleVoice}
          />
        </Card>
      </div>
    </>
  );
};

export default ProductAdvisor;
