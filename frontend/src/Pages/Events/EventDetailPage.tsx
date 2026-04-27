import { useParams, Link } from "react-router";
import type { Event, Book } from "../../types";
import { apiFetch } from "../../services/api";
import { useEffect, useState } from "react";

function EventDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      apiFetch(`/events/${id}`),
      apiFetch("/books?limit=4"),
    ])
      .then(([eventRes, booksRes]) => {
        setEvent(eventRes.data ?? null);
        setBooks((booksRes.data ?? []).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center text-primary/40">Chargement...</div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-primary/50 mb-4">Événement introuvable.</p>
        <Link to="/events" className="text-secondary hover:underline text-sm">
          ← Retour aux événements
        </Link>
      </div>
    );
  }

  const date = new Date(event.event_date);
  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-10 items-start">

          {/* Gauche */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-secondary text-white text-[9px] uppercase tracking-widest px-3 py-1 rounded">
                Événement exclusif
              </span>
              <span className="text-[10px] uppercase tracking-widest text-primary/40">
                {event.group.name}
              </span>
            </div>

            <h1 className="text-5xl font-serif italic text-primary leading-tight">{event.title}</h1>

            {/* Date / Heure / Organisateur */}
            <div className="flex items-start gap-8 border-l-2 border-gold pl-5 flex-wrap">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-primary/40 mb-1">Date</p>
                <p className="text-sm font-semibold text-primary">{formattedDate}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-primary/40 mb-1">Heure</p>
                <p className="text-sm font-semibold text-primary">{formattedTime}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-primary/40 mb-1">Cercle</p>
                <Link
                  to={`/groups/${event.group.id}`}
                  className="text-sm font-semibold text-secondary hover:underline"
                >
                  {event.group.name}
                </Link>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-3">
                — À propos de l'événement
              </p>
              <p className="text-primary/70 text-sm leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* Droite — image */}
          <div className="hidden md:block">
            <div className="w-full aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#1a2c1a] to-[#2c5c3a] shadow-xl" />
          </div>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">

        {/* Organisateur */}
        <div className="bg-white rounded-2xl border border-beige-medium p-6">
          <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-4">L'Organisateur</p>
          <h3 className="text-xl font-serif italic text-primary mb-3">{event.group.name}</h3>
          <p className="text-sm text-primary/60 leading-relaxed mb-4">
            Cet événement est organisé par le cercle de lecture{" "}
            <strong className="font-semibold">{event.group.name}</strong>.
            Rejoignez le cercle pour ne manquer aucune de leurs prochaines rencontres.
          </p>
          <Link
            to={`/groups/${event.group.id}`}
            className="text-[10px] uppercase tracking-widest text-secondary font-semibold hover:underline"
          >
            Voir le cercle →
          </Link>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-beige-medium p-5">
            {event.link ? (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-secondary text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-secondary-hover transition-colors mb-4"
              >
                Je participe →
              </a>
            ) : (
              <button
                disabled
                className="w-full bg-primary/20 text-primary/40 text-sm font-semibold px-5 py-3 rounded-xl cursor-not-allowed mb-4"
              >
                Inscription à venir
              </button>
            )}
            <div className="flex flex-col gap-2.5">
              <p className="text-xs text-primary/50 flex items-center gap-2">
                <span>📅</span> {formattedDate}
              </p>
              <p className="text-xs text-primary/50 flex items-center gap-2">
                <span>⏱</span> {formattedTime}
              </p>
              <p className="text-xs text-primary/50 flex items-center gap-2">
                <span>👥</span> {event.group.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lectures recommandées ── */}
      {books.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-serif italic text-primary">Lectures recommandées</h2>
            <Link
              to="/books"
              className="text-[10px] uppercase tracking-widest text-primary/40 hover:text-secondary transition-colors"
            >
              Voir toute la collection →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {books.map((book) => (
              <Link key={book.id} to={`/books/${book.id}`} className="flex flex-col gap-2 group">
                <div className="aspect-[2/3] bg-beige-medium rounded-xl overflow-hidden">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/20 flex items-end p-3">
                      <p className="text-primary text-xs font-serif italic line-clamp-2">{book.title}</p>
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold text-primary line-clamp-1">{book.title}</p>
                {book.authors[0] && (
                  <p className="text-xs text-primary/40">{book.authors[0].name}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default EventDetailPage;
