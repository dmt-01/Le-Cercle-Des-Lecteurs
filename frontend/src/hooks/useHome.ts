import type { Book, Event } from "../types";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export function useHome() {
  const [books, setBooks] = useState<Book[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    apiFetch("/books?limit=8")
      .then((res) => setBooks(res.data ?? []))
      .catch(() => {});

    apiFetch("/events")
      .then((res) => setEvents((res.data ?? []).slice(0, 3)))
      .catch(() => {});
  }, []);

  const featured = books[0];
  const cabinetBooks = books.slice(1, 4);
  const recommended = books.slice(4, 8);

  return { featured, cabinetBooks, recommended, events };
}
