import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../services/api";
import ErrorMessage from "../../components/ui/ErrorMessage";

type Conversation = {
  partner: { id: string; username: string; profileImage?: string };
  last_message: { content: string; sent_at: string; read: boolean; is_mine: boolean };
};

type ChatMessage = {
  id: string;
  content: string;
  sent_at: string;
  read: boolean;
  is_mine: boolean;
  sender: { id: string; username: string };
};

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function timeLabel(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function dayLabel(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Aujourd'hui";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function convTime(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) {
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
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

function MessagesPage() {
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
      .catch((err) => setError(err?.message ?? "Impossible de charger les messages."))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

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
        prev.map((c) =>
          c.partner.id === selected.partner.id
            ? { ...c, last_message: { content, sent_at: res.data.sent_at, read: false, is_mine: true } }
            : c
        )
      );
    } catch {}
    setSending(false);
  }

  const filtered = conversations.filter((c) =>
    c.partner.username.toLowerCase().includes(filter.toLowerCase())
  );

  const grouped = groupByDay(messages);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8" style={{ height: "calc(100vh - 120px)" }}>
      <div className="h-full flex gap-5">

        {/* ── Sidebar — liste des conversations ── */}
        <div className={`w-full md:w-72 shrink-0 flex-col bg-white rounded-2xl border border-beige-medium overflow-hidden ${selected ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-beige-medium">
            <h1 className="text-xl font-serif italic text-primary mb-3">Messages</h1>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Filtrer les discussions"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-beige border border-beige-medium rounded-xl pl-8 pr-3 py-2 text-xs text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && (
              <p className="text-primary/40 text-xs text-center py-6">Chargement...</p>
            )}
            {error && <ErrorMessage message={error} onRetry={load} />}
            {!loading && !error && filtered.length === 0 && (
              <p className="text-primary/40 text-xs italic text-center py-6">Aucune conversation.</p>
            )}
            {filtered.map((conv) => {
              const isActive = selected?.partner.id === conv.partner.id;
              return (
                <button
                  key={conv.partner.id}
                  onClick={() => setSelected(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-beige transition-colors ${
                    isActive ? "bg-beige border-r-2 border-secondary" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xs font-bold shrink-0">
                    {initials(conv.partner.username)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="text-sm font-semibold text-primary truncate">{conv.partner.username}</p>
                      <p className="text-[10px] text-primary/30 shrink-0 ml-2">{convTime(conv.last_message.sent_at)}</p>
                    </div>
                    <p className="text-xs text-primary/40 truncate">
                      {conv.last_message.is_mine && "Vous : "}{conv.last_message.content}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Zone de chat ── */}
        {selected ? (
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-beige-medium overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-beige-medium">
              <button
                onClick={() => setSelected(null)}
                className="md:hidden text-primary/40 hover:text-secondary transition-colors mr-1 text-lg leading-none"
              >
                ←
              </button>
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-sm font-bold shrink-0">
                {initials(selected.partner.username)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">{selected.partner.username}</p>
                <p className="text-[9px] uppercase tracking-widest text-secondary">Membre</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col">
              {grouped.length === 0 && (
                <p className="text-primary/30 text-xs italic text-center m-auto">
                  Démarrez la conversation.
                </p>
              )}

              {grouped.map(({ date, msgs }) => (
                <div key={date}>
                  {/* Séparateur de date */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-beige-medium" />
                    <span className="text-[9px] uppercase tracking-widest text-primary/30">{date}</span>
                    <div className="flex-1 h-px bg-beige-medium" />
                  </div>

                  <div className="flex flex-col gap-3">
                    {msgs.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${msg.is_mine ? "flex-row-reverse" : ""}`}
                      >
                        {!msg.is_mine && (
                          <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-[10px] font-bold shrink-0">
                            {initials(selected.partner.username)}
                          </div>
                        )}
                        <div className={`flex flex-col gap-1 max-w-[65%] ${msg.is_mine ? "items-end" : ""}`}>
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              msg.is_mine
                                ? "bg-primary text-white rounded-br-sm"
                                : "bg-beige text-primary rounded-bl-sm"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <p className="text-[10px] text-primary/30">{timeLabel(msg.sent_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-beige-medium flex items-center gap-3">
              <button className="text-primary/30 hover:text-secondary transition-colors text-lg leading-none">
                ⊕
              </button>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Écrire votre message..."
                className="flex-1 bg-beige border border-beige-medium rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
              <button
                onClick={handleSend}
                disabled={!text.trim() || sending}
                className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-xs hover:bg-primary/80 transition-colors disabled:opacity-40 shrink-0"
              >
                ▶
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border border-beige-medium">
            {!loading && (
              <p className="text-primary/30 text-sm italic">Sélectionnez une conversation</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
