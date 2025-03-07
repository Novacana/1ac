
import { useToast } from "@/hooks/use-toast";

// Vordefinierter API-Schlüssel für ElevenLabs
export const ELEVENLABS_API_KEY = "e9d69bd26aaea5fc0e626febff0e5c6f";

export const setupSpeechRecognition = (
  setIsListening: (isListening: boolean) => void,
  setTranscript: (transcript: string) => void,
  processUserQuery: (query: string) => void
) => {
  const { toast } = useToast();
  
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    toast({
      title: "Spracherkennung nicht unterstützt",
      description: "Dein Browser unterstützt keine Spracherkennung. Bitte verwende Chrome, Edge oder Safari.",
      variant: "destructive",
    });
    return null;
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
        // Display interim results in real-time
        setTranscript(interimTranscript);
      }
    }
  };
  
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('Speech recognition error', event.error);
    setIsListening(false);
    toast({
      title: "Fehler bei der Spracherkennung",
      description: `Fehler: ${event.error}`,
      variant: "destructive",
    });
  };
  
  recognition.onend = () => {
    // Handled in component
  };
  
  return recognition;
};
