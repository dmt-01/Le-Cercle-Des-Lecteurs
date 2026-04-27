import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import type { Event } from "../types";

function groupByMonth(events: Event[]): [string, Event[]][] {
  const map = new Map<string, Event[]>();
  for (const event of events) {
    const key = new Date(event.event_date).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(event);
  }
  return [...map.entries()];
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    load();
  }, []);

  const grouped = groupByMonth(events);

  return { events, loading, error, grouped, load };
}
