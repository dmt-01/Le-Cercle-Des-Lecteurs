import type { Event, Book } from "../types";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useParams } from "react-router";

export function useEventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([apiFetch(`/events/${id}`), apiFetch("/books?limit=4")])
      .then(([eventRes, booksRes]) => {
        setEvent(eventRes.data ?? null);
        setBooks((booksRes.data ?? []).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

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
