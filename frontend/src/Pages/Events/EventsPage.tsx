// ─────────────────────────────────────────────────────────────────────────────
// Pages/Events/EventsPage.tsx
// Page calendrier des événements littéraires.
// Les événements sont groupés par mois via useEvents() et affichés en liste.
// Le filtrage par type (Dédicaces, Ateliers…) n'est pas encore fonctionnel.
// ─────────────────────────────────────────────────────────────────────────────

import ErrorMessage from "../../components/ui/ErrorMessage";
import { useEvents } from "../../hooks/useEvents";
import type { Event } from "../../types";
import { Link } from "react-router";

/** Page liste de tous les événements à venir, groupés par mois. */
function EventsPage() {
  const { loading, error, grouped, load } = useEvents();

  return (
    <div className="min-h-screen">
      {/* ── En-tête ── */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-10 flex items-start justify-between gap-8 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-secondary font-medium mb-2">
            Calendrier Littéraire
          </p>
          <h1 className="text-5xl font-serif italic text-primary leading-tight">
            Rencontres &<br />
            Évasions
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {["Tous les événements", "Dédicaces", "Ateliers", "Conférences"].map(
            (tab, index) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 0
                    ? "bg-secondary text-white"
                    : "bg-white border border-beige-medium text-primary/50 cursor-not-allowed opacity-60"
                }`}
                aria-label={`Filtrer les événements par type: ${tab}`}
                disabled={index !== 0}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>

      {/* ── Liste ── */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        {loading && (
          <p className="text-primary/40 text-sm text-center py-12">
            Chargement...
          </p>
        )}
        {error && <ErrorMessage message={error} onRetry={load} />}
        {!loading && !error && grouped.length === 0 && (
          <p className="text-primary/40 text-sm italic text-center py-12">
            Aucun événement à venir pour le moment.
          </p>
        )}

        {grouped.map(([month, monthEvents]: [string, Event[]]) => (
          <div key={month} className="mb-10">
            <h2 className="text-sm font-semibold text-primary/50 uppercase tracking-widest mb-5">
              {month}
            </h2>
            <div className="flex flex-col gap-3">
              {monthEvents.map((event) => {
                const date = new Date(event.event_date);
                const day = date.getDate().toString().padStart(2, "0");
                const weekday = date.toLocaleDateString("fr-FR", {
                  weekday: "long",
                });
                const time = date.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl border border-beige-medium flex items-center gap-5 p-4 hover:border-secondary/30 transition-colors"
                  >
                    <div className="text-center w-14 shrink-0">
                      <p className="text-3xl font-bold text-primary leading-none">
                        {day}
                      </p>
                      <p className="text-[9px] uppercase tracking-widest text-primary/40 mt-1 capitalize">
                        {weekday}
                      </p>
                    </div>
                    <div
                      className="w-28 h-20 rounded-xl"
                      style={{
                        background:
                          "url(/img/template_event.png) center/cover no-repeat",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="inline-block bg-secondary/10 text-secondary text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-semibold mb-1">
                        {event.group.name}
                      </span>
                      <h3 className="text-base font-serif italic text-primary leading-snug mb-0.5">
                        {event.title}
                      </h3>
                      <p className="text-xs text-primary/40">⏱ {time}</p>
                    </div>
                    <Link
                      to={`/events/${event.id}`}
                      className="bg-secondary text-white text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-secondary-hover transition-colors shrink-0 whitespace-nowrap"
                      aria-label={`S'inscrire à l'événement ${event.title}`} 
                    >
                      S'inscrire
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Grand Colloque ── */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div
          className="rounded-2xl overflow-hidden p-10 flex items-end gap-8 min-h-[260px] relative"
          style={{
            background:
              "linear-gradient(to right, rgb(58, 6, 18), rgba(73, 17, 17, 0.5)), url('/hero-books.jpg') center/cover no-repeat",
          }}
        >
          <div className="flex flex-col gap-4 max-w-lg">
            <h2 className="text-4xl font-serif italic text-white leading-tight">
              Le Grand Colloque Annuel
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Rejoignez-nous pour une semaine d'immersion totale. Des débats
              passionnés, des lectures nocturnes et le dévoilement du Prix du
              Cercle. Un moment suspendu hors du temps.
            </p>
            <p className="text-white/40 text-xs uppercase tracking-widest">
              24–30 Novembre
            </p>
            <button className="bg-white text-primary text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full w-fit hover:bg-beige transition-colors" aria-label="Découvrir le programme">
              Découvrir le programme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsPage;
