// ─────────────────────────────────────────────────────────────────────────────
// hooks/useEventDetail.ts
// Hook de la page de détail d'un événement.
// Charge l'événement et une sélection de livres recommandés en parallèle.
// Formate la date et l'heure de l'événement pour l'affichage.
// ─────────────────────────────────────────────────────────────────────────────

import type { Event, Book } from "../types";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useParams } from "react-router";

/**
 * Fournit les données pour la page de détail d'un événement (EventDetailPage).
 *
 * • event         — données de l'événement chargé depuis l'API
 * • books         — 4 premiers livres du catalogue pour la section "Lectures recommandées"
 * • formattedDate — date de l'événement formatée en français, ex: "15 novembre 2025"
 * • formattedTime — heure de l'événement formatée, ex: "18:30"
 */
export function useEventDetail() {
  // 1. PARAMS : id de l'événement depuis l'URL (/events/:id)
  const { id } = useParams<{ id: string }>();

  // 2. STATE — Données de l'événement et des livres recommandés
  const [event, setEvent] = useState<Event | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. EFFECT : chargement de l'événement et des livres en parallèle
  // Les livres ne sont pas liés à l'événement : c'est une sélection générique
  useEffect(() => {
    if (!id) return;
    Promise.all([apiFetch(`/events/${id}`), apiFetch("/books?limit=4")])
      .then(([eventRes, booksRes]) => {
        setEvent(eventRes.data ?? null);
        // On limite à 4 livres pour la section "Lectures recommandées"
        setBooks((booksRes.data ?? []).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // 4. CALCUL : formatage de la date et de l'heure pour l'affichage
  const formattedDate = event
    ? new Date(event.event_date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const formattedTime = event
    ? new Date(event.event_date).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return { event, books, loading, formattedDate, formattedTime };
}