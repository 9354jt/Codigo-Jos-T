import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName } from "../types";

// Initialize the client
// NOTE: API Key is injected via environment variable as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSpeech = async (text: string, voiceName: VoiceName, systemInstruction: string): Promise<string> => {
  try {
    // We prepend the instruction to the text because the TTS model supports instructions within the prompt
    // but often fails if passed as a separate systemInstruction config.
    const fullPrompt = `${systemInstruction} ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(p => p.inlineData?.mimeType?.startsWith('audio'));
    
    // Sometimes the audio data might be in the first part directly if it's the only modality
    const directAudio = candidate?.content?.parts?.[0]?.inlineData?.data;

    const finalAudioData = audioPart?.inlineData?.data || directAudio;

    if (!finalAudioData) {
      throw new Error("No audio data returned from the model.");
    }

    return finalAudioData;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    throw error;
  }
};