"use server";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface FarmerProfileContext {
  name?: string;
  state?: string;
  district?: string;
  village?: string;
  farmSize?: string;
  soilType?: string;
  mainCrops?: string;
  irrigationType?: string;
}

interface SarvamChatRequest {
  messages: ChatMessage[];
  language: string;
  profile?: FarmerProfileContext;
  context?: {
    weather?: string;
    plantHealth?: string;
  };
}

interface SarvamChatResponse {
  success: boolean;
  data?: {
    content: string;
    model: string;
  };
  error?: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  "en-IN": "English",
  "hi-IN": "Hindi",
  "bn-IN": "Bengali",
  "gu-IN": "Gujarati",
  "kn-IN": "Kannada",
  "ml-IN": "Malayalam",
  "mr-IN": "Marathi",
  "od-IN": "Odia",
  "pa-IN": "Punjabi",
  "ta-IN": "Tamil",
  "te-IN": "Telugu",
};

export async function getSarvamChatCompletion(
  request: SarvamChatRequest
): Promise<SarvamChatResponse> {
  const apiKey = process.env.SARVAM_API_KEY;
  console.log("========================================");
  console.log("🚀 [SARVAM AI INITIATED]");
  console.log("🔑 Sarvam API key loaded:", !!apiKey);

  if (!apiKey || apiKey.includes("YOUR_")) {
    console.warn("⚠️ Sarvam API key missing or invalid placeholder.");
    return {
      success: false,
      error: "Sarvam API key not configured",
    };
  }

  try {
    const languageName = LANGUAGE_NAMES[request.language] || "English";
    const lastUserMessage = [...request.messages].reverse().find((m) => m.role === "user");
    const userQuery = lastUserMessage?.content || "";

    console.log("➡️ Request received for Sarvam AI");
    console.log("➡️ Query:", userQuery);
    console.log("➡️ Target Language:", languageName);

    const systemPrompt = `You are "Mitra", the AI agricultural companion for Indian farmers. Respond clearly and helpfully in ${languageName}.`;

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...request.messages,
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s server timeout

    console.log("⚡ Calling Sarvam AI API...");
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        model: "sarvam-2b",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.5,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(`➡️ Sarvam API Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Sarvam API Error (${response.status}):`, errorText);
      throw new Error(`Sarvam HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      throw new Error("Empty response from Sarvam API");
    }

    const aiContent = data.choices[0].message.content;
    console.log("✅ Sarvam AI Response generated successfully.");

    return {
      success: true,
      data: {
        content: aiContent,
        model: data.model || "sarvam-2b",
      },
    };
  } catch (error: any) {
    console.error("❌ Sarvam Chat Error Exception:", error.message || error);
    return {
      success: false,
      error: error.name === "AbortError" ? "AI service is taking longer than expected." : error.message,
    };
  }
}
