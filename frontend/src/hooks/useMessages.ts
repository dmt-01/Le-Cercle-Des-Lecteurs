import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../services/api";

export type Conversation = {
  partner: { id: string; username: string; profileImage?: string };
  last_message: {
    content: string;
    sent_at: string;
    read: boolean;
    is_mine: boolean;
  };
};

export type ChatMessage = {
  id: string;
  content: string;
  sent_at: string;
  read: boolean;
  is_mine: boolean;
  sender: { id: string; username: string };
};

function dayLabel(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Hier";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function groupByDay(messages: ChatMessage[]) {
  const groups: { date: string; msgs: ChatMessage[] }[] = [];
  for (const msg of messages) {
    const label = dayLabel(msg.sent_at);
    const last = groups[groups.length - 1];
    if (!last || last.date !== label) {
      groups.push({ date: label, msgs: [msg] });
    } else {
      last.msgs.push(msg);
    }
  }
  return groups;
}

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  function load() {
    setLoading(true);
    setError(null);
    apiFetch("/messages")
      .then((res) => {
        const convs: Conversation[] = res.data ?? [];
        setConversations(convs);
        if (convs.length > 0) setSelected(convs[0]);
      })
      .catch((err) =>
        setError(err?.message ?? "Impossible de charger les messages."),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setMessages([]);
    apiFetch(`/messages/${selected.partner.id}`)
      .then((res) => setMessages(res.data ?? []))
      .catch(() => {});
  }, [selected?.partner.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!text.trim() || !selected || sending) return;
    const content = text.trim();
    setSending(true);
    setText("");
    try {
      const res = await apiFetch(`/messages/${selected.partner.id}`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      const newMsg: ChatMessage = {
        id: res.data.id,
        content: res.data.content,
        sent_at: res.data.sent_at,
        read: false,
        is_mine: true,
        sender: res.data.sender,
      };
      setMessages((prev) => [...prev, newMsg]);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.partner.id === selected.partner.id
            ? {
                ...conv,
                last_message: {
                  content,
                  sent_at: res.data.sent_at,
                  read: false,
                  is_mine: true,
                },
              }
            : conv,
        ),
      );
    } catch {}
    setSending(false);
  }

  const filtered = conversations.filter((conv) =>
    conv.partner.username.toLowerCase().includes(filter.toLowerCase()),
  );

  const grouped = groupByDay(messages);

  return {
    conversations,
    selected,
    setSelected,
    messages,
    text,
    setText,
    loading,
    error,
    sending,
    filter,
    setFilter,
    filtered,
    grouped,
    handleSend,
    load,
    endRef,
  };
}
