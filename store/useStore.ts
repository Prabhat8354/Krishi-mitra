import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  thinkingText?: string;
  audioBase64?: string;
  imageUrl?: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface FarmerProfile {
  name: string;
  age?: string;
  gender?: string;
  phone?: string;
  email?: string;
  state: string;
  district: string;
  village: string;
  pinCode?: string;
  preferredLanguage: string;
  farmSize: string;
  landUnit?: string;
  soilType: string;
  mainCrops: string;
  secondaryCrops?: string;
  irrigationType: string;
  isOrganic?: boolean;
  weatherAlerts?: boolean;
  priceAlerts?: boolean;
  schemeAlerts?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "rain" | "price" | "disease" | "scheme" | "weather";
  timestamp: string;
  read: boolean;
}

interface AppState {
  sessionId: string;
  currentLanguage: string;
  audioEnabled: boolean;
  lat: string | null;
  lon: string | null;
  languageSelected: boolean;
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
  userToken: string | null;
  messages: ChatMessage[];
  messagesLoaded: boolean;
  profile: FarmerProfile;
  notifications: NotificationItem[];
  setSessionId: (id: string) => void;
  setLanguage: (lang: string) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setLocation: (lat: string, lon: string) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  login: (token?: string, isExistingUser?: boolean) => void;
  logout: () => void;
  setProfile: (profile: Partial<FarmerProfile>) => void;
  addNotification: (notification: Omit<NotificationItem, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp" | "sessionId">) => ChatMessage;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  getSessionMessages: (sessionId: string) => ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  setMessagesLoaded: (loaded: boolean) => void;
  clearMessages: () => void;
}

// Generate UUID v4
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const DEFAULT_PROFILE: FarmerProfile = {
  name: "Rajesh Kumar",
  state: "Punjab",
  district: "Ludhiana",
  village: "Samrala",
  preferredLanguage: "hi-IN",
  farmSize: "5 Acres",
  soilType: "Alluvial / Loam Soil",
  mainCrops: "Wheat, Rice, Tomato",
  irrigationType: "Drip & Tube Well",
};

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Heavy Rainfall Warning",
    message: "Heavy rain predicted tomorrow in Ludhiana. Postpone irrigation and chemical spraying.",
    type: "rain",
    timestamp: "10 mins ago",
    read: false,
  },
  {
    id: "notif-2",
    title: "Tomato Market Price Surge",
    message: "Tomato prices in Azadpur Mandi increased by +12% today to ₹2,800/quintal.",
    type: "price",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "notif-3",
    title: "PM-Kisan 17th Installment",
    message: "PM-Kisan Samman Nidhi e-KYC deadline extended. Check eligibility details.",
    type: "scheme",
    timestamp: "3 hours ago",
    read: false,
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      sessionId: generateUUID(),
      currentLanguage: "",
      audioEnabled: true,
      lat: null,
      lon: null,
      languageSelected: false,
      hasCompletedOnboarding: false,
      isAuthenticated: false,
      userToken: null,
      messages: [],
      messagesLoaded: false,
      profile: DEFAULT_PROFILE,
      notifications: DEFAULT_NOTIFICATIONS,
      setSessionId: (id) => set({ sessionId: id }),
      setLanguage: (lang) => set({ currentLanguage: lang, languageSelected: true }),
      setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
      setLocation: (lat, lon) => set({ lat, lon }),
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
      login: (token, isExistingUser = false) => {
        const state = get();
        const isProfileComplete = Boolean(
          state.profile &&
          state.profile.name &&
          state.profile.district &&
          state.profile.state &&
          state.profile.farmSize &&
          state.profile.mainCrops
        );
        set({
          isAuthenticated: true,
          userToken: token || "km-auth-token-" + Date.now(),
          hasCompletedOnboarding: isExistingUser && isProfileComplete,
        });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("farmer-chat-messages");
        }
        set({
          isAuthenticated: false,
          userToken: null,
          hasCompletedOnboarding: false,
          sessionId: generateUUID(),
          messages: [],
        });
      },
      setProfile: (newProfile) => set((state) => ({ profile: { ...state.profile, ...newProfile } })),
      addNotification: (notif) => {
        const item: NotificationItem = {
          ...notif,
          id: Date.now().toString(),
          timestamp: "Just now",
          read: false,
        };
        set((state) => ({ notifications: [item, ...state.notifications] }));
      },
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      clearNotifications: () => set({ notifications: [] }),
      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: Date.now().toString() + Math.random(),
          timestamp: new Date(),
          sessionId: get().sessionId,
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
        return newMessage;
      },
      updateMessage: (id, updates) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        }));
      },
      getSessionMessages: (sessionId) => {
        return get().messages.filter((msg) => msg.sessionId === sessionId);
      },
      setMessages: (messages) => set({ messages }),
      setMessagesLoaded: (loaded) => set({ messagesLoaded: loaded }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "farmer-sahayak-storage",
      partialize: (state) => ({
        sessionId: state.sessionId,
        currentLanguage: state.currentLanguage,
        audioEnabled: state.audioEnabled,
        lat: state.lat,
        lon: state.lon,
        languageSelected: state.languageSelected,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        isAuthenticated: state.isAuthenticated,
        userToken: state.userToken,
        profile: state.profile,
        notifications: state.notifications,
      }),
    }
  )
);
