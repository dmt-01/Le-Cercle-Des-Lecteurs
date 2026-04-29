// ─────────────────────────────────────────────────────────────────────────────
// Pages/Books/BooksPage.tsx
// Page bibliothèque : liste paginée de livres avec filtres (recherche, genre, note).
// Le premier livre est affiché en "hero", les suivants en grille 4 colonnes.
// Toute la logique de filtrage et de pagination est dans useBooks().
// ─────────────────────────────────────────────────────────────────────────────

import { useBooks } from "../../hooks/useBooks";
import type { Book } from "../../types";
import { Link } from "react-router";

const QUOTE = {
  text: "« Une chambre sans livres est comme un corps sans âme. »",
  author: "Marcus Tullius Cicéron",
};

const NOTE_OPTIONS = [
  { label: "Toutes les notes", value: 0 },
  { label: "4★ et plus", value: 4 },
  { label: "3★ et plus", value: 3 },
  { label: "2★ et plus", value: 2 },
];

/** Affiche une rangée d'étoiles avec la note moyenne et son nombre de votes */
function StarRating({
  rating,
  count,
}: {
  rating: number | null;
  count: number;
}) {
  if (!rating || count === 0)
    return <span className="text-xs text-primary/30 italic">Aucun vote</span>;
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <span
            key={starValue}
            className={starValue <= rounded ? "text-gold" : "text-beige-medium"}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-xs text-primary/40">{rating.toFixed(1)}★</span>
    </div>
  );
}

/** Grande carte "hero" affichée pour le premier livre de la liste */
function FeaturedBook({ book }: { book: Book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="flex gap-8 bg-white rounded-2xl overflow-hidden border border-beige-medium hover:border-secondary/30 transition-colors group"
    >
      <div className="relative shrink-0 w-48 bg-beige-medium">
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={`Couverture de ${book.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full min-h-[280px] bg-gradient-to-br from-secondary to-primary"
            style={{
              background: "url(/img/template_book.png) center/cover no-repeat",
            }}
          />
        )}
        <div className="absolute top-3 left-3 text-white text-[9px] uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1">
          <span>✦</span> Editor's Choice
        </div>
      </div>

      <div className="flex flex-col justify-center py-8 pr-8 gap-3">
        {book.genres[0] && (
          <span className="text-[10px] uppercase tracking-widest text-secondary font-medium">
            {book.genres[0].name}
          </span>
        )}
        <StarRating
          rating={book.average_rating ?? null}
          count={book.review_count ?? 0}
        />
        <h2 className="text-4xl font-serif italic text-primary leading-tight">
          {book.title}
        </h2>
        {book.authors[0] && (
          <p className="text-sm text-primary/50">{book.authors[0].name}</p>
        )}
        {book.description && (
          <p className="text-sm text-primary/60 leading-relaxed line-clamp-3 max-w-lg">
            {book.description}
          </p>
        )}
        <span className="inline-flex items-center gap-2 bg-secondary text-white text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg w-fit mt-2 group-hover:bg-secondary-hover transition-colors">
          Voir le détail
        </span>
      </div>
    </Link>
  );
}

/** Carte de livre compacte pour la grille principale */
function BookCard({ book }: { book: Book }) {
  return (
    <Link to={`/books/${book.id}`} className="flex flex-col gap-2 group">
      <div className="aspect-[2/3] bg-beige-medium rounded-xl overflow-hidden">
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={`Couverture de ${book.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-end p-4"
            style={{
              background: "linear-gradient(rgb(58, 6, 18), rgba(73, 17, 17, 0.5)),url(/img/template_book.png) center/cover no-repeat",
            }}
          >
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-1">
        {book.genres[0] && (
          <span className="text-[10px] uppercase tracking-widest text-secondary font-medium">
            {book.genres[0].name}
          </span>
        )}
        <StarRating
          rating={book.average_rating ?? null}
          count={book.review_count ?? 0}
        />
        <p className="text-sm font-semibold text-primary line-clamp-1">
          {book.title}
        </p>
        {book.authors[0] && (
          <p className="text-xs text-primary/40">{book.authors[0].name}</p>
        )}
      </div>
    </Link>
  );
}

/**
 * Composant de pagination avec ellipses.
 * Affiche toujours les 3 premières et la dernière page,
 * et la page courante si elle est au milieu.
 */
function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (newPage: number) => void;
}) {
  if (totalPages <= 1) return null;

  const items: (number | "…")[] = [];
  if (totalPages <= 6) {
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++)
      items.push(pageNumber);
  } else {
    items.push(1, 2, 3);
    if (page > 4) items.push("…");
    if (page > 3 && page < totalPages - 2) items.push(page);
    if (page < totalPages - 2) items.push("…");
    items.push(totalPages);
  }

  const unique = items.filter(
    (item, index, array) => array.indexOf(item) === index,
  );

  return (
    <div className="flex items-center justify-center gap-2 py-12">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-beige-medium text-primary/50 hover:border-secondary hover:text-secondary disabled:opacity-30 transition-colors"
      >
        ‹
      </button>
      {unique.map((item, index) =>
        item === "…" ? (
          <span key={`ellipsis-${index}`} className="text-primary/30 px-1">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
              item === page
                ? "bg-secondary text-white"
                : "border border-beige-medium text-primary/60 hover:border-secondary hover:text-secondary"
            }`}
          >
            {item}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-beige-medium text-primary/50 hover:border-secondary hover:text-secondary disabled:opacity-30 transition-colors"
      >
        ›
      </button>
    </div>
  );
}

function BooksPage() {
  const {
    draftSearch,
    setDraftSearch,
    draftGenre,
    setDraftGenre,
    draftNote,
    setDraftNote,
    allGenres,
    totalPages,
    loading,
    featured,
    rest,
    page,
    setPage,
    appliedSearch,
    handleFilter,
  } = useBooks();

  return (
    <div className="min-h-screen">
      {/* ── En-tête ── */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-8">
        <h1 className="text-5xl font-serif italic text-primary mb-3">
          La Bibliothèque
        </h1>
        <p className="text-primary/50 text-sm leading-relaxed max-w-lg">
          Parcourez notre sélection rigoureuse d'ouvrages classiques et
          contemporains, choisis pour leur profondeur et leur souffle
          littéraire.
        </p>
      </div>

      {/* ── Filtres ── */}
      <div className="max-w-5xl mx-auto px-6 pb-10">
        <form
          onSubmit={handleFilter}
          className="bg-white border border-beige-medium rounded-2xl px-6 py-5 flex flex-wrap items-end gap-4"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] uppercase tracking-widest text-primary/40 mb-1.5">
              Rechercher un titre ou auteur
            </label>
            <input
              type="text"
              value={draftSearch}
              onChange={(event) => setDraftSearch(event.target.value)}
              placeholder="Ex: Marcel Proust..."
              className="w-full bg-beige rounded-lg px-4 py-2.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-primary/40 mb-1.5">
              Genre
            </label>
            <select
              value={draftGenre}
              onChange={(event) => setDraftGenre(event.target.value)}
              className="bg-beige rounded-lg px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30 cursor-pointer"
            >
              <option value="">Tous les genres</option>
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-primary/40 mb-1.5">
              Note
            </label>
            <select
              value={draftNote}
              onChange={(event) => setDraftNote(Number(event.target.value))}
              className="bg-beige rounded-lg px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30 cursor-pointer"
            >
              {NOTE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-secondary text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-secondary-hover transition-colors min-h-[44px]"
          >
            Filtrer
          </button>
        </form>
      </div>

      {/* ── Résultats ── */}
      <div className="max-w-5xl mx-auto px-6">
        {loading && (
          <p className="text-primary/40 text-sm text-center py-12">
            Chargement...
          </p>
        )}

        {!loading && !featured && (
          <p className="text-primary/40 text-sm text-center py-12">
            Aucun livre trouvé.
          </p>
        )}

        {!loading && featured && (
          <>
            <div className="mb-10">
              <FeaturedBook book={featured} />
            </div>

            {rest.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-16">
                {rest.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </>
        )}

        {!loading && featured && (
          <div className="border-t border-beige-medium py-16 text-center">
            <p className="text-[60px] text-secondary/30 leading-none font-serif mb-4">
              "
            </p>
            <p className="text-2xl font-serif italic text-primary max-w-xl mx-auto leading-relaxed">
              {QUOTE.text}
            </p>
            <p className="text-xs uppercase tracking-widest text-primary/40 mt-6">
              — {QUOTE.author}
            </p>
          </div>
        )}

        {!appliedSearch && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>
    </div>
  );
}

export default BooksPage;
