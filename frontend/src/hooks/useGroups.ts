import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../services/api";
import type { Group } from "../types";

export function useGroups() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState<Set<string>>(new Set());
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);

  function load() {
    setLoading(true);
    setError(null);
    apiFetch("/groups")
      .then((res) => setGroups(res.data ?? []))
      .catch((err) =>
        setError(err?.message ?? "Impossible de charger les cercles."),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleJoin(groupId: string) {
    if (!user) {
      navigate("/login", { state: { from: "/groups" } });
      return;
    }
    setJoining((prev) => new Set(prev).add(groupId));
    try {
      await apiFetch(`/groups/${groupId}/join`, { method: "POST" });
      setJoined((prev) => new Set(prev).add(groupId));
      setGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? { ...group, member_count: group.member_count + 1 }
            : group,
        ),
      );
    } catch (err: any) {
      if (err?.status === 409) {
        setJoined((prev) => new Set(prev).add(groupId));
      }
    }
    setJoining((prev) => {
      const next = new Set(prev);
      next.delete(groupId);
      return next;
    });
  }

  function handleCreateClick() {
    if (!user) {
      navigate("/login", { state: { from: "/groups" } });
    } else {
      setShowModal(true);
    }
  }

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
