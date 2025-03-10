
import { ToastFunction } from "./types";

export const startListening = (
  setIsListening: (isListening: boolean) => void,
  setTranscript: (transcript: string) => void,
  processUserQuery: ((transcript: string) => void) | undefined,
  recognitionRef: React.MutableRefObject<SpeechRecognition | null>,
  toast: ToastFunction,
  isFullConversationMode: boolean = false
) => {
  if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    toast({
      title: "Spracherkennung nicht unterstützt",
      description: "Dein Browser unterstützt keine Spracherkennung.",
      variant: "destructive"
    });
    return;
  }

  // Stop any existing recognition session to prevent the "already started" error
  if (recognitionRef.current) {
    try {
      recognitionRef.current.stop();
      // Give the browser a moment to clean up the previous instance
      setTimeout(() => {
        initializeNewRecognition();
      }, 100);
    } catch (e) {
      console.log("Error stopping previous recognition:", e);
      initializeNewRecognition();
    }
  } else {
    initializeNewRecognition();
  }

  function initializeNewRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.lang = 'de-DE';
    recognition.continuous = isFullConversationMode;
    recognition.interimResults = true;
    
    let finalTranscript = '';
    
    recognition.onstart = () => {
      console.log("Speech recognition started");
      setIsListening(true);
      finalTranscript = '';
    };
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          console.log("Final transcript:", finalTranscript);
          
          if (typeof processUserQuery === 'function') {
            console.log("Processing final transcript with n8n agent");
            processUserQuery(finalTranscript.trim());
          }
          
          if (!isFullConversationMode) {
            recognition.stop();
          }
        } else {
          interimTranscript += transcript;
        }
      }
      
      setTranscript(finalTranscript || interimTranscript);
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      
      toast({
        title: "Fehler bei der Spracherkennung",
        description: `Ein Fehler ist aufgetreten: ${event.error}`,
        variant: "destructive"
      });
    };
    
    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
      
      if (isFullConversationMode && recognitionRef.current) {
        console.log("Restarting recognition in full conversation mode");
        // Slight delay before restarting to prevent "already started" errors
        setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error("Failed to restart speech recognition:", e);
            }
          }
        }, 200);
      }
    };
    
    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      toast({
        title: "Fehler beim Starten der Spracherkennung",
        description: "Die Spracherkennung konnte nicht gestartet werden.",
        variant: "destructive"
      });
    }
  }
};

export const stopListening = (
  recognitionRef: React.MutableRefObject<SpeechRecognition | null>,
  setIsListening: (isListening: boolean) => void
) => {
  if (recognitionRef.current) {
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  }
};
