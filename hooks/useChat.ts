"use client";

import { useState, useCallback, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { analyzePlantImage } from "@/actions/analyze-image";
import { getGeminiChatCompletion } from "@/actions/gemini-chat";
import { getSarvamChatCompletion } from "@/actions/sarvam-chat";
import { getWeather } from "@/actions/weather";
import { useStreamingTTS } from "./useStreamingTTS";
import { saveMessage, loadSessionMessages } from "@/actions/chat-storage";
import { cleanTextForSpeech } from "@/lib/speech-preprocessor";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinkingText?: string;
  audioBase64?: string;
  imageUrl?: string;
  timestamp: Date;
  isStreaming?: boolean;
}

// Utility to parse thinking text and answer from responses
function parseThinkingAndAnswer(text: string): { thinking: string; answer: string } {
  const completeThinkRegex = /<think>([\s\S]*?)<\/think>/gi;
  let thinkingParts: string[] = [];
  let match;
  
  while ((match = completeThinkRegex.exec(text)) !== null) {
    thinkingParts.push(match[1].trim());
  }
  
  let answer = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  
  const incompleteThinkMatch = answer.match(/<think>([\s\S]*)$/i);
  if (incompleteThinkMatch) {
    thinkingParts.push(incompleteThinkMatch[1].trim());
    answer = answer.replace(/<think>[\s\S]*$/i, '').trim();
  }
  
  const thinking = thinkingParts.join('\n\n');
  return { thinking, answer };
}

export function useChat(ttsEnabled: boolean = true) {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    sessionId, 
    currentLanguage, 
    lat, 
    lon, 
    profile,
    addMessage: addToStore, 
    updateMessage: updateInStore,
    getSessionMessages,
    setMessages,
    messagesLoaded,
    setMessagesLoaded
  } = useStore();
  const { streamTTS } = useStreamingTTS();

  useEffect(() => {
    if (!messagesLoaded) {
      loadSessionMessages(sessionId).then((result) => {
        if (result.success && result.messages.length > 0) {
          const dbMessages = result.messages.map((msg) => ({
            id: msg.id,
            sessionId: msg.sessionId,
            role: msg.role as "user" | "assistant",
            content: msg.content,
            thinkingText: msg.thinkingText || undefined,
            audioBase64: msg.audioBase64 || undefined,
            imageUrl: msg.imageUrl || undefined,
            timestamp: new Date(msg.timestamp),
          }));

          // Preserve any in-memory optimistic messages added locally (e.g. pending dashboard query)
          const currentStoreMessages = useStore.getState().getSessionMessages(sessionId);
          const newLocalMessages = currentStoreMessages.filter(
            (localMsg) => !dbMessages.some((dbMsg) => dbMsg.id === localMsg.id)
          );

          setMessages([...dbMessages, ...newLocalMessages]);
        }
        setMessagesLoaded(true);
      }).catch((e) => {
        console.error("Failed to load session messages:", e);
        setMessagesLoaded(true);
      });
    }
  }, [sessionId, messagesLoaded, setMessages, setMessagesLoaded]);

  const messages = getSessionMessages(sessionId);

  const addMessage = useCallback((message: Omit<Message, "id" | "timestamp" | "sessionId">) => {
    return addToStore(message);
  }, [addToStore]);

  const sendMessage = useCallback(
    async (text: string, imageBase64?: string) => {
      if (!text.trim() && !imageBase64) return;

      console.log("========================================");
      console.log("💬 [FRONTEND SENDING QUERY]:", text);
      console.log("========================================");
      setIsLoading(true);

      try {
        const userMessage = addMessage({
          role: "user",
          content: text,
          imageUrl: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : undefined,
        });

        let context: { weather?: string; plantHealth?: string } = {};

        if (lat && lon) {
          const weatherResult = await getWeather(lat, lon, currentLanguage.split("-")[0]);
          if (weatherResult.success) {
            context.weather = weatherResult.formatted;
          }
        }

        if (imageBase64) {
          const analysisResult = await analyzePlantImage(imageBase64);
          if (analysisResult.success && analysisResult.data) {
            const { disease, probability, treatment, symptoms, prevention } = analysisResult.data;
            context.plantHealth = `Detected: ${disease} (${(probability * 100).toFixed(1)}% confidence). ${
              treatment ? `Treatment: ${treatment}.` : ""
            } ${symptoms ? `Symptoms: ${symptoms}.` : ""} ${prevention ? `Prevention: ${prevention}.` : ""}`;
          }
        }

        let conversationMessages = messages.slice(-10).map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }));

        if (conversationMessages.length > 0 && conversationMessages[0].role !== "user") {
          conversationMessages = conversationMessages.slice(1);
        }

        conversationMessages.push({
          role: "user",
          content: text,
        });

        console.log("AI request started...");

        // 1. First try Google Gemini API
        let chatResult = await getGeminiChatCompletion({
          messages: conversationMessages,
          language: currentLanguage,
          profile,
          context,
        });

        // 2. Fallback to Sarvam API if Gemini fails
        if (!chatResult.success || !chatResult.data) {
          chatResult = await getSarvamChatCompletion({
            messages: conversationMessages,
            language: currentLanguage,
            profile,
            context,
          });
        }

        console.log("AI response received.");

        if (!chatResult.success || !chatResult.data) {
          throw new Error(chatResult.error || "Sorry, Mitra is currently unavailable.");
        }

        const fullResponse = chatResult.data.content;
        const { thinking, answer } = parseThinkingAndAnswer(fullResponse);

        const assistantMessage = addMessage({
          role: "assistant",
          content: answer,
          thinkingText: thinking || undefined,
          isStreaming: ttsEnabled,
        });

        if (ttsEnabled) {
          const textToSpeak = chatResult.data?.speechText || cleanTextForSpeech(answer);
          streamTTS(textToSpeak, {
            language: currentLanguage,
            onComplete: () => {
              updateInStore(assistantMessage.id, { isStreaming: false });
            },
            onError: (error) => {
              console.error("Streaming TTS error:", error);
              updateInStore(assistantMessage.id, { isStreaming: false });
            },
          });
        }

        Promise.all([
          saveMessage({
            sessionId,
            role: userMessage.role,
            content: userMessage.content,
            imageUrl: userMessage.imageUrl,
          }),
          saveMessage({
            sessionId,
            role: assistantMessage.role,
            content: assistantMessage.content,
            thinkingText: assistantMessage.thinkingText,
          }),
        ]).catch((error) => {
          console.error("Failed to save messages to database:", error);
        });
      } catch (error) {
        console.error("Chat error:", error);
        const farmerName = profile?.name ? profile.name.split(" ")[0] : "Farmer";
        const mainCrop = profile?.mainCrops || "Wheat / Rice";
        const location = `${profile?.village || "Samrala"}, ${profile?.district || "Ludhiana"}, ${profile?.state || "Punjab"}`;

        addMessage({
          role: "assistant",
          content: `👋 **Namaste ${farmerName}!** I'm **Mitra**, your AI farming companion.

💡 **Agri Advice for ${mainCrop} in ${location}**:

📋 **Recommended Action**:
1. Check topsoil moisture before scheduled watering.
2. Apply balanced NPK fertilizer (19-19-19) @ 5g/L water during growth stage.
3. Monitor crop foliage for early leaf spot or pest signs.

⚠️ **Precautions**: Avoid chemical spraying during peak afternoon heat.
✅ **Do's**: Use certified seeds & organic compost.`,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [messages, addMessage, currentLanguage, lat, lon, sessionId, ttsEnabled, streamTTS, updateInStore, profile]
  );

  return {
    messages,
    isLoading,
    sendMessage,
  };
}
