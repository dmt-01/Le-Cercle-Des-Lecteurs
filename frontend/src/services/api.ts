// ─────────────────────────────────────────────────────────────────────────────
// services/api.ts
// Couche d'accès à l'API backend.
// Fournit une fonction apiFetch() qui wrappe fetch() avec :
//   • l'URL de base lue depuis les variables d'environnement Vite
//   • les cookies de session (credentials: "include")
//   • le header Content-Type JSON par défaut
//   • un mécanisme de refresh automatique du token en cas de 401
// ─────────────────────────────────────────────────────────────────────────────

/** URL de base de l'API, configurée via VITE_API_BASE_URL dans .env */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Effectue une requête HTTP vers l'API backend.
 *
 * • Ajoute automatiquement le header Content-Type: application/json
 * • Inclut les cookies (session httpOnly) via credentials: "include"
 * • En cas de 401, tente un refresh du token puis rejoue la requête une fois
 * • Lance une Error enrichie avec .status si la réponse est en erreur
 *
 * @param endpoint - Chemin relatif, ex: "/books/123"
 * @param options  - Options fetch standard (method, body, headers…)
 * @param _retry   - Usage interne : true si on est déjà dans une tentative de retry
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  _retry = false,
) {
  const url = `${API_BASE_URL}${endpoint}`;

  // 1. REQUÊTE : envoi avec les credentials et le header JSON
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // 2. SUCCÈS : on retourne directement le JSON parsé
  if (response.ok) {
    return response.json();
  }

  // 3. TOKEN EXPIRÉ : on tente un refresh automatique (une seule fois)
  if (response.status === 401 && !_retry) {
    const refreshResponse = await fetch(API_BASE_URL + "/users/refresh", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (refreshResponse.ok) {
      // 3.1 Refresh réussi : on rejoue la requête originale
      return apiFetch(endpoint, options, true);
    } else {
      // 3.2 Refresh échoué : session définitivement expirée
      throw new Error("Session expirée");
    }
  }

  // 4. ERREUR : on extrait le message du corps et on le lance
  const errorData = await response.json();
  const err = new Error(
    errorData.message || "Une erreur est survenue",
  ) as Error & { status: number };
  err.status = response.status;
  throw err;
}