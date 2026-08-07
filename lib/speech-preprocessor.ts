/**
 * Speech Preprocessor & Text-to-Speech Normalizer for KrishiMitra Voice Assistant
 */

const NUMBER_WORDS: Record<number, string> = {
  0: "zero", 1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
  6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
  11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
  16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen",
  20: "twenty", 30: "thirty", 40: "forty", 50: "fifty",
  60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety"
};

function numberToWords(num: number): string {
  if (num < 0) return "minus " + numberToWords(Math.abs(num));
  if (num in NUMBER_WORDS) return NUMBER_WORDS[num];

  if (num < 100) {
    const tens = Math.floor(num / 10) * 10;
    const units = num % 10;
    return `${NUMBER_WORDS[tens]}-${NUMBER_WORDS[units]}`;
  }

  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    return `${NUMBER_WORDS[hundreds]} hundred` + (remainder ? ` ${numberToWords(remainder)}` : "");
  }

  return num.toString();
}

/**
 * Preprocesses raw markdown, emojis, HTML, and agri symbols into natural conversational speech text
 */
export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return "";

  let text = rawText;

  // 1. Remove HTML tags & thinking tags (<think>...</think>)
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  text = text.replace(/<[^>]*>/g, "");

  // 2. Remove Emojis, Icons, and Unicode Symbols
  text = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, "");

  // 3. Remove Code Blocks, URLs & Markdown formatting
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/`[^`]*`/g, "");
  text = text.replace(/https?:\/\/\S+/g, " official website ");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 4. Strip Spoken Markdown Characters & Symbols
  text = text.replace(/[*#_~|>:`]/g, " ");
  text = text.replace(/\\/g, " ");

  // 5. Transform Section Headings into Natural Conversational Speech
  text = text.replace(/Simple Explanation:?/gi, " Here is a simple explanation. ");
  text = text.replace(/Recommended Action:?/gi, " Here are the recommended action steps. ");
  text = text.replace(/Action Steps:?/gi, " Here are the action steps to follow. ");
  text = text.replace(/Precautions:?/gi, " Please keep these precautions in mind. ");
  text = text.replace(/Do's:?/gi, " Here is what you should do. ");
  text = text.replace(/Don'ts:?/gi, " Here is what you should avoid. ");
  text = text.replace(/Organic Solution:?/gi, " For organic treatment, ");
  text = text.replace(/Chemical Treatment:?/gi, " For chemical treatment, ");

  // 6. Expand Farming Abbreviations
  text = text.replace(/\bNPK\b/g, "Nitrogen, Phosphorus and Potassium");
  text = text.replace(/\bDAP\b/g, "Di-ammonium Phosphate");
  text = text.replace(/\bMOP\b/g, "Muriate of Potash");
  text = text.replace(/\bKCC\b/g, "Kisan Credit Card");

  // 7. Expand Percentages & Units into Spoken Words
  text = text.replace(/(\d+)\s*%/g, (_, n) => `${numberToWords(parseInt(n, 10))} percent`);
  text = text.replace(/(\d+)\s*°C/g, (_, n) => `${numberToWords(parseInt(n, 10))} degrees Celsius`);
  text = text.replace(/(\d+)\s*-\s*(\d+)\s*days/gi, (_, n1, n2) => `${numberToWords(parseInt(n1, 10))} to ${numberToWords(parseInt(n2, 10))} days`);
  text = text.replace(/(\d+)\s*ml\/L/gi, (_, n) => `${numberToWords(parseInt(n, 10))} millilitres per litre`);
  text = text.replace(/(\d+)\s*g\/L/gi, (_, n) => `${numberToWords(parseInt(n, 10))} grams per litre`);
  text = text.replace(/(\d+)\s*kg\/acre/gi, (_, n) => `${numberToWords(parseInt(n, 10))} kilograms per acre`);

  // 8. Convert Bullet Points into Natural Spoken Sentences
  let bulletIndex = 1;
  const lines = text.split("\n");
  const cleanedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
      const ordinal = bulletIndex === 1 ? "First," : bulletIndex === 2 ? "Second," : bulletIndex === 3 ? "Third," : "Additionally,";
      bulletIndex++;
      return `${ordinal} ${trimmed.replace(/^[-•*]\s*/, "")}`;
    } else {
      bulletIndex = 1;
    }
    return trimmed;
  });

  text = cleanedLines.join(" ");

  // 9. Remove Repeated Punctuation & Extra Whitespace
  text = text.replace(/([.?!,])\1+/g, "$1");
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Standard Voice Assistant Audio Cues
 */
export const VOICE_CUES = {
  welcome: "Hello! Welcome to KrishiMitra. How can I help you with your farming today?",
  listening: "I'm listening. Please ask your question.",
  processing: "Please wait while I analyze your request.",
  finished: "Analysis complete.",
  error: "I'm sorry. I couldn't understand that. Please try again.",
};

/**
 * Speak text in the target language voice at 0.9x speed
 */
export function speakNaturalVoice(textToSpeak: string, langCode: string = "hi-IN", onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  // Stop any ongoing speech immediately
  window.speechSynthesis.cancel();

  const cleanText = cleanTextForSpeech(textToSpeak);
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = langCode || "hi-IN";
  utterance.rate = 0.9;  // Warm, calm pace
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Find native voice matching target language (e.g. hi-IN, mr-IN, pa-IN, ta-IN, etc.)
  const voices = window.speechSynthesis.getVoices();
  const targetPrefix = (langCode || "hi-IN").split("-")[0];

  const matchedVoice = voices.find(
    (v) =>
      v.lang.toLowerCase() === langCode.toLowerCase() ||
      v.lang.toLowerCase().startsWith(targetPrefix) ||
      v.name.toLowerCase().includes(targetPrefix)
  );

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  } else {
    // Fallback to any Indian voice
    const fallbackIndianVoice = voices.find((v) => v.lang.includes("IN") || v.name.includes("India"));
    if (fallbackIndianVoice) {
      utterance.voice = fallbackIndianVoice;
    }
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}
