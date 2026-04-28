// ─────────────────────────────────────────────────────────────────────────────
// hooks/useEvents.ts
// Hook de la page liste des événements.
// Charge tous les événements et les regroupe par mois pour l'affichage.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import type { Event } from "../types";

/**
 * Regroupe une liste d'événements par mois.
 * Retourne un tableau de paires [label du mois, événements du mois].
 * Le label est capitalisé, ex: "Novembre 2025".
 *
 * @param events - Liste d'événements triée par date croissante
 */
function groupByMonth(events: Event[]): [string, Event[]][] {
  const map = new Map<string, Event[]>();
  for (const event of events) {
    // Génère un label "mois année" localisé en français
    const key = new Date(event.event_date).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
    // Capitalise la première lettre (toLocaleDateString renvoie en minuscules)
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(event);
  }
  return [...map.entries()];
}

/**
 * Fournit les données pour la page des événements (EventsPage).
 *
 * • grouped — événements regroupés par mois : [["Novembre 2025", [...]], ...]
 * • load    — recharge la liste (bouton "Réessayer" en cas d'erreur)
 */
export function useEvents() {
  // 1. STATE — Liste brute d'événements
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charge ou recharge tous les événements depuis l'API.
   * Exposé pour le bouton "Réessayer" en cas d'erreur réseau.
   */
  function load() {
    setLoading(true);
    setError(null);
    apiFetch("/events")
      .then((res) => setEvents(res.data ?? []))
      .catch((err) =>
        setError(err?.message ?? "Impossible de charger les événements."),
      )
      .finally(() => setLoading(false));
  }

  // 2. EFFECT : chargement initial au montage
  useEffect(() => {
    load();
  }, []);

  // 3. CALCUL : regroupement des événements par mois pour l'affichage en sections
  const grouped = groupByMonth(events);

  return { events, loading, error, grouped, load };
}