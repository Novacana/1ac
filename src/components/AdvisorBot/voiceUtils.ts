
import { ToastFunction } from "./types";

// WICHTIG: Der ElevenLabs API-Key muss ein gültiger API-Key sein
// Ein ungültiger Key verursacht einen 401 Fehler
export const ELEVENLABS_API_KEY = "sk_e9e49493c9d6e58c3b7e9313d1adf81d35ccb00bcb06767a"; // API-Key vom Benutzer zur Verfügung gestellt

export const speakResponse = async (
  text: string, 
  isVoiceEnabled: boolean, 
  isApiKeySet: boolean,
  conversation: any,
  setIsPlaying: (playing: boolean) => void,
  isPlaying: boolean,
  toast: ToastFunction
) => {
  if (!isVoiceEnabled) return;
  
  // Wenn kein API-Key gesetzt ist, benachrichtige den Benutzer
  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY.trim() === '') {
    toast({
      title: "API-Key fehlt",
      description: "Bitte geben Sie einen gültigen ElevenLabs API-Key ein.",
      variant: "destructive",
    });
    return;
  }
  
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
      console.log("Testing ElevenLabs API key...");
      const testResponse = await fetch(`https://api.elevenlabs.io/v1/user`, {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY }
      });
      
      if (!testResponse.ok) {
        console.error('ElevenLabs API key invalid', await testResponse.text());
        toast({
          title: "Ungültiger API-Key",
          description: "Der ElevenLabs API-Key ist ungültig. Bitte überprüfen Sie den API-Key.",
          variant: "destructive",
        });
        setIsPlaying(false);
        return;
      }
      
      console.log("API key valid, starting TTS session");
      
      // Debugging: Log the URL and headers we're using
      console.log("Using TTS URL:", `https://api.elevenlabs.io/v1/text-to-speech/XB0fDUnXU5powFXDhCwa/stream`);
      console.log("Using API key:", ELEVENLABS_API_KEY.substring(0, 5) + "..." + ELEVENLABS_API_KEY.substring(ELEVENLABS_API_KEY.length - 5));
      
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
      
      // Berechne die ungefähre Dauer basierend auf der Textlänge (80ms pro Zeichen)
      const estimatedDuration = Math.max(2000, text.length * 80);
      console.log(`Estimated TTS duration: ${estimatedDuration}ms for ${text.length} characters`);
      
      setTimeout(() => {
        setIsPlaying(false);
      }, estimatedDuration);
      
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
