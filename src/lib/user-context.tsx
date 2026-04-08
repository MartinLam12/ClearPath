"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

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

const PROFILE_KEY = "clearpath_user_profile";

interface UserContextValue {
  user: UserProfile;
  authUser: User | null;
  setUser: (profile: UserProfile) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  clearUser: () => Promise<void>;
  isLoggedIn: boolean;
  initials: string;
  loading: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Safely create supabase client — null if not configured
  const supabase = (() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  })();

  // Load session on mount
  useEffect(() => {
    async function loadSession() {
      if (!supabase) {
        // Supabase not configured — fall back to localStorage only
        try {
          const stored = localStorage.getItem(PROFILE_KEY);
          if (stored) setProfileState(JSON.parse(stored));
        } catch {
          // ignore
        }
        setLoading(false);
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setAuthUser(user);
          const meta = user.user_metadata;
          const p: UserProfile = {
            name: meta?.name || "",
            email: user.email || "",
            businessName: meta?.business_name || "",
          };
          setProfileState(p);
          localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
        } else {
          // Try localStorage as fallback for fast load
          try {
            const stored = localStorage.getItem(PROFILE_KEY);
            if (stored) setProfileState(JSON.parse(stored));
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    loadSession();

    // Listen for auth state changes (only if supabase is configured)
    const sb = supabase;
    if (!sb) return;

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setAuthUser(session.user);
        const meta = session.user.user_metadata;
        const p: UserProfile = {
          name: meta?.name || "",
          email: session.user.email || "",
          businessName: meta?.business_name || "",
        };
        setProfileState(p);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
      } else {
        setAuthUser(null);
        setProfileState(DEFAULT_PROFILE);
        localStorage.removeItem(PROFILE_KEY);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setUser = useCallback(
    (p: UserProfile) => {
      setProfileState(p);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
      // Sync to Supabase user metadata
      supabase?.auth.updateUser({
        data: { name: p.name, business_name: p.businessName },
      });
    },
    [supabase]
  );

  const updateUser = useCallback(
    (partial: Partial<UserProfile>) => {
      setProfileState((prev) => {
        const next = { ...prev, ...partial };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
        // Sync to Supabase user metadata
        supabase?.auth.updateUser({
          data: { name: next.name, business_name: next.businessName },
        });
        return next;
      });
    },
    [supabase]
  );

  const clearUser = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setAuthUser(null);
    setProfileState(DEFAULT_PROFILE);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem("clearpath_has_assessment");
    localStorage.removeItem("clearpath_assessment_data");
  }, [supabase]);

  // Logged in if we have a Supabase session, or (if Supabase not configured) a profile name
  const isLoggedIn = supabase ? !!authUser : !!profile.name;

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  if (loading) return null;

  return (
    <UserContext.Provider
      value={{
        user: profile,
        authUser,
        setUser,
        updateUser,
        clearUser,
        isLoggedIn,
        initials,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
