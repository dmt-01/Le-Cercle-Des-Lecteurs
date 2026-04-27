import ErrorMessage from "../../components/ui/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Group } from "../../types";

const CARD_GRADIENTS = [
  "from-[#2c1a0e] to-[#6b3a1a]",
  "from-[#1a1f2c] to-[#2c3a5c]",
  "from-[#0e2c1a] to-[#175c33]",
  "from-[#2c1a1a] to-[#5c2a2a]",
  "from-[#1a2c2c] to-[#1a4a4a]",
  "from-[#2a2416] to-[#4a3e20]",
];

function GroupCard({
  group,
  index,
  onJoin,
  onNavigate,
  joining,
  joined,
}: {
  group: Group;
  index: number;
  onJoin: (id: string) => void;
  onNavigate: (id: string) => void;
  joining: boolean;
  joined: boolean;
}) {
  return (
    <div
      onClick={() => onNavigate(group.id)}
      className="bg-white rounded-2xl overflow-hidden border border-beige-medium flex flex-col cursor-pointer hover:border-secondary/30 hover:shadow-sm transition-all"
    >
      <div
        className={`relative h-48 bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]} flex items-center justify-center`}
      >
        <span className="text-white/10 font-serif text-[120px] leading-none select-none">"</span>
        <div className="absolute top-3 left-3 bg-secondary text-white text-[9px] uppercase tracking-widest px-2.5 py-1 rounded">
          En lecture
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-xl font-serif italic text-primary leading-snug">{group.name}</h3>

        {group.description && (
          <p className="text-sm text-primary/60 leading-relaxed flex-1">{group.description}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-primary/40">
            <strong className="text-primary/60 font-semibold">{group.member_count}</strong>{" "}
            membre{group.member_count !== 1 ? "s" : ""}
          </span>

          <button
            onClick={(e) => { e.stopPropagation(); onJoin(group.id); }}
            disabled={joining || joined}
            className={`border text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors ${
              joined
                ? "border-gold/40 text-gold bg-gold/5 cursor-default"
                : "border-beige-medium text-primary hover:border-secondary hover:text-secondary disabled:opacity-50"
            }`}
          >
            {joined ? "Rejoint ✓" : joining ? "..." : "Rejoindre"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateGroupModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (group: Group) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await apiFetch("/groups", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined, accessClub: true }),
      });
      onCreated(res.data);
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue");
    }
    setCreating(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-serif italic text-primary mb-6">Créer un cercle</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-primary/50 mb-1.5">
              Nom du cercle <span className="text-secondary">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Les Amateurs de Proust"
              required
              maxLength={100}
              className="w-full bg-beige border border-beige-medium rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-primary/50 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'esprit de votre cercle..."
              rows={3}
              maxLength={500}
              className="w-full bg-beige border border-beige-medium rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30 resize-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-beige-medium text-primary text-sm font-semibold py-3 rounded-xl hover:border-secondary/40 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="flex-1 bg-secondary text-white text-sm font-semibold py-3 rounded-xl hover:bg-secondary-hover transition-colors disabled:opacity-50"
            >
              {creating ? "Création..." : "Créer le cercle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GroupsPage() {
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
      .catch((err) => setError(err?.message ?? "Impossible de charger les cercles."))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

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
        prev.map((g) =>
          g.id === groupId ? { ...g, member_count: g.member_count + 1 } : g
        )
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

  return (
    <div className="min-h-screen">

      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreated={handleGroupCreated}
        />
      )}

      {/* ── En-tête ── */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-secondary font-medium mb-2">La Communauté</p>
            <h1 className="text-5xl font-serif italic text-primary mb-4 leading-tight">Cercles de Lecture</h1>
            <p className="text-primary/60 text-sm leading-relaxed max-w-lg">
              Rejoignez une assemblée d'esprits curieux. Découvrez des discussions thématiques,
              des analyses profondes et le plaisir partagé d'une œuvre littéraire.
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-primary/80 transition-colors shrink-0 mt-2 whitespace-nowrap"
          >
            <span className="text-base leading-none">⊕</span> Créer un groupe
          </button>
        </div>
      </div>

      {/* ── Grille ── */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        {loading && (
          <p className="text-primary/40 text-sm text-center py-12">Chargement...</p>
        )}

        {error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && groups.length === 0 && (
          <p className="text-primary/40 text-sm italic text-center py-12">
            Aucun cercle disponible pour le moment.
          </p>
        )}

        {!loading && !error && groups.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {groups.map((group, i) => (
              <GroupCard
                key={group.id}
                group={group}
                index={i}
                onJoin={handleJoin}
                onNavigate={(id) => navigate(`/groups/${id}`)}
                joining={joining.has(group.id)}
                joined={joined.has(group.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Curateur du mois ── */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-beige rounded-2xl p-10 flex items-center justify-between gap-8 overflow-hidden">
          <div className="flex flex-col gap-5 max-w-lg">
            <h2 className="text-4xl font-serif italic text-primary">Curateur du mois</h2>
            <p className="text-primary/70 text-base italic leading-relaxed">
              "La lecture n'est pas un acte passif, c'est une conversation entre deux âmes à travers le temps."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-base font-bold uppercase shrink-0">
                E
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">Elena Marquès</p>
                <p className="text-xs text-secondary italic">Fondatrice de 'L'Arpenteur'</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-end gap-3 shrink-0 pb-2">
            <div className="w-24 h-36 rounded-lg bg-gradient-to-br from-[#1a5c3a] to-[#2c8c5c] shadow-lg -rotate-6" />
            <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-[#c97a3a] to-[#e8a87c] shadow-lg rotate-3" />
          </div>
        </div>
      </div>

    </div>
  );
}

export default GroupsPage;
