
import { ToastFunction } from "./types";

export const startListening = (
  setIsListening: (isListening: boolean) => void,
  setTranscript: (transcript: string) => void,
  processUserQuery: ((transcript: string) => void) | undefined,
  recognitionRef: React.MutableRefObject<SpeechRecognition | null>,
  toast: ToastFunction,
  isFullConversationMode: boolean = false
) => {
  // Check if speech recognition is supported
  if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    toast({
      title: "Spracherkennung nicht unterstützt",
      description: "Dein Browser unterstützt keine Spracherkennung.",
      variant: "destructive"
    });
    return;
  }

  // Initialize speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognitionRef.current = new SpeechRecognition();
  
  const recognition = recognitionRef.current;
  
  recognition.lang = 'de-DE';
  recognition.continuous = isFullConversationMode; // Enable continuous mode for full conversations
  recognition.interimResults = true;
  
  recognition.onstart = () => {
    setIsListening(true);
    console.log("Spracherkennung gestartet", isFullConversationMode ? "(Vollgesprächsmodus)" : "");
  };
  
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
    
    setTranscript(transcript);
    
    // In full conversation mode, only process when there's a significant pause
    if (isFullConversationMode) {
      // Check if this is a final result from the latest recognition
      const currentResult = event.results[event.results.length - 1];
      if (currentResult.isFinal && typeof processUserQuery === 'function') {
        // Process just this latest segment
        const latestTranscript = currentResult[0].transcript;
        if (latestTranscript.trim().length > 0) {
          console.log("Processing in full conversation mode:", latestTranscript);
          processUserQuery(latestTranscript);
        }
      }
    } else {
      // For single-utterance mode, process the full transcript when final
      if (event.results[0].isFinal && typeof processUserQuery === 'function') {
        console.log("Final transcript in single utterance mode:", transcript);
        recognition.stop();
        if (transcript.trim().length > 0) {
          console.log("Sending to n8n agent:", transcript);
          processUserQuery(transcript);
        }
      }
    }
  };
  
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error("Speech recognition error", event.error);
    setIsListening(false);
    
    toast({
      title: "Fehler bei der Spracherkennung",
      description: `Ein Fehler ist aufgetreten: ${event.error}`,
      variant: "destructive"
    });
  };
  
  recognition.onend = () => {
    setIsListening(false);
    console.log("Spracherkennung beendet");
    
    // In full conversation mode, restart recognition automatically
    if (isFullConversationMode && recognitionRef.current) {
      console.log("Restart recognition in full conversation mode");
      recognitionRef.current.start();
    }
  };
  
  // Start listening
  try {
    recognition.start();
    console.log("Speech recognition started successfully");
  } catch (error) {
    console.error("Failed to start speech recognition:", error);
    toast({
      title: "Fehler beim Starten der Spracherkennung",
      description: "Die Spracherkennung konnte nicht gestartet werden.",
      variant: "destructive"
    });
  }
};

export const stopListening = (
  recognitionRef: React.MutableRefObject<SpeechRecognition | null>,
  setIsListening: (isListening: boolean) => void
) => {
  if (recognitionRef.current) {
    recognitionRef.current.stop();
    setIsListening(false);
  }
};
