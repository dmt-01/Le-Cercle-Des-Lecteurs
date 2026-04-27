import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useParams } from "react-router";
import type { BlogPost } from "../types";

export function useBlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!id) return;
    apiFetch(`/blog/${id}`)
      .then((res) => setPost(res.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return { post, loading, comment, setComment };
}
