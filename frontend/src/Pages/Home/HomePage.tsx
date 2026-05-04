// ─────────────────────────────────────────────────────────────────────────────
// Pages/Home/HomePage.tsx
// Page d'accueil du Cercle des Lecteurs.
// Sections : Hero → Cabinet des curiosités → Recommandés → À venir (événements)
// Toute la logique de chargement est déléguée à useHome().
// ─────────────────────────────────────────────────────────────────────────────

import FormatEventDate from "./HomeComponent/FormatEventDate";
import { useAuth } from "../../context/AuthContext";
import BookCard from "./HomeComponent/BookCard";
import { useHome } from "../../hooks/useHome";
import type { Event } from "../../types";
import { Link } from "react-router";

function HomePage() {
  const { user } = useAuth();
  const { featured, cabinetBooks, recommended, events } = useHome();

  return (
    <div className="bg-beige min-h-screen">
      {/* ── Hero ── */}
      <section
        className="relative min-h-[560px] flex flex-col items-center justify-center text-center px-6 py-24"
        style={{
          background:
            "url(/img/banniere_header_acceuil.png) center/cover no-repeat",
          backgroundColor: "black",
          opacity: 0.9,
        }}
        aria-label="Bannière d'accueil"
      >
        <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-4">
          Le salon littéraire privé
        </p>
        <h1 className="text-5xl md:text-6xl font-serif italic text-white mb-6 leading-tight">
          Lisez, partagez, discutez
        </h1>
        <p className="text-white/70 text-base max-w-md leading-relaxed mb-10">
          Rejoignez une communauté d'érudits et de passionnés. Découvrez des
          œuvres rares et participez à des échanges intellectuels dans notre
          atelier numérique.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/groups"
            className="bg-secondary text-white px-6 py-3 rounded-full font-medium hover:bg-secondary-hover transition-colors min-h-[44px] flex items-center"
            aria-label="Explorer les groupes de lecture"
          >
            Explorer le club
          </Link>
          <Link
            to="/books"
            className="border border-white/50 text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors min-h-[44px] flex items-center"
            aria-label="Découvrir nos collections"
          >
            Nos collections
          </Link>
        </div>
      </section>

      {/* ── Cabinet des curiosités ── */}
      <section
        className="max-w-5xl mx-auto px-6 py-16"
        aria-labelledby="cabinet-title"
      >
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2
              id="cabinet-title"
              className="text-3xl font-serif italic text-primary"
            >
              Le cabinet des curiosités
            </h2>
            <p className="text-primary/50 text-sm mt-1">
              Tendances, Nouveautés, et nos Coups de cœur du mois
            </p>
          </div>
          <Link
            to="/books"
            className="text-xs uppercase tracking-widest text-primary/50 hover:text-secondary transition-colors"
            aria-label="Découvrir tous les livres"
          >
            Tout voir
          </Link>
        </div>

        {featured && (
          <div className="grid grid-cols-3 gap-x-4 gap-y-0 mt-8">
            <Link
              to={`/books/${featured.id}`}
              className="col-span-1 row-span-2 relative rounded-xl overflow-hidden group min-h-[400px]"
              aria-label={`Voir les détails du livre ${featured.title}`}
            >
              {featured.cover_image ? (
                <img
                  src={featured.cover_image}
                  alt={`Couverture de ${featured.title}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div
                  className="w-full h-full from-secondary to-primary"
                  style={{
                    background: "linear-gradient(rgba(42, 0, 2, 0), rgba(42, 0, 2, 0.90)), url(/img/template_book.png) center/cover no-repeat",
                  }}
                />
              )}
              <div className="absolute inset-0" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <span className="bg-secondary text-white text-[10px] uppercase tracking-widest px-2 py-0.5 rounded mb-3 inline-block">
                  Coup de cœur
                </span>
                <h3 className="text-xl font-serif italic mb-1">
                  {featured.title}
                </h3>
                {featured.authors[0] && (
                  <p className="text-white/60 text-xs mb-3">
                    Par {featured.authors[0].name}
                  </p>
                )}
                <span className="text-xs text-white/80 underline underline-offset-2">
                  Lire la critique →
                </span>
              </div>
            </Link>

            <div className="col-span-2 grid grid-cols-2 gap-4">
              {cabinetBooks.map((book) => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}`}
                  className="relative rounded-xl overflow-hidden aspect-[3/4] group"
                  aria-label={`Voir les détails du livre ${book.title}`}
                >
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={`Couverture de ${book.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-end p-3"
                      style={{
                        background: "linear-gradient(rgba(42, 0, 2, 0), rgba(42, 0, 2, 0.90)), url(/img/template_book.png) center/cover no-repeat",
                      }}
                    >
                      <p className="text-primary text-xs font-medium">
                        {book.title}
                      </p>
                    </div>
                  )}
                  {book.genres[0] && (
                    <div className="absolute top-3 left-3 bg-black/50 text-white text-[10px] uppercase tracking-widest px-2 py-0.5 rounded">
                      {book.genres[0].name}
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-sm font-semibold line-clamp-1">
                      {book.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Recommandés pour vous ── */}
      <section
        className="max-w-5xl mx-auto px-6 py-10"
        aria-labelledby="reco-title"
      >
        <div className="flex items-end justify-between mb-8">
          <h2
            id="reco-title"
            className="text-3xl font-serif italic text-primary"
          >
            Recommandés pour vous
          </h2>
          <div className="flex gap-4 text-xs uppercase tracking-widest text-primary/40">
            <span>Basé sur vos lectures</span>
            {user && (
              <Link
                to="/profile"
                className="hover:text-secondary transition-colors"
                aria-label="Modifier mes goûts littéraires"
              >
                Modifier mes goûts
              </Link>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {recommended.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* ── À venir ── */}
      <section
        className="max-w-5xl mx-auto px-6 py-16"
        aria-labelledby="events-title"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-6">
            <div>
              <h2
                id="events-title"
                className="text-3xl font-serif italic text-primary mb-2"
              >
                À venir
              </h2>
              <p className="text-primary/50 text-sm leading-relaxed">
                Nos prochains rendez-vous littéraires, séminaires et rencontres
                avec les auteurs.
              </p>
            </div>
            {user && (
              <div className="bg-white rounded-xl p-5 border border-beige-medium">
                <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-1">
                  Votre statut
                </p>
                <p className="text-primary font-semibold text-sm mb-1">
                  Membre
                </p>
                <p className="text-primary/50 text-xs mb-4">
                  Accès à tous les événements de la communauté.
                </p>
                <Link
                  to="/events"
                  className="block text-center bg-beige-medium text-primary text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-beige-medium/70 transition-colors min-h-[44px] flex items-center justify-center"
                  aria-label="Voir tous les événements"
                >
                  Voir tous les événements
                </Link>
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col gap-3">
            {events.length === 0 && (
              <p className="text-primary/40 text-sm">
                Aucun événement à venir.
              </p>
            )}
            {events.map((event: Event) => {
              const { month, day } = FormatEventDate(event.event_date);
              return (
                <Link
                  key={event.id}
                  to="/events"
                  className="flex items-center gap-5 bg-white rounded-xl px-5 py-4 border border-beige-medium hover:border-secondary/30 transition-colors group"
                  aria-label={`Voir les détails de l'événement ${event.title}`}
                >
                  <div className="flex flex-col items-center justify-center w-12 shrink-0 border-gold border-2 rounded-lg p-1">
                    <span className="text-[10px] uppercase tracking-widest text-secondary font-medium">
                      {month}
                    </span>
                    <span className="text-2xl font-bold text-primary leading-none">
                      {day}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {event.group && (
                      <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-0.5">
                        {event.group.name}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-primary line-clamp-1 group-hover:text-secondary transition-colors">
                      {event.title}
                    </p>
                    <p className="text-xs text-primary/50 line-clamp-1">
                      {event.description}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-black shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </Link>
              );
            })}
            {events.length > 0 && (
              <Link
                to="/events"
                className="text-center text-xs uppercase tracking-widest text-primary/40 hover:text-secondary transition-colors py-2"
                aria-label="Voir tous les événements"
              >
                Voir tous les événements →
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
