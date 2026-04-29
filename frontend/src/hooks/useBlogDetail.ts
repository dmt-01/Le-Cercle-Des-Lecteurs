// ─────────────────────────────────────────────────────────────────────────────
// hooks/useBlogDetail.ts
// Hook de la page de détail d'un article de blog.
// Charge l'article par son id et maintient l'état du champ de commentaire.
// ─────────────────────────────────────────────────────────────────────────────

import { getErrorMessage } from "../utils/errors";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useParams } from "react-router";
import type { BlogPost } from "../types";

/**
 * Fournit les données pour la page de détail d'un article (BlogDetailPage).
 *
 * • post    — article chargé depuis l'API (null si introuvable ou en chargement)
 * • loading — true pendant le chargement initial
 * • comment — contenu du champ de commentaire (fonctionnalité à venir)
 */
export function useBlogDetail() {
  // 1. PARAMS : récupération de l'id de l'article depuis l'URL (/blog/:id)
  const { id } = useParams<{ id: string }>();

  // 2. STATE — Données de l'article
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 2.1 STATE — Champ de commentaire (soumission non encore implémentée)
  const [comment, setComment] = useState("");

  // 3. EFFECT : chargement de l'article quand l'id change
  useEffect(() => {
    if (!id) return;
    apiFetch(`/blog/${id}`)
      .then((res) => setPost(res.data ?? null))
      .catch((err) => setError(getErrorMessage(err, "Impossible de charger l'article.")))
      .finally(() => setLoading(false));
  }, [id]);

  return { post, loading, comment, setComment, error };
}