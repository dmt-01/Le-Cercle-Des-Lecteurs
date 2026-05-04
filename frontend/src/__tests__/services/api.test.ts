// ─────────────────────────────────────────────────────────────────────────────
// __tests__/services/api.test.ts
// Tests unitaires d'apiFetch.
//
// On ne passe pas par MSW ici : on mocke directement la fonction globale fetch
// avec vi.stubGlobal. C'est plus simple et plus précis pour tester un wrapper
// fetch — on contrôle exactement ce que fetch reçoit et renvoie.
// ─────────────────────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL, apiFetch } from "../../services/api";

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Crée un objet Response simulé avec un body JSON et un status HTTP.
 * Reproduit exactement ce que le vrai fetch() renverrait depuis le navigateur.
 */
function mockResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ─── Suite de tests ───────────────────────────────────────────────────────────

describe("apiFetch", () => {
  beforeEach(() => {
    // Remplace la vraie fonction fetch globale par un espion vitest
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    // Remet fetch à sa valeur d'origine après chaque test
    vi.unstubAllGlobals();
  });

  // ── Cas nominal ──────────────────────────────────────────────────────────────

  it("retourne le JSON parsé pour une réponse 200", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse({ data: [] }));

    const result = await apiFetch("/books");

    expect(result).toEqual({ data: [] });
  });

  it("envoie credentials: include et Content-Type: application/json", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse({}));

    await apiFetch("/books");

    // On vérifie que fetch a bien été appelé avec les bons paramètres
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/books`,
      expect.objectContaining({
        credentials: "include",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("transmet les options supplémentaires (method, body)", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse({ id: "new-1" }, 201));

    await apiFetch("/books", {
      method: "POST",
      body: JSON.stringify({ title: "Dune" }),
    });

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/books`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ title: "Dune" }),
      }),
    );
  });

  // ── Gestion des erreurs ──────────────────────────────────────────────────────

  it("lance une erreur avec .status pour une réponse 404", async () => {
    vi.mocked(fetch).mockResolvedValue(
      mockResponse({ message: "Livre introuvable" }, 404),
    );

    await expect(apiFetch("/books/999")).rejects.toMatchObject({
      message: "Livre introuvable",
      status: 404,
    });
  });

  it("utilise le message de fallback si le body ne contient pas de message", async () => {
    vi.mocked(fetch).mockResolvedValue(mockResponse({}, 500));

    await expect(apiFetch("/books")).rejects.toMatchObject({
      message: "Une erreur est survenue",
      status: 500,
    });
  });

  // ── Refresh automatique du token (401) ───────────────────────────────────────

  it("tente un refresh puis rejoue la requête après un 401", async () => {
    vi.mocked(fetch)
      // 1ère requête → 401
      .mockResolvedValueOnce(mockResponse({ message: "Non autorisé" }, 401))
      // appel au endpoint de refresh → ok
      .mockResolvedValueOnce(mockResponse({}, 200))
      // retry de la requête originale → ok
      .mockResolvedValueOnce(mockResponse({ data: "livres" }, 200));

    const result = await apiFetch("/books");

    // fetch doit avoir été appelé 3 fois : original + refresh + retry
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ data: "livres" });
  });

  it("appelle bien /users/refresh lors du retry 401", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockResponse({ message: "Non autorisé" }, 401))
      .mockResolvedValueOnce(mockResponse({}, 200))
      .mockResolvedValueOnce(mockResponse({}, 200));

    await apiFetch("/books");

    // Le 2ème appel fetch doit cibler /users/refresh
    const secondCall = vi.mocked(fetch).mock.calls[1];
    expect(secondCall[0]).toBe(`${API_BASE_URL}/users/refresh`);
  });

  it("lance 'Session expirée' si le refresh échoue", async () => {
    vi.mocked(fetch)
      // requête originale → 401
      .mockResolvedValueOnce(mockResponse({ message: "Non autorisé" }, 401))
      // refresh → aussi 401 (token définitivement invalide)
      .mockResolvedValueOnce(mockResponse({ message: "Refresh échoué" }, 401));

    await expect(apiFetch("/books")).rejects.toThrow("Session expirée");
  });

  it("ne retente pas indéfiniment (pas de boucle infinie sur le retry)", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(mockResponse({ message: "Non autorisé" }, 401))
      .mockResolvedValueOnce(mockResponse({}, 200))
      // le retry renvoie aussi 401 → doit throw, pas retry à nouveau
      .mockResolvedValueOnce(mockResponse({ message: "Toujours 401" }, 401));

    await expect(apiFetch("/books")).rejects.toMatchObject({
      message: "Toujours 401",
      status: 401,
    });

    // Seulement 3 appels : pas de 4ème tentative
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});
