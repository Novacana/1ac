
import React from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Import components
import AdvisorHeader from "./AdvisorHeader";
import ConfigPanel from "./ConfigPanel";
import BotIntroduction from "./BotIntroduction";
import QuickActions from "./QuickActions";
import ConversationView from "./ConversationView";
import InputArea from "./InputArea";
import GdprNoticeDialog from "./GdprNoticeDialog";
import GdprConsentBanner from "./GdprConsentBanner";
import VoiceChat from "./VoiceChat";

// Import hooks
import { useAdvisorState } from "./hooks/useAdvisorState";
import { useGdprConsent } from "./hooks/useGdprConsent";
import { useAdvisor } from "./hooks/useAdvisor";

const ProductAdvisor = () => {
  // Initialize advisor state and hooks
  const advisorState = useAdvisorState();
  const { state, setters, refs } = advisorState;
  
  // Add processUserQuery to tools
  const advisor = useAdvisor(advisorState);
  advisorState.tools.processUserQuery = advisor.processUserQuery;
  
  // GDPR consent handling
  const { handleConsentChange, handleDismissGdprNotice } = useGdprConsent(advisorState);

  return (
    <>
      <Button
        onClick={advisor.toggleAdvisor}
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
            toggleVoice={advisor.toggleVoice}
            toggleAdvisor={advisor.toggleAdvisor}
          />

          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={refs.messagesRef}>
            <GdprNoticeDialog 
              isOpen={state.showGdprNotice}
              onConsent={handleConsentChange}
              onDismiss={handleDismissGdprNotice}
            />

            {!state.gdprConsent && (
              <GdprConsentBanner onConsent={handleConsentChange} />
            )}

            <ConfigPanel 
              webhookUrl={state.webhookUrl}
              setWebhookUrl={setters.setWebhookUrl}
              useN8nAgent={state.useN8nAgent}
              setUseN8nAgent={setters.setUseN8nAgent}
            />

            <BotIntroduction />

            {state.isSpeechInputActive ? (
              <VoiceChat
                isListening={state.isListening}
                toggleListening={advisor.toggleListening}
                isPlaying={state.isPlaying}
                stopSpeaking={advisor.stopSpeaking}
                transcript={state.transcript}
                isLoading={state.isLoading}
                gdprConsent={state.gdprConsent}
                isVoiceEnabled={state.isVoiceEnabled}
                toggleVoice={advisor.toggleVoice}
                isSpeechInputActive={state.isSpeechInputActive}
                setIsSpeechInputActive={setters.setIsSpeechInputActive}
                isFullConversationMode={state.isFullConversationMode}
                setIsFullConversationMode={setters.setIsFullConversationMode}
              />
            ) : (
              <QuickActions 
                onActionClick={advisor.processUserQuery}
                onNavigate={advisor.handleNavigate}
              />
            )}

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

          {!state.isSpeechInputActive && (
            <InputArea 
              userInput={state.userInput}
              setUserInput={setters.setUserInput}
              handleSendMessage={advisor.handleSendMessage}
              handleKeyPress={advisor.handleKeyPress}
              isLoading={state.isLoading}
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default ProductAdvisor;
