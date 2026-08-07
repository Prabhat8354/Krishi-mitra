import { NextRequest } from "next/server";
import { cleanTextForSpeech } from "@/lib/speech-preprocessor";

export const runtime = "edge";

const LANGUAGE_MAP: Record<string, string> = {
  "en-IN": "en-IN",
  "hi-IN": "hi-IN",
  "bn-IN": "bn-IN",
  "gu-IN": "gu-IN",
  "kn-IN": "kn-IN",
  "ml-IN": "ml-IN",
  "mr-IN": "mr-IN",
  "od-IN": "od-IN",
  "pa-IN": "pa-IN",
  "ta-IN": "ta-IN",
  "te-IN": "te-IN",
};

export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json();
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const languageCode = LANGUAGE_MAP[language] || "en-IN";

    // Clean raw text into natural spoken sentences
    const spokenText = cleanTextForSpeech(text);

    if (!spokenText) {
      return new Response(
        JSON.stringify({ error: "No printable text to speak" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call Sarvam TTS with pace 0.95 for warm, friendly speaking speed
    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        text: spokenText,
        target_language_code: languageCode,
        speaker: "anushka",
        pitch: 0,
        pace: 0.95,
        loudness: 1.5,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: "bulbul:v2",
        output_audio_codec: "mp3",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sarvam TTS error:", errorText);
      return new Response(
        JSON.stringify({ error: `TTS API error: ${response.status}` }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    if (!data.audios || data.audios.length === 0) {
      return new Response(
        JSON.stringify({ error: "No audio generated" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ audioBase64: data.audios[0] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("TTS streaming error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
