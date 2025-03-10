
import { ToastFunction } from "./types";

// API key for ElevenLabs
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
    
    // Temporarily handle empty text
    if (!text || text.trim() === '') {
      console.warn('Empty text provided to speakResponse');
      setIsPlaying(false);
      return;
    }

    console.log("Starting text-to-speech with text:", text.substring(0, 50) + "...");

    try {
      // First check if our API key is valid by making a small request
      const testResponse = await fetch(`https://api.elevenlabs.io/v1/user`, {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY
        }
      });
      
      if (!testResponse.ok) {
        console.error("ElevenLabs API key validation failed:", await testResponse.text());
        throw new Error('ElevenLabs API key may be invalid or expired');
      }
      
      console.log("ElevenLabs API key validated successfully");
      
      // Now start the voice conversation
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
        }),
        overrides: {
          tts: {
            voiceId: "XB0fDUnXU5powFXDhCwa", // Charlotte voice
          },
          agent: {
            language: "de",
          }
        }
      });
      
      console.log("Voice session started successfully");
      
      // Estimate duration based on text length and set timeout to update UI
      const approximateDuration = Math.max(2000, text.length * 80);
      setTimeout(() => {
        setIsPlaying(false);
        console.log("Voice playback completed (estimated)");
      }, approximateDuration);
      
    } catch (error) {
      console.error("Error with ElevenLabs API:", error);
      setIsPlaying(false);
      toast({
        title: "Fehler bei der Sprachausgabe",
        description: "Die ElevenLabs Sprachausgabe konnte nicht gestartet werden.",
        variant: "destructive",
      });
    }
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
