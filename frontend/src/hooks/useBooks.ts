// ─────────────────────────────────────────────────────────────────────────────
// hooks/useBooks.ts
// Hook de la page bibliothèque.
//
// Gère un système de filtres à deux couches :
//   • "draft" — valeurs saisies dans le formulaire, non encore appliquées
//   • "applied" — valeurs actives qui déclenchent réellement les appels API
//
// Cela évite de relancer une recherche à chaque frappe clavier :
// la recherche ne part que lorsque l'utilisateur soumet le formulaire.
// ─────────────────────────────────────────────────────────────────────────────

import { getErrorMessage } from "../utils/errors";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import type { Book } from "../types";

/**
 * Fournit les données et les handlers pour la page bibliothèque (BooksPage).
 *
 * • draftSearch/Genre/Note — état du formulaire, pas encore soumis
 * • appliedSearch/Genre/Note — filtres actifs, déclenchent les appels API
 * • featured — premier livre de la page, affiché en mode "hero"
 * • rest — tous les autres livres, affichés en grille
 * • handleFilter — applique les drafts en tant que filtres actifs
 */
export function useBooks() {
  // 1. URL : lecture du paramètre ?search= dans l'URL (navigation externe possible)
  const [searchParams] = useSearchParams();

  // 2. STATE — Formulaire (valeurs "brouillon", non encore appliquées)
  const [draftSearch, setDraftSearch] = useState(
    searchParams.get("search") ?? "",
  );
  const [draftGenre, setDraftGenre] = useState("");
  const [draftNote, setDraftNote] = useState(0);

  // 3. STATE — Filtres actifs (déclenchent les appels API)
  const [appliedSearch, setAppliedSearch] = useState(
    searchParams.get("search") ?? "",
  );
  const [appliedGenre, setAppliedGenre] = useState("");
  const [appliedNote, setAppliedNote] = useState(0);
  const [page, setPage] = useState(1);

  // 4. STATE — Données chargées depuis l'API
  const [books, setBooks] = useState<Book[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 5. EFFECT : chargement unique de tous les genres disponibles pour le select
  // On charge 100 livres pour couvrir tous les genres du catalogue
  useEffect(() => {
    const run = async () => {
      try {
        const res = await apiFetch("/books?limit=100");
        const genres = [
          ...new Set(
            (res.data ?? []).flatMap((book: Book) =>
              book.genres.map((genre) => genre.name),
            ),
          ),
        ] as string[];
        setAllGenres(genres.sort());
      } catch (err) {
        setError(getErrorMessage(err, "Impossible de charger les genres."));
      }
    };
    run();
  }, []);

  // 6. EFFECT : synchronisation avec les paramètres d'URL
  // Permet d'arriver sur la page avec un ?search=... déjà actif (ex: depuis la navbar)
  useEffect(() => {
    const searchQuery = searchParams.get("search") ?? "";
    setDraftSearch(searchQuery);
    setAppliedSearch(searchQuery);
    setPage(1);
  }, [searchParams]);

  // 7. EFFECT : chargement des livres à chaque changement de filtre ou de page
  useEffect(() => {
    setLoading(true);
    const run = async () => {
      try {
        let results: Book[] = [];
        let pages = 1;

        if (appliedSearch.trim()) {
          // 7.1 RECHERCHE FULL-TEXT : l'endpoint /search ne pagine pas côté serveur
          const res = await apiFetch(
            `/books/search?q=${encodeURIComponent(appliedSearch.trim())}`,
          );
          results = res.data ?? [];
          // On applique le filtre genre côté client car le endpoint search ne le supporte pas
          if (appliedGenre)
            results = results.filter((book) =>
              book.genres.some((genre) => genre.name === appliedGenre),
            );
        } else {
          // 7.2 LISTE PAGINÉE : utilise la pagination serveur avec genre en paramètre
          const params = new URLSearchParams({ page: String(page), limit: "12" });
          if (appliedGenre) params.set("genre", appliedGenre);
          const res = await apiFetch(`/books?${params}`);
          results = res.data ?? [];
          pages = res.pagination?.totalPages ?? 1;
        }

        // 7.3 FILTRE NOTE : appliqué côté client sur les résultats déjà chargés
        if (appliedNote > 0) {
          results = results.filter(
            (book) => (book.average_rating ?? 0) >= appliedNote,
          );
        }

        setBooks(results);
        setTotalPages(pages);
      } catch (err) {
        setError(getErrorMessage(err, "Impossible de charger les livres."));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [appliedSearch, appliedGenre, appliedNote, page, refreshKey]);

  /**
   * Applique les valeurs du formulaire (drafts) comme filtres actifs.
   * Remet la pagination à la page 1 pour éviter d'atterrir sur une page inexistante.
   */
  function handleFilter(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedSearch(draftSearch);
    setAppliedGenre(draftGenre);
    setAppliedNote(draftNote);
    setPage(1);
  }

  /** Force le rechargement de la liste (appelé après création d'un livre). */
  function refreshBooks() {
    setRefreshKey((k) => k + 1);
  }

  // 8. CALCUL : découpage de la liste pour l'affichage en page
  const featured = books[0]; // Premier livre affiché en grande carte "hero"
  const rest = books.slice(1); // Reste affiché en grille 4 colonnes

  return {
    draftSearch,
    setDraftSearch,
    draftGenre,
    setDraftGenre,
    draftNote,
    setDraftNote,
    allGenres,
    totalPages,
    loading,
    featured,
    rest,
    page,
    setPage,
    appliedSearch,
    handleFilter,
    error,
    showAddModal,
    setShowAddModal,
    refreshBooks,
  };
}