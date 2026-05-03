// ─────────────────────────────────────────────────────────────────────────────
// test/handlers.ts
// Faux serveur MSW : intercepte les requêtes HTTP pendant les tests.
// Chaque handler remplace un vrai appel réseau par une réponse simulée.
// ─────────────────────────────────────────────────────────────────────────────

import { http, HttpResponse } from "msw";
import { API_BASE_URL } from "../services/api";

/** Livre fictif utilisé dans les réponses simulées */
export const mockBook = {
  id: "book-1",
  title: "Les Misérables",
  cover_image: "https://example.com/cover.jpg",
  description: "Un chef-d'œuvre.",
  publication_date: "1862-01-01",
  average_rating: 4.5,
  review_count: 10,
  authors: [{ id: "a1", name: "Victor Hugo" }],
  genres: [{ id: "g1", name: "Roman" }],
  tags: [],
};

export const mockBook2 = {
  id: "book-2",
  title: "Notre-Dame de Paris",
  cover_image: null,
  description: "Une autre œuvre de Victor Hugo.",
  average_rating: 4.2,
  review_count: 5,
  authors: [{ id: "a1", name: "Victor Hugo" }],
  genres: [{ id: "g2", name: "Historique" }],
  tags: [],
};

export const handlers = [
  // GET /books — liste paginée ou chargement des genres (limit=100)
  http.get(`${API_BASE_URL}/books`, ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");

    if (limit === "100") {
      // Appel utilisé pour extraire tous les genres disponibles
      return HttpResponse.json({
        data: [mockBook, mockBook2],
        pagination: { totalPages: 1, currentPage: 1 },
      });
    }

    // Appel paginé normal
    return HttpResponse.json({
      data: [mockBook],
      pagination: { totalPages: 3, currentPage: 1 },
    });
  }),

  // GET /books/search — recherche plein texte
  http.get(`${API_BASE_URL}/books/search`, () => {
    return HttpResponse.json({ data: [mockBook] });
  }),

  // GET /books/:id — détail d'un livre
  http.get(`${API_BASE_URL}/books/:id`, () => {
    return HttpResponse.json({ data: mockBook });
  }),

  // GET /events — liste des événements
  http.get(`${API_BASE_URL}/events`, () => {
    return HttpResponse.json({
      data: [
        {
          id: "event-1",
          title: "Soirée lecture",
          description: "Lecture collective.",
          event_date: new Date(Date.now() + 86400000).toISOString(),
          group: { id: "g1", name: "Cercle Hugo" },
        },
      ],
    });
  }),

  // POST /users/refresh — refresh du token JWT
  http.post(`${API_BASE_URL}/users/refresh`, () => {
    return HttpResponse.json({ message: "Token rafraîchi" });
  }),
];
