
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { MAHRAN_SYSTEM_PROMPT } from "../constants";
import { PronunciationResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

/**
 * Standard Chat Interaction
 */
export async function getChatResponse(message: string, history: { role: 'user' | 'assistant', content: string }[]) {
  const ai = getGeminiClient();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: MAHRAN_SYSTEM_PROMPT,
    },
  });

  // Convert history to correct format if needed, but sendMessage only takes 'message'
  // For simplicity in this demo, we'll just send the current message
  // In a real app, we'd rebuild context if needed or use previous chat instance
  const response = await chat.sendMessage({ message });
  return response.text;
}

/**
 * Text-to-Speech for German
 */
export async function getSpeechForText(text: string): Promise<string | undefined> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say clearly in German: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is a good German-capable voice
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}

/**
 * Pronunciation Analysis
 */
export async function analyzePronunciation(targetPhrase: string, audioBase64: string): Promise<PronunciationResult> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: `The user is trying to pronounce this German phrase: "${targetPhrase}". 
                 Analyze their audio. 
                 Provide feedback in JSON format including:
                 - score (0-100)
                 - transcription (what they actually said)
                 - feedback (general advice)
                 - phonemeAnalysis (specific sounds to improve, e.g. 'ch', 'ü')
                 - isPerfect (boolean)` 
        },
        { inlineData: { mimeType: 'audio/pcm;rate=16000', data: audioBase64 } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          transcription: { type: Type.STRING },
          feedback: { type: Type.STRING },
          phonemeAnalysis: { type: Type.STRING },
          isPerfect: { type: Type.BOOLEAN }
        },
        required: ["score", "transcription", "feedback", "phonemeAnalysis", "isPerfect"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
