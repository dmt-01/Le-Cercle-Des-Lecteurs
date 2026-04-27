import { useParams, Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../services/api";

type Member = {
  user: { id: string; username: string; profileImage?: string };
  role: string;
};

type Message = {
  content: string;
  created_at: string;
  user: { id: string; username: string; profileImage?: string };
};

type GroupDetail = {
  id: string;
  name: string;
  description?: string;
  access_club: boolean;
  created_at: string;
  member_count: number;
  members: Member[];
  messages: Message[];
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} jour${days > 1 ? "s" : ""}`;
}

function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const discussionRef = useRef<HTMLDivElement>(null);

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

  const isMember = !!user && (group?.members.some((m) => m.user.id === user.id) ?? false);

  async function handleJoin() {
    if (!user) { navigate("/login"); return; }
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

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !id || !user) return;
    setSending(true);
    try {
      const res = await apiFetch(`/groups/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      const msg: Message = res.data;
      setGroup((prev) => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
      setNewMessage("");
    } catch {}
    setSending(false);
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center text-primary/40">Chargement...</div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-primary/50 mb-4">Cercle introuvable.</p>
        <Link to="/groups" className="text-secondary hover:underline text-sm">← Retour aux cercles</Link>
      </div>
    );
  }

  const displayedAvatars = group.members.slice(0, 7);
  const extraMembers = group.member_count - displayedAvatars.length;

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <div className="bg-beige rounded-2xl p-10 flex items-center gap-10 overflow-hidden">
          <div className="flex flex-col gap-5 flex-1">
            <span className="inline-block bg-primary text-white text-[9px] uppercase tracking-widest px-3 py-1 rounded-full w-fit">
              {group.access_club ? "Public" : "Privé"}
            </span>
            <h1 className="text-5xl font-serif italic text-primary leading-tight">{group.name}</h1>
            {group.description && (
              <p className="text-primary/60 text-sm leading-relaxed max-w-md">{group.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              {isMember ? (
                <button
                  onClick={handleLeave}
                  disabled={actionLoading}
                  className="bg-white border border-beige-medium text-primary text-sm font-semibold px-5 py-2.5 rounded-full hover:border-secondary hover:text-secondary transition-colors disabled:opacity-50"
                >
                  Quitter le cercle
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={actionLoading}
                  className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/80 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? "..." : "Rejoindre le club"}
                </button>
              )}
              <button
                onClick={() => discussionRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="bg-white border border-beige-medium text-primary text-sm font-semibold px-5 py-2.5 rounded-full hover:border-secondary hover:text-secondary transition-colors"
              >
                En savoir plus
              </button>
            </div>
          </div>

          <div className="hidden md:block shrink-0">
            <div className="w-44 h-60 rounded-xl bg-gradient-to-br from-[#1a3a2a] to-[#2c6a4a] shadow-xl" />
          </div>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">

        {/* ── Fil de discussion ── */}
        <div ref={discussionRef}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif italic text-primary">Fil de discussion</h2>
            <span className="text-xs text-primary/40">
              {group.messages.length} message{group.messages.length !== 1 ? "s" : ""}
            </span>
          </div>

          {group.messages.length === 0 ? (
            <div className="bg-white rounded-2xl border border-beige-medium p-8 text-center mb-4">
              <p className="text-primary/30 text-sm italic">
                Aucun message pour l'instant. Soyez le premier à partager !
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mb-4">
              {group.messages.map((msg, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xs font-bold uppercase shrink-0">
                    {msg.user.username[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-primary">{msg.user.username}</span>
                      <span className="text-xs text-primary/30">{timeAgo(msg.created_at)}</span>
                    </div>
                    <div className="bg-white rounded-xl border border-beige-medium p-4">
                      <p className="text-sm text-primary/70 leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Zone de saisie */}
          {isMember ? (
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3 bg-white border border-beige-medium rounded-xl px-4 py-3"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Partagez vos réflexions..."
                className="flex-1 text-sm text-primary placeholder:text-primary/30 outline-none bg-transparent"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white text-lg hover:bg-secondary-hover transition-colors disabled:opacity-40 shrink-0"
              >
                ›
              </button>
            </form>
          ) : (
            <div className="bg-white border border-beige-medium rounded-xl p-4 text-center">
              <p className="text-primary/40 text-sm italic">
                {user ? (
                  "Rejoignez ce cercle pour participer aux discussions."
                ) : (
                  <>
                    <Link to="/login" className="text-secondary hover:underline">Connectez-vous</Link>{" "}
                    pour rejoindre ce cercle.
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-6">

          {/* Prochaine réunion */}
          <div className="bg-white rounded-2xl border border-beige-medium p-5">
            <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-4">Prochaine réunion</p>
            <p className="text-primary/30 text-sm italic text-center py-2">Aucune réunion planifiée.</p>
          </div>

          {/* Membres */}
          <div className="bg-white rounded-2xl border border-beige-medium p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-widest text-primary/40">Membres</p>
              <span className="text-xs text-primary/40 font-medium">
                {group.member_count} lecteur{group.member_count !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {displayedAvatars.map((m, i) => (
                <Link key={i} to={`/users/${m.user.id}`} title={m.user.username}>
                  <div className="w-full aspect-square rounded-lg bg-secondary/20 flex items-center justify-center text-secondary text-sm font-bold uppercase hover:bg-secondary/30 transition-colors">
                    {m.user.username[0]}
                  </div>
                </Link>
              ))}
              {extraMembers > 0 && (
                <div className="w-full aspect-square rounded-lg bg-beige-medium flex items-center justify-center text-primary/50 text-xs font-medium">
                  +{extraMembers}
                </div>
              )}
            </div>
            <button className="w-full text-center text-[10px] uppercase tracking-widest border border-beige-medium text-primary/50 hover:border-secondary hover:text-secondary px-4 py-2.5 rounded-lg transition-colors">
              Voir tout le répertoire
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default GroupDetailPage;
