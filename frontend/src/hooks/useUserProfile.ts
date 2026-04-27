import type { PublicProfile, WishlistItem } from "../types";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useParams } from "react-router";

export function useUserProfile() {
  const { id: paramId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const id = paramId ?? user?.id;
  const isOwnProfile = !!user && user.id === id;

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [library, setLibrary] = useState<WishlistItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  function load() {
    if (!id) return;
    setLoading(true);
    setError(null);
    const calls: Promise<any>[] = [apiFetch(`/users/${id}`)];
    if (isOwnProfile) calls.push(apiFetch("/wishlist"));

    Promise.all(calls)
      .then(([profileRes, wishlistRes]) => {
        setProfile(profileRes.data ?? null);
        if (wishlistRes) {
          const items: WishlistItem[] = wishlistRes.data ?? [];
          setLibrary(
            items.filter(
              (item) => item.status === "En cours" || item.status === "Lu",
            ),
          );
          setWishlist(items.filter((item) => item.status === "À lire"));
        }
      })
      .catch((err) =>
        setError(err?.message ?? "Impossible de charger le profil."),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [id, isOwnProfile]);

  async function handleFollow() {
    if (!user || !id) return;
    setFollowLoading(true);
    try {
      if (following) {
        await apiFetch(`/users/${id}/follow`, { method: "DELETE" });
        setFollowing(false);
      } else {
        await apiFetch(`/users/${id}/follow`, { method: "POST" });
        setFollowing(true);
      }
    } catch {}
    setFollowLoading(false);
  }

  return {
    profile,
    setProfile,
    library,
    wishlist,
    loading,
    error,
    id,
    isOwnProfile,
    following,
    followLoading,
    handleFollow,
    load,
  };
}
