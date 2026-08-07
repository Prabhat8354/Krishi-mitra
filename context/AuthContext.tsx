"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useStore } from "@/store/useStore";

export interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  gpsLocation?: { lat: number; lon: number };
  farmSize: number;
  farmSizeUnit: string;
  primaryCrop: string;
  preferredLanguage: string;
  voiceLanguage: string;
  profilePhoto?: string;
  role: "Farmer" | "Admin";
  notificationPreferences?: Record<string, boolean>;
  createdAt?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<boolean>;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (formData: any) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const setStoreProfile = useStore((state) => state.setProfile);
  const setStoreLanguage = useStore((state) => state.setLanguage);

  const syncUserToStore = useCallback((userData: UserProfile) => {
    setUser(userData);
    setIsAuthenticated(true);

    // Sync to Zustand Store
    setStoreProfile({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      state: userData.state || "Punjab",
      district: userData.district || "Ludhiana",
      village: userData.village || "Samrala",
      farmSize: String(userData.farmSize || 5),
      landUnit: userData.farmSizeUnit || "Acres",
      mainCrops: userData.primaryCrop || "Wheat, Rice, Tomato",
      preferredLanguage: userData.preferredLanguage || "hi-IN",
      soilType: "Loamy Soil",
      irrigationType: "Drip / Tube-well",
    });

    if (userData.preferredLanguage) {
      setStoreLanguage(userData.preferredLanguage);
    }
  }, [setStoreProfile, setStoreLanguage]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { method: "GET" });
      const data = await res.json();

      if (res.ok && data.success && data.authenticated && data.user) {
        syncUserToStore(data.user);
        setLoading(false);
        return true;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("❌ Auth Verification Error:", error);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }
  }, [syncUserToStore]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (emailOrPhone: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        syncUserToStore(data.user);
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error: any) {
      setLoading(false);
      return { success: false, error: error.message || "Network error during login" };
    }
  };

  const register = async (formData: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        syncUserToStore(data.user);
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: data.error || "Registration failed" };
      }
    } catch (error: any) {
      setLoading(false);
      return { success: false, error: error.message || "Network error during registration" };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        syncUserToStore(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Profile update failed" };
      }
    } catch (error: any) {
      return { success: false, error: error.message || "Network error during profile update" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API Error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        checkAuth,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
