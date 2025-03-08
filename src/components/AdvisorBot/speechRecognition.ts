
import { useToast } from "@/hooks/use-toast";

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
    if (recognitionRef.current) {
      // Restart if it ends unexpectedly while still in listening mode
      recognition.start();
    }
  };
  
  recognitionRef.current = recognition;
  recognition.start();
};

export const stopListening = (
  recognitionRef: React.MutableRefObject<SpeechRecognition | null>,
  setIsListening: (listening: boolean) => void
) => {
  if (recognitionRef.current) {
    recognitionRef.current.stop();
    setIsListening(false);
  }
};
