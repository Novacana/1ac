
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export const startListening = (
  setIsListening: (listening: boolean) => void,
  setTranscript: (transcript: string) => void,
  processUserQuery: (query: string) => void,
  recognitionRef: React.MutableRefObject<SpeechRecognition | null>,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    toast({
      title: "Spracherkennung nicht unterstützt",
      description: "Dein Browser unterstützt keine Spracherkennung. Bitte verwende Chrome, Edge oder Safari.",
      variant: "destructive",
    });
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = 'de-DE';
  recognition.continuous = true;
  recognition.interimResults = true;
  
  recognition.onstart = () => {
    setIsListening(true);
    setTranscript("");
    toast({
      title: "Spracherkennung aktiv",
      description: "Du kannst jetzt sprechen.",
    });
  };
  
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    let finalTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
        processUserQuery(finalTranscript);
      } else {
        interimTranscript += transcript;
        setTranscript(interimTranscript);
      }
    }
  };
  
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('Speech recognition error', event.error);
    stopListening(recognitionRef, setIsListening);
    toast({
      title: "Fehler bei der Spracherkennung",
      description: `Fehler: ${event.error}`,
      variant: "destructive",
    });
  };
  
  recognition.onend = () => {
    if (recognitionRef.current === recognition) {
      // Restart if it ends unexpectedly while still in listening mode
      recognition.start();
    } else {
      setIsListening(false);
    }
  };
  
  recognitionRef.current = recognition;
  
  try {
    recognition.start();
  } catch (error) {
    console.error('Error starting speech recognition:', error);
    toast({
      title: "Fehler beim Starten der Spracherkennung",
      description: "Bitte versuche es später erneut.",
      variant: "destructive",
    });
    setIsListening(false);
  }
};

export const stopListening = (
  recognitionRef: React.MutableRefObject<SpeechRecognition | null>,
  setIsListening: (listening: boolean) => void
) => {
  if (recognitionRef.current) {
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
    recognitionRef.current = null;
    setIsListening(false);
  }
};
