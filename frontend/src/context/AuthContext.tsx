import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "../types";
import { apiFetch } from "../services/api";
import type { ReactNode } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await apiFetch("/users/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(res.data);
  }

  async function signup(username: string, email: string, password: string) {
    const res = await apiFetch("/users/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    setUser(res.data);
  }

  async function logout() {
    await apiFetch("/users/logout", { method: "POST" });
    setUser(null);
  }

  function updateUser(updated: User) {
    setUser(updated);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}
