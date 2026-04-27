import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import type { BlogPost } from "../types";

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    apiFetch("/blog")
      .then((res) => setPosts(res.data ?? []))
      .catch((err) =>
        setError(err?.message ?? "Impossible de charger les articles."),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const categories = Array.from(
    new Set(posts.map((post) => post.category).filter(Boolean)),
  ) as string[];
  const filtered = activeCategory
    ? posts.filter((post) => post.category === activeCategory)
    : posts;
  const featured = activeCategory ? null : (posts[0] ?? null);
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
