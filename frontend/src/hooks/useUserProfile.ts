// ─────────────────────────────────────────────────────────────────────────────
// hooks/useUserProfile.ts
// Hook de la page de profil utilisateur.
//
// Fonctionne en deux modes :
//   • Profil propre  (/profile ou /users/mon-id) — charge aussi la wishlist
//   • Profil public  (/users/:id)                — charge uniquement le profil
//
// La wishlist est séparée en deux listes : bibliothèque (lus/en cours) et
// wishlist (à lire), pour les deux sections distinctes de la page.
// ─────────────────────────────────────────────────────────────────────────────

import type { PublicProfile, WishlistItem } from "../types";
import { getErrorMessage } from "../utils/errors";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useParams } from "react-router";

/**
 * Fournit les données et handlers pour la page de profil (UserProfilePage).
 *
 * • profile / setProfile — données du profil public (setProfile exposé pour la modal d'édition)
 * • library    — entrées wishlist avec status "En cours" ou "Lu" (bibliothèque)
 * • wishlist   — entrées wishlist avec status "À lire"
 * • isOwnProfile — true si l'utilisateur consulte son propre profil
 * • following / followLoading — état du suivi d'un autre utilisateur
 * • handleFollow — bascule le suivi (POST / DELETE)
 * • load         — recharge le profil (bouton "Réessayer" en cas d'erreur)
 */
export function useUserProfile() {
  // 1. PARAMS : id depuis l'URL, ou id de l'utilisateur connecté si absent (/profile)
  const { id: paramId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const id = paramId ?? user?.id;
  // 1.1 Détermine si on consulte son propre profil (pour afficher la wishlist)
  const isOwnProfile = !!user && user.id === id;

  // 2. STATE — Données du profil
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  // 2.1 STATE — Bibliothèque (livres lus ou en cours de lecture)
  const [library, setLibrary] = useState<WishlistItem[]>([]);
  // 2.2 STATE — Wishlist (livres "À lire")
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. STATE — Suivi d'un autre utilisateur
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  /**
   * Charge le profil et, si c'est le profil propre, la wishlist en parallèle.
   * La wishlist n'est chargée que pour soi-même (données privées).
   */
  function load() {
    if (!id) return;
    setLoading(true);
    setError(null);

    // 4.1 PROFIL PUBLIC : toujours chargé
    const calls: Promise<any>[] = [apiFetch(`/users/${id}`)];
    // 4.2 WISHLIST : uniquement pour son propre profil
    if (isOwnProfile) calls.push(apiFetch("/wishlist"));

    Promise.all(calls)
      .then(([profileRes, wishlistRes]) => {
        const fetchedProfile: PublicProfile | null = profileRes.data ?? null;
        setProfile(fetchedProfile);
        // 4.4 Initialise l'état "suivre" depuis la réponse backend (is_following)
        setFollowing(fetchedProfile?.is_following ?? false);
        if (wishlistRes) {
          const items: WishlistItem[] = wishlistRes.data ?? [];
          // 4.3 Séparation en deux sections distinctes selon le statut
          setLibrary(
            items.filter(
              (item) => item.status === "En cours" || item.status === "Lu",
            ),
          );
          setWishlist(items.filter((item) => item.status === "À lire"));
        }
      })
      .catch((err) =>
        setError(getErrorMessage(err, "Impossible de charger le profil") || "Erreur inconnue"),
      )
      .finally(() => setLoading(false));
  }

  // 5. EFFECT : rechargement quand l'id change (navigation entre profils)
  // isOwnProfile est inclus car il peut changer si l'utilisateur se connecte
  useEffect(() => {
    load();
  }, [id, isOwnProfile]);

  /**
   * Bascule le suivi d'un utilisateur (POST pour suivre, DELETE pour ne plus suivre).
   * Met à jour l'état local immédiatement pour un retour visuel instantané.
   */
  async function handleFollow() {
    if (!user || !id) return;
    setFollowLoading(true);
    try {
      if (following) {
        // 6.1 Ne plus suivre
        await apiFetch(`/users/${id}/follow`, { method: "DELETE" });
        setFollowing(false);
      } else {
        // 6.2 Suivre
        await apiFetch(`/users/${id}/follow`, { method: "POST" });
        setFollowing(true);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Impossible de suivre l'utilisateur") || "Erreur inconnue");
    }
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