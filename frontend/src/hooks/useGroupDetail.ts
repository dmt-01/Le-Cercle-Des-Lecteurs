import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { GroupMessage } from "../types";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

type Member = {
  user: { id: string; username: string; profileImage?: string };
  role: string;
};

export type GroupDetail = {
  id: string;
  name: string;
  description?: string;
  access_club: boolean;
  created_at: string;
  member_count: number;
  members: Member[];
  messages: GroupMessage[];
};

export function useGroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/groups/${id}`)
      .then((res) => setGroup(res.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const isMember =
    !!user &&
    (group?.members.some((member) => member.user.id === user.id) ?? false);
  const displayedAvatars = group?.members.slice(0, 7) ?? [];
  const extraMembers = (group?.member_count ?? 0) - displayedAvatars.length;

  async function handleJoin() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!id) return;
    setActionLoading(true);
    try {
      await apiFetch(`/groups/${id}/join`, { method: "POST" });
      const res = await apiFetch(`/groups/${id}`);
      setGroup(res.data ?? null);
    } catch {}
    setActionLoading(false);
  }

  async function handleLeave() {
    if (!user || !id) return;
    setActionLoading(true);
    try {
      await apiFetch(`/groups/${id}/leave`, { method: "DELETE" });
      const res = await apiFetch(`/groups/${id}`);
      setGroup(res.data ?? null);
    } catch {}
    setActionLoading(false);
  }

  async function handleSendMessage(event: React.FormEvent) {
    event.preventDefault();
    if (!newMessage.trim() || !id || !user) return;
    setSending(true);
    try {
      const res = await apiFetch(`/groups/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      const msg: GroupMessage = res.data;
      setGroup((prev) =>
        prev ? { ...prev, messages: [...prev.messages, msg] } : prev,
      );
      setNewMessage("");
    } catch {}
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
  };
}
