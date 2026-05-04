// ─────────────────────────────────────────────────────────────────────────────
// __tests__/hooks/useBooks.test.tsx
// Tests d'intégration du hook useBooks.
//
// Différence avec api.test.ts :
//   • On teste le hook dans son ensemble (appel API + mise à jour des states)
//   • On utilise MSW (défini dans src/test/handlers.ts) pour simuler le backend
//   • On utilise renderHook de @testing-library/react pour monter le hook
//
// Pourquoi l'extension .tsx ?
//   Le wrapper JSX (<MemoryRouter>) nécessite le support JSX dans ce fichier.
// ─────────────────────────────────────────────────────────────────────────────

import { act, renderHook, waitFor } from "@testing-library/react";
import { API_BASE_URL } from "../../services/api";
import { useBooks } from "../../hooks/useBooks";
import { mockBook } from "../../test/handlers";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";

// ─── Wrapper ──────────────────────────────────────────────────────────────────
//
// useBooks appelle useSearchParams() qui requiert un contexte Router.
// On fournit un MemoryRouter comme wrapper autour du hook.

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

// ─── Suite de tests ───────────────────────────────────────────────────────────

describe("useBooks", () => {
  // ── Chargement initial ───────────────────────────────────────────────────────

  it("charge les livres au montage et expose featured + rest", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    // Au départ le hook est en cours de chargement
    expect(result.current.loading).toBe(true);

    // On attend que le chargement soit terminé
    await waitFor(() => expect(result.current.loading).toBe(false));

    // featured = premier livre, rest = les suivants
    expect(result.current.featured?.title).toBe(mockBook.title);
    expect(result.current.rest).toHaveLength(0); // MSW renvoie 1 livre = 0 dans rest
  });

  it("extrait les genres depuis le premier appel et les trie alphabétiquement", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    // handlers.ts renvoie mockBook (Roman) et mockBook2 (Historique) pour limit=100
    // Les genres doivent être triés : Historique avant Roman
    expect(result.current.allGenres).toEqual(["Historique", "Roman"]);
  });

  it("expose totalPages depuis la réponse paginée", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    // handlers.ts renvoie totalPages: 3 dans la réponse paginée
    expect(result.current.totalPages).toBe(3);
  });

  // ── Gestion des erreurs ──────────────────────────────────────────────────────

  it("expose une erreur si le backend retourne une erreur", async () => {
    const { server } = await import("../../test/server");
    const { http, HttpResponse } = await import("msw");

    // Remplace temporairement le handler /books par une réponse 500
    server.use(
      http.get(`${API_BASE_URL}/books`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).not.toBeNull();
  });

  // ── Modal et actions ─────────────────────────────────────────────────────────

  it("showAddModal est false par défaut et peut être ouvert", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Par défaut la modal est fermée
    expect(result.current.showAddModal).toBe(false);

    // On peut l'ouvrir
    act(() => result.current.setShowAddModal(true));
    expect(result.current.showAddModal).toBe(true);
  });

  it("refreshBooks() recharge la liste sans changer les filtres", async () => {
    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Données initiales présentes
    expect(result.current.featured?.title).toBe(mockBook.title);

    // On déclenche un rechargement
    act(() => result.current.refreshBooks());

    // On attend la fin du nouveau chargement
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Les données sont toujours là (MSW renvoie le même mock)
    expect(result.current.featured?.title).toBe(mockBook.title);
  });
});
