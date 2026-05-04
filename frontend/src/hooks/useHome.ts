// ─────────────────────────────────────────────────────────────────────────────
// hooks/useHome.ts
// Hook de la page d'accueil.
// Charge en parallèle les 8 premiers livres et les 3 prochains événements.
// Découpe la liste de livres en trois sections d'affichage.
// ─────────────────────────────────────────────────────────────────────────────

import { getErrorMessage } from "../utils/errors";
import type { Book, Event } from "../types";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

/**
 * Fournit les données pour la page d'accueil (HomePage).
 *
 * • featured      — premier livre de la liste, mis en avant dans le "cabinet"
 * • cabinetBooks  — livres 2 à 4, grille secondaire du cabinet des curiosités
 * • recommended   — livres 5 à 8, section "Recommandés pour vous"
 * • events        — 3 prochains événements, section "À venir"
 */
export function useHome() {
  // 1. STATE : liste brute de livres et d'événements récupérés depuis l'API
  const [books, setBooks] = useState<Book[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 2. EFFECT : chargement initial au montage du composant
  // Les deux appels sont indépendants, ils partent en parallèle
  useEffect(() => {
    const run = async () => {
      // 2.1 BOOKS : 8 livres suffisent pour remplir toutes les sections de la home
      try {
        const res = await apiFetch("/books?limit=8");
        setBooks(res.data ?? []);
      } catch (err) {
        setError(getErrorMessage(err, "Impossible de charger les livres"));
      }

      // 2.2 EVENTS : on limite à 3 événements pour la section "À venir"
      try {
        const res = await apiFetch("/events");
        setEvents((res.data ?? []).slice(0, 3));
      } catch (err) {
        setError(getErrorMessage(err, "Impossible de charger les événements"));
      }
    };
    run();
  }, []);

  // 3. CALCUL : découpage de la liste de livres en sections d'affichage
  const featured = books[0];           // Livre mis en avant (grande vignette)
  const cabinetBooks = books.slice(1, 4); // 3 livres secondaires du cabinet
  const recommended = books.slice(4, 8);  // 4 livres recommandés

  return { featured, cabinetBooks, recommended, events, error };
}