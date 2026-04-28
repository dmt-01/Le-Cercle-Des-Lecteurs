// ─────────────────────────────────────────────────────────────────────────────
// hooks/useBookDetail.ts
// Hook de la page de détail d'un livre.
// Charge le livre et ses avis en parallèle, vérifie si le livre est dans
// la wishlist de l'utilisateur connecté, et expose les actions d'interaction.
// ─────────────────────────────────────────────────────────────────────────────

import type { Book, Review, Tab } from "../types";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useParams } from "react-router";

/**
 * Fournit les données et handlers pour la page de détail d'un livre (BookDetailPage).
 *
 * • book / reviews — données chargées depuis l'API
 * • tab / setTab   — onglet actif : "resume" | "critiques" | "forum"
 * • inWishlist     — true si le livre est dans la wishlist de l'utilisateur
 * • isRead         — true si l'utilisateur a marqué ce livre comme lu
 * • handleWishlist — ajoute ou retire le livre de la wishlist
 * • handleToggleRead — marque ou démarque le livre comme lu
 */
export function useBookDetail() {
  // 1. PARAMS : récupération de l'id du livre depuis l'URL (/books/:id)
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  // 2. STATE — Données du livre
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  // 2.1 STATE — Onglet actif sur la page de détail
  const [tab, setTab] = useState<Tab>("resume");
  const [loading, setLoading] = useState(true);

  // 3. STATE — Interactions utilisateur
  const [inWishlist, setInWishlist] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 4. EFFECT : chargement du livre et de ses avis en parallèle
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([apiFetch(`/books/${id}`), apiFetch(`/books/${id}/reviews`)])
      .then(([bookRes, reviewsRes]) => {
        setBook(bookRes.data ?? null);
        setReviews(reviewsRes.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // 5. EFFECT : vérification de la présence du livre dans la wishlist
  // Ne s'exécute que si l'utilisateur est connecté
  useEffect(() => {
    if (!user || !id) return;
    apiFetch("/wishlist")
      .then((res) => {
        const inList = (res.data ?? []).some(
          (wishlistBook: Book) => wishlistBook.id === id,
        );
        setInWishlist(inList);
      })
      .catch(() => {});
  }, [user, id]);

  /**
   * Ajoute le livre à la wishlist (POST) ou le retire (DELETE).
   * Met à jour l'état local immédiatement pour un retour visuel instantané.
   */
  async function handleWishlist() {
    if (!user || !id) return;
    setActionLoading(true);
    try {
      if (inWishlist) {
        // 6.1 WISHLIST : suppression
        await apiFetch(`/wishlist/${id}`, { method: "DELETE" });
        setInWishlist(false);
      } else {
        // 6.2 WISHLIST : ajout
        await apiFetch("/wishlist", {
          method: "POST",
          body: JSON.stringify({ bookId: id }),
        });
        setInWishlist(true);
      }
    } catch {}
    setActionLoading(false);
  }

  /**
   * Bascule le statut "lu" du livre via l'API.
   * Le backend gère le toggle : si déjà lu → supprime, sinon → ajoute.
   */
  async function handleToggleRead() {
    if (!user || !id) return;
    setActionLoading(true);
    try {
      await apiFetch(`/books/${id}/read`, { method: "POST" });
      setIsRead((prev) => !prev);
    } catch {}
    setActionLoading(false);
  }

  return {
    book,
    reviews,
    tab,
    setTab,
    loading,
    inWishlist,
    isRead,
    actionLoading,
    handleWishlist,
    handleToggleRead,
  };
}