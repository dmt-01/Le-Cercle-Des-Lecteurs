// ─────────────────────────────────────────────────────────────────────────────
// hooks/useBlog.ts
// Hook de la page blog.
// Charge tous les articles et gère le filtrage par catégorie côté client.
// Le premier article (sans filtre actif) est mis en avant en "hero".
// ─────────────────────────────────────────────────────────────────────────────

import { getErrorMessage } from "../utils/errors";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import type { BlogPost } from "../types";

/**
 * Fournit les données et le filtrage pour la page blog (BlogPage).
 *
 * • categories     — liste dédupliquée des catégories présentes dans les articles
 * • featured       — premier article (null quand un filtre de catégorie est actif)
 * • rest           — articles à afficher en grille (tous sauf le featured)
 * • activeCategory — catégorie sélectionnée dans les filtres (null = toutes)
 * • load           — recharge manuellement les articles (utilisé par le bouton "Réessayer")
 */
export function useBlog() {
  // 1. STATE — Liste brute d'articles
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 1.1 STATE — Catégorie active pour le filtrage côté client
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  /**
   * Charge ou recharge tous les articles depuis l'API.
   * Exposé pour permettre un bouton "Réessayer" en cas d'erreur.
   */
  function load() {
    setLoading(true);
    setError(null);
    apiFetch("/blog")
      .then((res) => setPosts(res.data ?? []))
      .catch((err) =>
        setError(getErrorMessage(err, "Impossible de charger les articles.")),
      )
      .finally(() => setLoading(false));
  }

  // 2. EFFECT : chargement initial au montage
  useEffect(() => {
    load();
  }, []);

  // 3. CALCUL : dérivation des données d'affichage à partir de la liste brute
  // Déduplique les catégories en filtrant les valeurs null/undefined
  const categories = Array.from(
    new Set(posts.map((post) => post.category).filter(Boolean)),
  ) as string[];

  // Articles correspondant au filtre actif (ou tous si aucun filtre)
  const filtered = activeCategory
    ? posts.filter((post) => post.category === activeCategory)
    : posts;

  // Le "hero" n'est affiché que sur la vue "Tous" (sans filtre de catégorie)
  const featured = activeCategory ? null : (posts[0] ?? null);

  // "rest" exclut le featured quand il est affiché
  const rest = activeCategory ? filtered : filtered.slice(1);

  return {
    loading,
    error,
    activeCategory,
    setActiveCategory,
    categories,
    featured,
    rest,
    load,
  };
}