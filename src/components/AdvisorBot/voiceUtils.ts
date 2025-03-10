
import { ToastFunction } from "./types";

export const ELEVENLABS_API_KEY = "e9d69bd26aaea5fc0e626febff0e5c6f";

export const speakResponse = async (
  text: string, 
  isVoiceEnabled: boolean, 
  isApiKeySet: boolean,
  conversation: any,
  setIsPlaying: (playing: boolean) => void,
  isPlaying: boolean,
  toast: ToastFunction
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
    console.log("Starting text-to-speech with:", text);

    if (!text || text.trim() === '') {
      console.warn('Empty text provided to speakResponse');
      setIsPlaying(false);
      return;
    }

    try {
      // Test API key
      const testResponse = await fetch(`https://api.elevenlabs.io/v1/user`, {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY }
      });
      
      if (!testResponse.ok) {
        throw new Error('ElevenLabs API key invalid');
      }
      
      await conversation.startSession({
        url: `https://api.elevenlabs.io/v1/text-to-speech/XB0fDUnXU5powFXDhCwa/stream`,
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });
      
      setTimeout(() => {
        setIsPlaying(false);
      }, Math.max(2000, text.length * 80));
      
    } catch (error) {
      console.error("ElevenLabs API error:", error);
      setIsPlaying(false);
      toast({
        title: "Fehler bei der Sprachausgabe",
        description: "Die Sprachausgabe konnte nicht gestartet werden.",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Speech generation error:", error);
    setIsPlaying(false);
    toast({
      title: "Fehler bei der Sprachausgabe",
      description: "Ein Fehler ist bei der Sprachausgabe aufgetreten.",
      variant: "destructive",
    });
  }
};
