// ─────────────────────────────────────────────────────────────────────────────
// context/AuthContext.tsx
// Contexte React global pour la gestion de la session utilisateur.
//
// • AuthProvider  — wrapping de toute l'app, charge la session au démarrage
// • useAuth()     — hook d'accès au contexte dans n'importe quel composant
//
// L'authentification est basée sur un cookie httpOnly (refresh token).
// Le cookie est géré côté backend ; le frontend ne manipule jamais le JWT.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "../types";
import { apiFetch } from "../services/api";
import type { ReactNode } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provider à placer à la racine de l'application (dans main.tsx).
 * Charge la session au montage via GET /users/me et expose les actions
 * d'authentification à tous les composants enfants.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. STATE : utilisateur courant (null = non connecté)
  const [user, setUser] = useState<User | null>(null);
  // 1.1 STATE : true tant que la vérification de session initiale n'est pas terminée
  const [loading, setLoading] = useState(true);

  // 2. EFFECT : vérification de la session existante au démarrage de l'app
  // Si le cookie de session est valide, l'API renvoie les données de l'utilisateur
  useEffect(() => {
    apiFetch("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Connexion avec email + mot de passe.
   * L'API dépose un cookie httpOnly et renvoie les données de l'utilisateur.
   */
  async function login(email: string, password: string) {
    const res = await apiFetch("/users/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(res.data);
  }

  /**
   * Inscription d'un nouvel utilisateur.
   * L'API crée le compte, dépose le cookie et renvoie les données.
   */
  async function signup(username: string, email: string, password: string) {
    const res = await apiFetch("/users/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    setUser(res.data);
  }

  /**
   * Déconnexion : supprime le cookie côté serveur et réinitialise l'état local.
   */
  async function logout() {
    await apiFetch("/users/logout", { method: "POST" });
    setUser(null);
  }

  /**
   * Met à jour les données de l'utilisateur localement (ex: après édition du profil)
   * sans refaire un appel à /users/me.
   */
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

/**
 * Hook d'accès au contexte d'authentification.
 * Lance une erreur si utilisé en dehors de AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}