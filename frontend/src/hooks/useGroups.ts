// ─────────────────────────────────────────────────────────────────────────────
// hooks/useGroups.ts
// Hook de la page liste des cercles de lecture.
// Gère le chargement des groupes, l'adhésion à un groupe existant,
// et l'ouverture de la modal de création d'un nouveau groupe.
// ─────────────────────────────────────────────────────────────────────────────

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../services/api";
import type { Group } from "../types";
import { getErrorMessage } from "../utils/errors";

/**
 * Fournit les données et handlers pour la page des cercles (GroupsPage).
 *
 * • joining — Set des ids de groupes dont l'adhésion est en cours (pour le loading)
 * • joined  — Set des ids de groupes que l'utilisateur a rejoint dans cette session
 * • showModal / setShowModal — contrôle de la modal de création
 * • handleJoin         — rejoint un groupe (redirige vers /login si non connecté)
 * • handleCreateClick  — ouvre la modal ou redirige vers /login
 * • handleGroupCreated — callback après création réussie d'un groupe
 * • load               — recharge la liste (bouton "Réessayer")
 */
export function useGroups() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. STATE — Liste des groupes et état de chargement
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. STATE — Suivi des adhésions en cours et effectuées dans la session
  // On utilise des Set pour des lookups O(1) sur chaque carte de groupe
  const [joining, setJoining] = useState<Set<string>>(new Set());
  const [joined, setJoined] = useState<Set<string>>(new Set());

  // 3. STATE — Visibilité de la modal de création de groupe
  const [showModal, setShowModal] = useState(false);

  /**
   * Charge ou recharge la liste des groupes depuis l'API.
   * Exposé pour le bouton "Réessayer" en cas d'erreur.
   */
  function load() {
    setLoading(true);
    setError(null);
    apiFetch("/groups")
      .then((res) => setGroups(res.data ?? []))
      .catch((err) =>
        setError(getErrorMessage(err, "Impossible de charger les groupes.")),
      )
      .finally(() => setLoading(false));
  }

  // 4. EFFECT : chargement initial au montage
  useEffect(() => {
    load();
  }, []);

  /**
   * Rejoint un groupe.
   * • Si non connecté → redirige vers /login avec le chemin de retour
   * • Gère l'état "joining" pour afficher un indicateur de chargement par carte
   * • En cas de 409 (déjà membre) : marque simplement comme rejoint côté client
   * • Met à jour le compteur de membres localement sans recharger toute la liste
   */
  async function handleJoin(groupId: string) {
    if (!user) {
      navigate("/login", { state: { from: "/groups" } });
      return;
    }
    // 4.1 Ajoute l'id au Set "en cours" pour afficher le loader sur la bonne carte
    setJoining((prev) => new Set(prev).add(groupId));
    try {
      await apiFetch(`/groups/${groupId}/join`, { method: "POST" });
      setJoined((prev) => new Set(prev).add(groupId));
      // 4.2 Mise à jour optimiste du compteur sans rechargement
      setGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? { ...group, member_count: group.member_count + 1 }
            : group,
        ),
      );
    } catch (err: any) {
      // 4.3 409 = déjà membre : on marque comme rejoint sans erreur visible
      if (err?.status === 409) {
        setJoined((prev) => new Set(prev).add(groupId));
      }
    }
    // 4.4 Retire l'id du Set "en cours" quel que soit le résultat
    setJoining((prev) => {
      const next = new Set(prev);
      next.delete(groupId);
      return next;
    });
  }

  /**
   * Gère le clic sur "Créer un groupe".
   * Redirige vers /login si l'utilisateur n'est pas connecté,
   * sinon ouvre la modal de création.
   */
  function handleCreateClick() {
    if (!user) {
      navigate("/login", { state: { from: "/groups" } });
    } else {
      setShowModal(true);
    }
  }

  /**
   * Callback appelé après la création réussie d'un groupe (depuis la modal).
   * Ajoute le groupe en tête de liste, le marque comme rejoint et navigue vers lui.
   */
  function handleGroupCreated(group: Group) {
    setGroups((prev) => [group, ...prev]);
    setJoined((prev) => new Set(prev).add(group.id));
    setShowModal(false);
    navigate(`/groups/${group.id}`);
  }

  return {
    groups,
    loading,
    error,
    joining,
    joined,
    showModal,
    setShowModal,
    handleJoin,
    handleCreateClick,
    handleGroupCreated,
    load,
  };
}