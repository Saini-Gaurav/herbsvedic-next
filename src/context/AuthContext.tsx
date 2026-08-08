"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiFetch, ApiError } from "@/lib/apiClient";

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL;

interface User {
  userId: string;
  name: string;
  roleCode: string;
  role: string;
  permissions: string[];
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Starts true - we don't actually know yet whether the person is logged in until /auth/me answers. Showing "Login" for a split second before flipping to "Logout" would look broken; isLoading lets the Header decide to show nothing (or a skeleton) until we genuinely know the answer.
  const [isLoading, setIsLoading] = useState(true);

  // On every full page load, ask the server "who am I" - this is the ENTIRE replacement for the old `!!localStorage.getItem('token')` check. No token to inspect on our side; we just ask.
  useEffect(() => {
    async function checkSession() {
      try {
        const data = await apiFetch<{ data: User }>(`${AUTH_API}/auth/me`);
        setUser(data.data);
      } catch {
        // A 401 here just means "not logged in" - not a real error to show anyone, so it's caught and silently treated as "no user."
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkSession();
  }, []);

  async function login(email: string, password: string) {
    await apiFetch(`${AUTH_API}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    // The login call itself doesn't need to return the user - we already know how to ask for it (/auth/me), so reuse that instead of duplicating "what does a logged-in user look like" in two places.
    const data = await apiFetch<{ data: User }>(`${AUTH_API}/auth/me`);
    setUser(data.data);
  }

  async function register(name: string, email: string, password: string, phone: string) {
    await apiFetch(`${AUTH_API}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await apiFetch<{ data: User }>(`${AUTH_API}/auth/me`);
    setUser(data.data);
  }

  async function logout() {
    await apiFetch(`${AUTH_API}/auth/logout`, { method: "POST" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// The hook every component actually uses - e.g. const { user, login } = useAuth(). Throws a clear error if someone forgets to wrap the app in <AuthProvider>, instead of a confusing "cannot read property of undefined" three files away from the real mistake.
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}