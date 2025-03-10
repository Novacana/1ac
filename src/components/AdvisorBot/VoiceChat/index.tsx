import React from "react";
import VoiceChatCompact from "./VoiceChatCompact";
import VoiceChatFullMode from "./VoiceChatFullMode";

interface VoiceChatProps {
  isListening: boolean;
  toggleListening: () => void;
  isPlaying: boolean;
  stopSpeaking: () => void;
  transcript: string;
  isLoading: boolean;
  gdprConsent: boolean;
  isVoiceEnabled: boolean;
  toggleVoice: () => void;
  isSpeechInputActive: boolean;
  setIsSpeechInputActive: (active: boolean) => void;
  isFullConversationMode: boolean;
  setIsFullConversationMode: (mode: boolean) => void;
}

const VoiceChat: React.FC<VoiceChatProps> = (props) => {
  // If voice chat is not active, show compact mode
  if (!props.isSpeechInputActive) {
    return <VoiceChatCompact {...props} />;
  }

  // Otherwise show full voice chat mode
  return <VoiceChatFullMode {...props} />;
};

export default VoiceChat;
