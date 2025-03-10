
import { toast as toastFunction } from "@/hooks/use-toast";

export const startListening = (
  setIsListening: (isListening: boolean) => void,
  setTranscript: (transcript: string) => void,
  processUserQuery: (transcript: string) => void,
  recognitionRef: React.MutableRefObject<SpeechRecognition | null>,
  toast = toastFunction
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
  recognition.continuous = false;
  recognition.interimResults = true;
  
  recognition.onstart = () => {
    setIsListening(true);
    console.log("Spracherkennung gestartet");
  };
  
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
    
    setTranscript(transcript);
    
    // If this is a final result, process the query
    if (event.results[0].isFinal) {
      recognition.stop();
      processUserQuery(transcript);
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
  };
  
  // Start listening
  recognition.start();
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
