"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface UserProfile {
  name: string;
  email: string;
  businessName: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  email: "",
  businessName: "",
};

const STORAGE_KEY = "clearpath_user_profile";

interface UserContextValue {
  user: UserProfile;
  setUser: (profile: UserProfile) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  clearUser: () => void;
  isLoggedIn: boolean;
  initials: string;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUserState(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const setUser = useCallback((profile: UserProfile) => {
    setUserState(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, []);

  const updateUser = useCallback((partial: Partial<UserProfile>) => {
    setUserState((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearUser = useCallback(() => {
    setUserState(DEFAULT_PROFILE);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("clearpath_has_assessment");
  }, []);

  const isLoggedIn = !!user.name;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  if (!loaded) return null;

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, clearUser, isLoggedIn, initials }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
