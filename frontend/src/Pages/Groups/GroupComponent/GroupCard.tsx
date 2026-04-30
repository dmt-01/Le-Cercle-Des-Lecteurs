import type { Group } from "../../../types";

/**
 * Carte d'un cercle de lecture dans la grille.
 * Le clic sur la carte navigue vers le détail ; le bouton "Rejoindre" déclenche l'adhésion.
 */
function GroupCard({
  group,
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
        className="relative h-48 flex items-center justify-center"
        style={{
          background: "url(/img/template_group.png) center/cover no-repeat",
        }}
      >
        <span className="text-white/10 font-serif text-[120px] leading-none select-none">
          "
        </span>
        <div className="absolute top-3 left-3 bg-secondary text-white text-[9px] uppercase tracking-widest px-2.5 py-1 rounded">
          En lecture
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-xl font-serif italic text-primary leading-snug">
          {group.name}
        </h3>

        {group.description && (
          <p className="text-sm text-primary/60 leading-relaxed flex-1">
            {group.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-primary/40">
            <strong className="text-primary/60 font-semibold">
              {group.member_count}
            </strong>{" "}
            membre{group.member_count !== 1 ? "s" : ""}
          </span>

          <button
            onClick={(event) => {
              event.stopPropagation();
              onJoin(group.id);
            }}
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

export default GroupCard;