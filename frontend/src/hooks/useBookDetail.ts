import type { Book, Review, Tab } from "../types";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useParams } from "react-router";

export function useBookDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tab, setTab] = useState<Tab>("resume");
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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

  async function handleWishlist() {
    if (!user || !id) return;
    setActionLoading(true);
    try {
      if (inWishlist) {
        await apiFetch(`/wishlist/${id}`, { method: "DELETE" });
        setInWishlist(false);
      } else {
        await apiFetch("/wishlist", {
          method: "POST",
          body: JSON.stringify({ bookId: id }),
        });
        setInWishlist(true);
      }
    } catch {}
    setActionLoading(false);
  }

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
