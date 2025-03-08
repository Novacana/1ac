
import { useToast } from "@/hooks/use-toast";

// API key for ElevenLabs
export const ELEVENLABS_API_KEY = "e9d69bd26aaea5fc0e626febff0e5c6f";

export const speakResponse = async (
  text: string, 
  isVoiceEnabled: boolean, 
  isApiKeySet: boolean,
  conversation: any,
  setIsPlaying: (playing: boolean) => void,
  isPlaying: boolean,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  if (!isVoiceEnabled || !isApiKeySet) return;
  
  try {
    if (isPlaying) {
      if (conversation.status === "connected") {
        conversation.endSession();
      }
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    
    const options = {
      overrides: {
        tts: {
          voiceId: "XB0fDUnXU5powFXDhCwa",
        },
        agent: {
          language: "de",
        }
      }
    };
    
    conversation.startSession({
      url: `https://api.elevenlabs.io/v1/text-to-speech/XB0fDUnXU5powFXDhCwa`,
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      ...options
    }).then(() => {
      setTimeout(() => {
        setIsPlaying(false);
      }, text.length * 80);
    }).catch(error => {
      console.error("Error with ElevenLabs:", error);
      setIsPlaying(false);
      toast({
        title: "Fehler bei der Sprachausgabe",
        description: "Die ElevenLabs Sprachausgabe konnte nicht gestartet werden.",
        variant: "destructive",
      });
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    toast({
      title: "Fehler bei der Sprachausgabe",
      description: "Ein Fehler ist bei der Sprachausgabe aufgetreten.",
      variant: "destructive",
    });
    setIsPlaying(false);
  }
};
