// ─────────────────────────────────────────────────────────────────────────────
// hooks/useGroupDetail.ts
// Hook de la page de détail d'un cercle de lecture.
// Charge le groupe avec ses membres et son fil de discussion.
// Gère l'adhésion, le départ et l'envoi de messages.
// ─────────────────────────────────────────────────────────────────────────────

import { useParams, useNavigate } from "react-router";
import { getErrorMessage } from "../utils/errors";
import { useAuth } from "../context/AuthContext";
import type { GroupMessage } from "../types";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

/** Membre d'un groupe avec son rôle (admin, member…) */
type Member = {
  user: { id: string; username: string; profileImage?: string };
  role: string;
};

/**
 * Structure complète d'un groupe renvoyée par GET /groups/:id.
 * Inclut les membres et les messages du fil de discussion.
 */
export type GroupDetail = {
  id: string;
  name: string;
  description?: string;
  /** true = public, false = privé sur invitation */
  access_club: boolean;
  created_at: string;
  member_count: number;
  members: Member[];
  messages: GroupMessage[];
};

/**
 * Fournit les données et handlers pour la page de détail d'un groupe (GroupDetailPage).
 *
 * • isMember        — true si l'utilisateur connecté fait partie du groupe
 * • displayedAvatars — 7 premiers membres pour l'affichage des avatars
 * • extraMembers    — nombre de membres non affichés (member_count - 7)
 * • handleJoin      — rejoint le groupe (redirige vers /login si non connecté)
 * • handleLeave     — quitte le groupe
 * • handleSendMessage — envoie un message dans le fil de discussion
 */
export function useGroupDetail() {
  // 1. PARAMS : id du groupe depuis l'URL (/groups/:id)
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 2. STATE — Données du groupe
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // 3. STATE — Champ de message et état d'envoi
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 4. EFFECT : chargement du groupe quand l'id change
  useEffect(() => {
    if (!id) return;
    apiFetch(`/groups/${id}`)
      .then((res) => setGroup(res.data ?? null))
      .catch((err) => setError(getErrorMessage(err, "Impossible de charger les données du groupe")))
      .finally(() => setLoading(false));
  }, [id]);

  // 5. CALCUL : données dérivées pour l'affichage des membres
  const isMember =
    !!user &&
    (group?.members.some((member) => member.user.id === user.id) ?? false);
  const displayedAvatars = group?.members.slice(0, 7) ?? [];
  const extraMembers = (group?.member_count ?? 0) - displayedAvatars.length;

  /**
   * Rejoint le groupe courant.
   * Après l'adhésion, recharge le groupe complet pour avoir la liste des membres à jour.
   */
  async function handleJoin() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!id) return;
    setActionLoading(true);
    try {
      await apiFetch(`/groups/${id}/join`, { method: "POST" });
      // 6.1 Rechargement complet pour mettre à jour membres et compteur
      const res = await apiFetch(`/groups/${id}`);
      setGroup(res.data ?? null);
    } catch (err) {
      setError(getErrorMessage(err, "Impossible de rejoindre le groupe"));
    }
    setActionLoading(false);
  }

  /**
   * Quitte le groupe courant.
   * Recharge le groupe après le départ pour refléter le nouveau compteur.
   */
  async function handleLeave() {
    if (!user || !id) return;
    setActionLoading(true);
    try {
      await apiFetch(`/groups/${id}/leave`, { method: "DELETE" });
      // 7.1 Rechargement pour mettre à jour la liste des membres
      const res = await apiFetch(`/groups/${id}`);
      setGroup(res.data ?? null);
    } catch (err) {
      setError(getErrorMessage(err, "Impossible de quitter le groupe"));
    }
    setActionLoading(false);
  }

  /**
   * Envoie un message dans le fil de discussion du groupe.
   * Ajoute le message en local immédiatement pour un affichage instantané.
   */
  async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newMessage.trim() || !id || !user) return;
    setSending(true);
    try {
      const res = await apiFetch(`/groups/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      const msg: GroupMessage = res.data;
      // 8.1 Ajout optimiste du message à la fin du fil sans rechargement
      setGroup((prev) =>
        prev ? { ...prev, messages: [...prev.messages, msg] } : prev,
      );
      setNewMessage("");
    } catch (err) {
      setError(getErrorMessage(err, "Impossible d'envoyer le message"));
    }
    setSending(false);
  }

  return {
    group,
    loading,
    actionLoading,
    newMessage,
    setNewMessage,
    sending,
    isMember,
    displayedAvatars,
    extraMembers,
    handleJoin,
    handleLeave,
    handleSendMessage,
    error
  };
}