// ─────────────────────────────────────────────────────────────────────────────
// Pages/Books/BooksPage.tsx
// Page bibliothèque : liste paginée de livres avec filtres (recherche, genre, note).
// Le premier livre est affiché en "hero", les suivants en grille 4 colonnes.
// Toute la logique de filtrage et de pagination est dans useBooks().
// ─────────────────────────────────────────────────────────────────────────────

import FeaturedBook from "./BooksComponent/FeatureBook";
import ModalAddBook from "./BooksComponent/ModalAddBook";
import Pagination from "./BooksComponent/Pagination";
import BookCard from "./BooksComponent/BookCard";
import { useBooks } from "../../hooks/useBooks";

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
    showAddModal,
    setShowAddModal,
    refreshBooks,
  } = useBooks();

  return (
    <div className="min-h-screen">
      {showAddModal && (
        <ModalAddBook
          onClose={() => setShowAddModal(false)}
          onCreated={() => {
            setShowAddModal(false);
            refreshBooks();
          }}
        />
      )}

      {/* ── En-tête ── */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-5xl font-serif italic text-primary mb-3">
            La Bibliothèque
          </h1>
          <p className="text-primary/50 text-sm leading-relaxed max-w-lg">
            Parcourez notre sélection rigoureuse d'ouvrages classiques et
            contemporains, choisis pour leur profondeur et leur souffle
            littéraire.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="shrink-0 flex items-center gap-2 bg-secondary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-secondary-hover transition-colors mt-2"
          aria-label="Ajouter un livre"
        >
          + Ajouter un livre
        </button>
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
              aria-label="Rechercher un titre ou auteur"
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
              aria-label="Sélectionner un genre"
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
            aria-label="Appliquer les filtres"
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
