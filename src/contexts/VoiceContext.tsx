
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface VoiceContextType {
  isVoiceEnabled: boolean;
  isPlaying: boolean;
  elevenlabsApiKey: string | null;
  toggleVoice: () => void;
  speakMessage: (message: string, messageId: string) => Promise<void>;
  stopSpeaking: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState<string | null>(
    localStorage.getItem("elevenlabsApiKey")
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('error', () => {
      setIsPlaying(false);
      toast({
        title: "Fehler bei der Audiowiedergabe",
        description: "Die Audiodatei konnte nicht abgespielt werden.",
        variant: "destructive",
      });
    });
    
    return () => {
      audio.pause();
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.removeEventListener('error', () => setIsPlaying(false));
    };
  }, [toast]);

  const promptForApiKey = () => {
    const key = window.prompt(
      "Bitte gib deinen ElevenLabs API-Schlüssel ein, um die Sprachausgabe zu aktivieren:",
      elevenlabsApiKey || ""
    );
    
    if (key) {
      localStorage.setItem("elevenlabsApiKey", key);
      setElevenlabsApiKey(key);
      toast({
        title: "API-Schlüssel gespeichert",
        description: "Dein ElevenLabs API-Schlüssel wurde gespeichert.",
      });
      return key;
    }
    return null;
  };

  const toggleVoice = () => {
    if (!isVoiceEnabled && !elevenlabsApiKey) {
      const key = promptForApiKey();
      if (key) {
        setIsVoiceEnabled(true);
      }
    } else {
      setIsVoiceEnabled(!isVoiceEnabled);
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const speakMessage = async (message: string, messageId: string) => {
    if (!isVoiceEnabled) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    let apiKey = elevenlabsApiKey;
    if (!apiKey) {
      apiKey = promptForApiKey();
      if (!apiKey) return;
    }

    try {
      setIsPlaying(true);
      
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: message,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          toast({
            title: "Ungültiger API-Schlüssel",
            description: "Bitte überprüfe deinen ElevenLabs API-Schlüssel.",
            variant: "destructive",
          });
          localStorage.removeItem("elevenlabsApiKey");
          setElevenlabsApiKey(null);
        } else {
          toast({
            title: "Fehler bei der Sprachgenerierung",
            description: errorData.message || "Ein unbekannter Fehler ist aufgetreten.",
            variant: "destructive",
          });
        }
        setIsPlaying(false);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        title: "Fehler bei der Sprachgenerierung",
        description: "Ein Fehler ist bei der Verbindung mit ElevenLabs aufgetreten.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        isVoiceEnabled,
        isPlaying,
        elevenlabsApiKey,
        toggleVoice,
        speakMessage,
        stopSpeaking
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
};
