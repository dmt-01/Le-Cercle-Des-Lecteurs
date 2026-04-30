// ─────────────────────────────────────────────────────────────────────────────
// Pages/Groups/GroupsPage.tsx
// Page liste des cercles de lecture.
// Sous-composants : GroupCard (carte de groupe), CreateGroupModal (modal de création).
// Toute la logique d'adhésion et de navigation est dans useGroups().
// ─────────────────────────────────────────────────────────────────────────────

import CreateGroupModal from "./GroupComponent/ModalCreategroup";
import ErrorMessage from "../../components/ui/ErrorMessage";
import GroupCard from "./GroupComponent/GroupCard";
import { useGroups } from "../../hooks/useGroups";
import { useNavigate } from "react-router";

function GroupsPage() {
  const navigate = useNavigate();
  const {
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
  } = useGroups();

  return (
    <div>
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
            <p className="text-[10px] uppercase tracking-widest text-secondary font-medium mb-2">
              La Communauté
            </p>
            <h1 className="text-5xl font-serif italic text-primary mb-4 leading-tight">
              Cercles de Lecture
            </h1>
            <p className="text-primary/60 text-sm leading-relaxed max-w-lg">
              Rejoignez une assemblée d'esprits curieux. Découvrez des
              discussions thématiques, des analyses profondes et le plaisir
              partagé d'une œuvre littéraire.
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 bg-secondary text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-secondary-hover transition-colors shrink-0 mt-2 whitespace-nowrap"
            aria-label="Créer un nouveau cercle de lecture"
          >
            <span className="text-base leading-none">⊕</span> Créer un groupe
          </button>
        </div>
      </div>

      {/* ── Grille ── */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        {loading && (
          <p className="text-primary/40 text-sm text-center py-12">
            Chargement...
          </p>
        )}

        {error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && groups.length === 0 && (
          <p className="text-primary/40 text-sm italic text-center py-12">
            Aucun cercle disponible pour le moment.
          </p>
        )}

        {!loading && !error && groups.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {groups.map((group, index) => (
              <GroupCard
                key={group.id}
                group={group}
                index={index}
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
            <h2 className="text-4xl font-serif italic text-primary">
              Curateur du mois
            </h2>
            <p className="text-primary/70 text-base italic leading-relaxed">
              "La lecture n'est pas un acte passif, c'est une conversation entre
              deux âmes à travers le temps."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-base font-bold uppercase shrink-0" 
                   aria-label="Avatar de Elena Marquès">
                E
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">
                  Elena Marquès
                </p>
                <p className="text-xs text-secondary italic">
                  Fondatrice de 'L'Arpenteur'
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-end gap-3 shrink-0 pb-2">
            <div
              className="w-24 h-36 rounded-lg bg-gradient-to-br from-[#1a5c3a] to-[#2c8c5c] shadow-lg -rotate-6"
              style={{
                background:
                  "url(/img/template_book.png) center/cover no-repeat",
              }}
            />
            <div
              className="w-20 h-28 rounded-lg bg-gradient-to-br from-[#c97a3a] to-[#e8a87c] shadow-lg rotate-3"
              style={{
                background:
                  "url(/img/template_book.png) center/cover no-repeat",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupsPage;
