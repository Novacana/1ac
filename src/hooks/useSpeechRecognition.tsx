
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseSpeechRecognitionProps {
  onFinalTranscript: (transcript: string) => void;
  onInterimTranscript?: (transcript: string) => void;
  language?: string;
}

export const useSpeechRecognition = ({
  onFinalTranscript,
  onInterimTranscript,
  language = 'de-DE'
}: UseSpeechRecognitionProps) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Spracherkennung nicht unterstützt",
        description: "Dein Browser unterstützt keine Spracherkennung. Bitte verwende Chrome, Edge oder Safari.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor();
    
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsListening(true);
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
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (finalTranscript !== '') {
        onFinalTranscript(finalTranscript);
      } else if (interimTranscript !== '' && onInterimTranscript) {
        onInterimTranscript(interimTranscript);
      }
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      stopListening();
      toast({
        title: "Fehler bei der Spracherkennung",
        description: `Fehler: ${event.error}`,
        variant: "destructive",
      });
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    toggleListening
  };
};
