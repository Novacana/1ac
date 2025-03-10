
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
  if (!isVoiceEnabled) {
    console.log("Voice is disabled, not speaking response");
    return;
  }
  
  // Wenn kein API-Key gesetzt ist, benachrichtige den Benutzer
  if (!isApiKeySet) {
    console.log("API key not set or empty");
    toast({
      title: "API-Key fehlt",
      description: "Bitte geben Sie einen gültigen ElevenLabs API-Key ein.",
      variant: "destructive",
    });
    return;
  }
  
  try {
    // Handle stopping current playback
    if (isPlaying) {
      console.log("Already playing, stopping current speech");
      if (conversation && conversation.status === "connected") {
        conversation.endSession();
      }
      setIsPlaying(false);
      return;
    }

    // Check if text is valid
    if (!text || text.trim() === '') {
      console.warn('Empty text provided to speakResponse');
      return;
    }
    
    // Start playing
    setIsPlaying(true);
    console.log("Starting text-to-speech with:", text.substring(0, 100) + (text.length > 100 ? '...' : ''));

    try {
      // Test API key with error handling
      console.log("Testing ElevenLabs API key...");
      try {
        const testResponse = await fetch(`https://api.elevenlabs.io/v1/user`, {
          headers: { 'xi-api-key': ELEVENLABS_API_KEY },
          mode: "cors",
          credentials: "omit"
        });
        
        if (!testResponse.ok) {
          const errorText = await testResponse.text();
          console.error('ElevenLabs API key invalid', errorText);
          toast({
            title: "Ungültiger API-Key",
            description: "Der ElevenLabs API-Key ist ungültig. Bitte überprüfen Sie den API-Key.",
            variant: "destructive",
          });
          setIsPlaying(false);
          return;
        }
      } catch (keyTestError) {
        console.error("Error testing API key:", keyTestError);
        toast({
          title: "API-Key Test fehlgeschlagen",
          description: "Konnte den API-Key nicht überprüfen.",
          variant: "destructive",
        });
        setIsPlaying(false);
        return;
      }
      
      console.log("API key valid, starting TTS session");
      
      // Debugging: Log the URL and headers we're using
      console.log("Using TTS URL:", `https://api.elevenlabs.io/v1/text-to-speech/XB0fDUnXU5powFXDhCwa/stream`);
      console.log("Using API key:", ELEVENLABS_API_KEY ? `${ELEVENLABS_API_KEY.substring(0, 5)}...${ELEVENLABS_API_KEY.substring(ELEVENLABS_API_KEY.length - 5)}` : "none");
      
      // Start the session with proper error handling
      try {
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
        
        console.log("TTS session started successfully");
      } catch (sessionError) {
        console.error("Failed to start TTS session:", sessionError);
        toast({
          title: "Fehler bei der Sprachausgabe",
          description: "Die Sprachausgabe konnte nicht gestartet werden.",
          variant: "destructive",
        });
        setIsPlaying(false);
        return;
      }
      
      // Berechne die ungefähre Dauer basierend auf der Textlänge (80ms pro Zeichen)
      const estimatedDuration = Math.max(2000, text.length * 80);
      console.log(`Estimated TTS duration: ${estimatedDuration}ms for ${text.length} characters`);
      
      // Reset playing state after estimated duration
      setTimeout(() => {
        console.log("Speech playback timeout reached, resetting state");
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
