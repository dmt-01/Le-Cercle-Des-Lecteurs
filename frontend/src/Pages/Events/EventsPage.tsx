import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiFetch } from "../../services/api";
import type { Event } from "../../types";
import ErrorMessage from "../../components/ui/ErrorMessage";

const EVENT_GRADIENTS = [
  "from-[#2c1a0e] to-[#6b2737]",
  "from-[#1a2c1a] to-[#2c5c3a]",
  "from-[#1a1f2c] to-[#2c3a5c]",
  "from-[#2c2a1a] to-[#5c4a17]",
  "from-[#1a2c2c] to-[#1a4a4a]",
  "from-[#2c1a2c] to-[#4a1a5c]",
];

function groupByMonth(events: Event[]): [string, Event[]][] {
  const map = new Map<string, Event[]>();
  for (const e of events) {
    const key = new Date(e.event_date).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(e);
  }
  return [...map.entries()];
}

function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    apiFetch("/events")
      .then((res) => setEvents(res.data ?? []))
      .catch((err) => setError(err?.message ?? "Impossible de charger les événements."))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const grouped = groupByMonth(events);

  return (
    <div className="min-h-screen">

      {/* ── En-tête ── */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-10 flex items-start justify-between gap-8 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-secondary font-medium mb-2">Calendrier Littéraire</p>
          <h1 className="text-5xl font-serif italic text-primary leading-tight">
            Rencontres &<br />Évasions
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {["Tous les événements", "Dédicaces", "Ateliers", "Conférences"].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-primary text-white"
                  : "bg-white border border-beige-medium text-primary/50 cursor-not-allowed opacity-60"
              }`}
              disabled={i !== 0}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Liste ── */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        {loading && (
          <p className="text-primary/40 text-sm text-center py-12">Chargement...</p>
        )}

        {error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && events.length === 0 && (
          <p className="text-primary/40 text-sm italic text-center py-12">
            Aucun événement à venir pour le moment.
          </p>
        )}

        {grouped.map(([month, monthEvents]) => (
          <div key={month} className="mb-10">
            <h2 className="text-sm font-semibold text-primary/50 uppercase tracking-widest mb-5">
              {month}
            </h2>
            <div className="flex flex-col gap-3">
              {monthEvents.map((event, i) => {
                const date = new Date(event.event_date);
                const day = date.getDate().toString().padStart(2, "0");
                const weekday = date.toLocaleDateString("fr-FR", { weekday: "long" });
                const time = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl border border-beige-medium flex items-center gap-5 p-4 hover:border-secondary/30 transition-colors"
                  >
                    {/* Date */}
                    <div className="text-center w-14 shrink-0">
                      <p className="text-3xl font-bold text-primary leading-none">{day}</p>
                      <p className="text-[9px] uppercase tracking-widest text-primary/40 mt-1 capitalize">{weekday}</p>
                    </div>

                    {/* Image */}
                    <div
                      className={`w-28 h-20 rounded-xl bg-gradient-to-br ${EVENT_GRADIENTS[i % EVENT_GRADIENTS.length]} shrink-0`}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <span className="inline-block bg-secondary/10 text-secondary text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-semibold mb-1">
                        {event.group.name}
                      </span>
                      <h3 className="text-base font-serif italic text-primary leading-snug mb-0.5">
                        {event.title}
                      </h3>
                      <p className="text-xs text-primary/40">⏱ {time}</p>
                    </div>

                    {/* CTA */}
                    <Link
                      to={`/events/${event.id}`}
                      className="bg-primary text-white text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-primary/80 transition-colors shrink-0 whitespace-nowrap"
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
              "linear-gradient(to right, #1A1A2Eee, #2c1f14bb), url('/hero-books.jpg') center/cover no-repeat",
          }}
        >
          <div className="flex flex-col gap-4 max-w-lg">
            <h2 className="text-4xl font-serif italic text-white leading-tight">
              Le Grand Colloque Annuel
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Rejoignez-nous pour une semaine d'immersion totale. Des débats passionnés,
              des lectures nocturnes et le dévoilement du Prix du Cercle.
              Un moment suspendu hors du temps.
            </p>
            <p className="text-white/40 text-xs uppercase tracking-widest">24–30 Novembre</p>
            <button className="bg-white text-primary text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full w-fit hover:bg-beige transition-colors">
              Découvrir le programme
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default EventsPage;
