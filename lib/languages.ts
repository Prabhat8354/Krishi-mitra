export interface Language {
  code: string; // BCP-47 code (e.g., "hi-IN")
  name: string; // Native name
  englishName: string;
  sarvamCode: string; // Code used for Sarvam API
  browserCode: string; // Code for browser speechSynthesis
  greetings: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  voiceCues: {
    welcome: string;
    listening: string;
    processing: string;
    finished: string;
    error: string;
  };
}

export const LANGUAGES: Language[] = [
  {
    code: "hi-IN",
    name: "हिन्दी",
    englishName: "Hindi",
    sarvamCode: "hi-IN",
    browserCode: "hi-IN",
    greetings: {
      morning: "शुभ प्रभात",
      afternoon: "शुभ दोपहर",
      evening: "शुभ संध्या",
    },
    voiceCues: {
      welcome: "नमस्ते! कृषि मित्र में आपका स्वागत है। आज मैं आपकी खेती में क्या मदद कर सकता हूँ?",
      listening: "मैं सुन रहा हूँ। कृपया अपना प्रश्न पूछें।",
      processing: "कृपया प्रतीक्षा करें, मैं आपकी जानकारी का विश्लेषण कर रहा हूँ।",
      finished: "विश्लेषण पूरा हुआ।",
      error: "क्षमा करें, मैं इसे समझ नहीं सका। कृपया पुनः प्रयास करें।",
    },
  },
  {
    code: "mr-IN",
    name: "मराठी",
    englishName: "Marathi",
    sarvamCode: "mr-IN",
    browserCode: "mr-IN",
    greetings: {
      morning: "शुभ सकाळ",
      afternoon: "शुभ दुपार",
      evening: "शुभ संध्या",
    },
    voiceCues: {
      welcome: "नमस्कार! कृषी मित्र मध्ये आपले स्वागत आहे। आज मी तुम्हाला कशी मदत करू शकतो?",
      listening: "मी ऐकत आहे. कृपया आपला प्रश्न विचारा.",
      processing: "कृपया वाट पहा, मी विश्लेषण करत आहे.",
      finished: "विश्लेषण पूर्ण झाले.",
      error: "माफ करा, मला समजले नाही. कृपया पुन्हा प्रयत्न करा.",
    },
  },
  {
    code: "pa-IN",
    name: "ਪੰਜਾਬੀ",
    englishName: "Punjabi",
    sarvamCode: "pa-IN",
    browserCode: "pa-IN",
    greetings: {
      morning: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ",
      afternoon: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ",
      evening: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ",
    },
    voiceCues: {
      welcome: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ।",
      listening: "ਮੈਂ ਸੁਣ ਰਿਹਾ ਹਾਂ। ਕ੍ਰਿਪਾ ਕਰਕੇ ਆਪਣਾ ਸਵਾਲ ਪੁੱਛੋ।",
      processing: "ਕ੍ਰਿਪਾ ਇੰਤਜ਼ਾਰ ਕਰੋ.",
      finished: "ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ ਹੋ ਗਿਆ।",
      error: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
    },
  },
  {
    code: "ta-IN",
    name: "தமிழ்",
    englishName: "Tamil",
    sarvamCode: "ta-IN",
    browserCode: "ta-IN",
    greetings: {
      morning: "காலை வணக்கம்",
      afternoon: "மதிய வணக்கம்",
      evening: "மாலை வணக்கம்",
    },
    voiceCues: {
      welcome: "வணக்கம்! கிருஷி மித்ராவிற்கு வரவேற்கிறோம்.",
      listening: "நான் கேட்கிறேன்.",
      processing: "தயவுசெய்து காத்திருக்கவும்.",
      finished: "பகுப்பாய்வு முடிந்தது.",
      error: "மன்னிக்கவும், என்னால் புரிந்து கொள்ள முடியவில்லை.",
    },
  },
  {
    code: "te-IN",
    name: "తెలుగు",
    englishName: "Telugu",
    sarvamCode: "te-IN",
    browserCode: "te-IN",
    greetings: {
      morning: "శుభోదయం",
      afternoon: "శుభ మధ్యాహ్నం",
      evening: "శుభ సాయంత్రం",
    },
    voiceCues: {
      welcome: "నమస్కారం! కృషి మిత్రకి స్వాగతం.",
      listening: "నేను వింటున్నాను.",
      processing: "దయచేసి వేచి ఉండండి.",
      finished: "విశ్లేషణ పూర్తయింది.",
      error: "క్షమించండి, నాకు అర్థం కాలేదు.",
    },
  },
  {
    code: "bn-IN",
    name: "বাংলা",
    englishName: "Bengali",
    sarvamCode: "bn-IN",
    browserCode: "bn-IN",
    greetings: {
      morning: "শুভ সকাল",
      afternoon: "শুভ দুপুর",
      evening: "শুভ সন্ধ্যা",
    },
    voiceCues: {
      welcome: "নমস্কার! কৃষি মিত্রতে আপনাকে স্বাগতম।",
      listening: "আমি শুনছি।",
      processing: "অনুগ্রহ করে অপেক্ষা করুন।",
      finished: "বিশ্লেষণ সম্পূর্ণ।",
      error: "দুঃখিত, আমি বুঝতে পারিনি।",
    },
  },
  {
    code: "gu-IN",
    name: "ગુજરાતી",
    englishName: "Gujarati",
    sarvamCode: "gu-IN",
    browserCode: "gu-IN",
    greetings: {
      morning: "શુભ સવાર",
      afternoon: "શુભ બપોર",
      evening: "શુભ સાંજ",
    },
    voiceCues: {
      welcome: "નમસ્તે! કૃષિ મિત્રમાં આપનું સ્વાગત છે.",
      listening: "હું સાંભળી રહ્યો છું.",
      processing: "કૃપા કરીને રાહ જુઓ.",
      finished: "વિશ્લેષણ પૂર્ણ થયું.",
      error: "માફ કરશો, હું સમજી શક્યો નથી.",
    },
  },
  {
    code: "kn-IN",
    name: "ಕನ್ನಡ",
    englishName: "Kannada",
    sarvamCode: "kn-IN",
    browserCode: "kn-IN",
    greetings: {
      morning: "ಶುಭೋದಯ",
      afternoon: "ಶುಭ ಮಧ್ಯಾಹ್ನ",
      evening: "ಶುಭ ಸಂಜೆ",
    },
    voiceCues: {
      welcome: "ನಮಸ್ಕಾರ! ಕೃಷಿ ಮಿತ್ರಗೆ ಸ್ವಾಗತ.",
      listening: "ನಾನು ಕೇಳುತ್ತಿದ್ದೇನೆ.",
      processing: "ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ.",
      finished: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ.",
      error: "ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ.",
    },
  },
  {
    code: "ml-IN",
    name: "മലയാളം",
    englishName: "Malayalam",
    sarvamCode: "ml-IN",
    browserCode: "ml-IN",
    greetings: {
      morning: "സുപ്രഭാതം",
      afternoon: "ശുഭ ഉച്ചസമയം",
      evening: "ശുഭ സായാഹ്നം",
    },
    voiceCues: {
      welcome: "നമസ്കാരം! കൃഷി മിത്രയിലേക്ക് സ്വാഗതം.",
      listening: "ഞാൻ കേൾക്കുന്നു.",
      processing: "ദയവായി കാത്തിരിക്കൂ.",
      finished: "വിശകലനം പൂർത്തിയായി.",
      error: "ക്ഷമിക്കണം, മനസ്സിലായില്ല.",
    },
  },
  {
    code: "or-IN",
    name: "ଓଡ଼ିଆ",
    englishName: "Odia",
    sarvamCode: "or-IN",
    browserCode: "or-IN",
    greetings: {
      morning: "ଶୁଭ ସକାଳ",
      afternoon: "ଶୁଭ ଅପରାହ୍ନ",
      evening: "ଶୁଭ ସନ୍ଧ୍ୟା",
    },
    voiceCues: {
      welcome: "ନମସ୍କାର! କୃଷି ମିତ୍ରକୁ ସ୍ୱାଗତ।",
      listening: "ମୁଁ ଶୁଣୁଛି।",
      processing: "ଦୟାକରି ଅପେକ୍ଷା କରନ୍ତୁ।",
      finished: "ବିଶ୍ଳେଷଣ ସମ୍ପୂର୍ଣ୍ଣ।",
      error: "କ୍ଷମା କରିବେ, ମୁଁ ବୁଝିପାରିଲି ନାହିଁ।",
    },
  },
  {
    code: "en-IN",
    name: "English",
    englishName: "English",
    sarvamCode: "en-IN",
    browserCode: "en-IN",
    greetings: {
      morning: "Good Morning",
      afternoon: "Good Afternoon",
      evening: "Good Evening",
    },
    voiceCues: {
      welcome: "Hello! Welcome to KrishiMitra. How can I help you with your farming today?",
      listening: "I'm listening. Please ask your question.",
      processing: "Please wait while I analyze your request.",
      finished: "Analysis complete.",
      error: "I'm sorry. I couldn't understand that. Please try again.",
    },
  },
];

export const getLanguageByCode = (code: string): Language => {
  return LANGUAGES.find((lang) => lang.code === code) || LANGUAGES[0];
};

export const DEFAULT_LANGUAGE = LANGUAGES[0];
