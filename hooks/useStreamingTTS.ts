"use client";

import { useCallback, useRef } from "react";
import { speakNaturalVoice } from "@/lib/speech-preprocessor";

interface StreamingTTSConfig {
  language: string;
  onAudioChunk?: (audioBase64: string) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

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

export function useStreamingTTS() {
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextPlayTimeRef = useRef<number>(0);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playAudioChunk = useCallback(async (base64Audio: string) => {
    try {
      const audioContext = initAudioContext();
      
      // Decode base64 to array buffer
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Decode audio data
      const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);

      // Create source node
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      // Schedule playback
      const currentTime = audioContext.currentTime;
      const playTime = Math.max(currentTime, nextPlayTimeRef.current);
      source.start(playTime);

      // Update next play time
      nextPlayTimeRef.current = playTime + audioBuffer.duration;

      // Store source node
      sourceNodesRef.current.push(source);
    } catch (error) {
      console.error("Error playing audio chunk:", error);
    }
  }, [initAudioContext]);

  const streamTTS = useCallback(
    async (text: string, config: StreamingTTSConfig) => {
      try {
        // Reset audio timing
        nextPlayTimeRef.current = 0;

        // Use server-side API route
        const response = await fetch("/api/tts-stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            language: config.language,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.audioBase64) {
            await playAudioChunk(data.audioBase64);
            config.onAudioChunk?.(data.audioBase64);
            config.onComplete?.();
            return;
          }
        }
        
        // Fallback to warm target language Web Speech Synthesis
        speakNaturalVoice(text, config.language, config.onComplete);
      } catch (error) {
        console.warn("Server TTS fallback, using browser speech synthesis:", error);
        speakNaturalVoice(text, config.language, config.onComplete);
      }
    },
    [playAudioChunk]
  );

  const stopStreaming = useCallback(() => {
    // Stop all playing audio
    sourceNodesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch (e) {
        // Already stopped
      }
    });
    sourceNodesRef.current = [];

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Reset audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    nextPlayTimeRef.current = 0;
  }, []);

  return {
    streamTTS,
    stopStreaming,
  };
}
