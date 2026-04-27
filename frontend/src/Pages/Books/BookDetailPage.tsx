import type { Book, Review, Tab } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useParams, Link } from "react-router";
import { apiFetch } from "../../services/api";
import { useEffect, useState } from "react";

function StarRating({ note }: { note: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <span key={starValue} className={starValue <= note ? "text-gold" : "text-beige-medium"}>★</span>
      ))}
    </div>
  );
}

function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tab, setTab] = useState<Tab>("resume");
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      apiFetch(`/books/${id}`),
      apiFetch(`/books/${id}/reviews`),
    ])
      .then(([bookRes, reviewsRes]) => {
        setBook(bookRes.data ?? null);
        setReviews(reviewsRes.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Vérifie si le livre est déjà en wishlist (si connecté)
  useEffect(() => {
    if (!user || !id) return;
    apiFetch("/wishlist")
      .then((res) => {
        const inList = (res.data ?? []).some((wishlistBook: Book) => wishlistBook.id === id);
        setInWishlist(inList);
      })
      .catch(() => {});
  }, [user, id]);

  async function handleWishlist() {
    if (!user || !id) return;
    setActionLoading(true);
    try {
      if (inWishlist) {
        await apiFetch(`/wishlist/${id}`, { method: "DELETE" });
        setInWishlist(false);
      } else {
        await apiFetch("/wishlist", { method: "POST", body: JSON.stringify({ bookId: id }) });
        setInWishlist(true);
      }
    } catch {}
    setActionLoading(false);
  }

  async function handleToggleRead() {
    if (!user || !id) return;
    setActionLoading(true);
    try {
      await apiFetch(`/books/${id}/read`, { method: "POST" });
      setIsRead((prev) => !prev);
    } catch {}
    setActionLoading(false);
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center text-primary/40">
        Chargement...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-primary/50 mb-4">Livre introuvable.</p>
        <Link to="/books" className="text-secondary hover:underline text-sm">← Retour à la bibliothèque</Link>
      </div>
    );
  }

  const curatorReview = reviews[0];
  const publicationYear = book.publication_date
    ? new Date(book.publication_date).getFullYear()
    : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12">

        {/* ── Colonne gauche ── */}
        <div className="flex flex-col gap-6">
          {/* Couverture */}
          <div className="rounded-2xl overflow-hidden aspect-[2/3] bg-beige-medium shadow-md">
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={`Couverture de ${book.title}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center p-6">
                <p className="text-white font-serif italic text-center text-sm">{book.title}</p>
              </div>
            )}
          </div>

          {/* Détails techniques */}
          <div className="bg-white rounded-2xl border border-beige-medium p-5">
            <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-4">
              Détails techniques
            </p>
            <div className="flex flex-col gap-3">
              {publicationYear && (
                <div className="flex justify-between text-sm">
                  <span className="text-primary/50">Publication</span>
                  <span className="text-primary font-medium">{publicationYear}</span>
                </div>
              )}
              {book.authors.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-primary/50">Auteur</span>
                  <span className="text-primary font-medium text-right">{book.authors.map((author) => author.name).join(", ")}</span>
                </div>
              )}
              {book.genres.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-primary/50">Genre</span>
                  <span className="text-primary font-medium text-right">{book.genres.map((genre) => genre.name).join(", ")}</span>
                </div>
              )}
              {book.tags.length > 0 && (
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-primary/50 text-sm">Thèmes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {book.tags.map((tag) => (
                      <span key={tag.id} className="bg-beige text-primary/60 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Colonne droite ── */}
        <div className="flex flex-col gap-6">

          {/* Fil d'Ariane genres */}
          {book.genres.length > 0 && (
            <p className="text-[10px] uppercase tracking-widest text-secondary font-medium">
              {book.genres.map((genre) => genre.name).join(" › ")}
            </p>
          )}

          {/* Titre + auteur */}
          <div>
            <h1 className="text-5xl font-serif italic text-primary leading-tight mb-2">
              {book.title}
            </h1>
            {book.authors[0] && (
              <p className="text-primary/50 text-base">{book.authors[0].name}</p>
            )}
          </div>

          {/* Note + avis */}
          <div className="flex items-center gap-6 text-sm">
            {book.average_rating && (book.review_count ?? 0) > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <span key={starValue} className={starValue <= Math.round(book.average_rating!) ? "text-gold text-lg" : "text-beige-medium text-lg"}>★</span>
                  ))}
                </div>
                <span className="font-semibold text-primary">{book.average_rating.toFixed(1)}</span>
                <span className="text-primary/40 text-sm">({book.review_count} avis)</span>
              </div>
            ) : (
              <span className="text-primary/30 italic text-sm">Aucun avis</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {user ? (
              <>
                <button
                  onClick={handleWishlist}
                  disabled={actionLoading}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
                    inWishlist
                      ? "bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20"
                      : "bg-secondary text-white hover:bg-secondary-hover"
                  }`}
                >
                  <span>{inWishlist ? "✓" : "+"}</span>
                  {inWishlist ? "Dans ma wishlist" : "Ajouter à ma wishlist"}
                </button>
                <button
                  onClick={handleToggleRead}
                  disabled={actionLoading}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-colors min-h-[44px] ${
                    isRead
                      ? "bg-gold/10 text-gold border-gold/30 hover:bg-gold/20"
                      : "bg-white text-primary border-beige-medium hover:border-secondary/40"
                  }`}
                >
                  <span>{isRead ? "✓" : "📖"}</span>
                  {isRead ? "Lu" : "Marquer comme lu"}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-secondary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary-hover transition-colors"
              >
                Connectez-vous pour interagir
              </Link>
            )}
          </div>

          {/* Onglets */}
          <div className="border-b border-beige-medium">
            <div className="flex gap-6">
              {(["resume", "critiques", "forum"] as Tab[]).map((tabItem) => (
                <button
                  key={tabItem}
                  onClick={() => setTab(tabItem)}
                  className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                    tab === tabItem
                      ? "border-secondary text-secondary"
                      : "border-transparent text-primary/40 hover:text-primary/70"
                  }`}
                >
                  {tabItem === "resume" ? "Résumé" : tabItem.charAt(0).toUpperCase() + tabItem.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu onglet Résumé */}
          {tab === "resume" && (
            <div className="flex flex-col gap-6">
              {curatorReview?.content && (
                <blockquote className="italic text-primary/70 text-base leading-relaxed border-l-2 border-gold pl-4">
                  « {curatorReview.content} »
                </blockquote>
              )}
              {book.description && (
                <p className="text-primary/70 text-sm leading-relaxed">{book.description}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {/* Mot du curateur */}
                {curatorReview && (
                  <div className="bg-white rounded-xl border border-beige-medium p-5">
                    <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-3">
                      Le Mot du Curateur
                    </p>
                    <p className="text-sm text-primary/60 italic leading-relaxed mb-4 line-clamp-3">
                      "{curatorReview.content}"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xs font-bold uppercase">
                        {curatorReview.username?.[0] ?? "?"}
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold">
                        {curatorReview.username}
                      </span>
                    </div>
                  </div>
                )}

                {/* Prochainement */}
                <div className="bg-white rounded-xl border border-beige-medium p-5">
                  <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-3">
                    Prochainement
                  </p>
                  <p className="text-sm text-primary/60 leading-relaxed mb-4">
                    Rejoignez nos discussions en direct avec les membres du cercle exclusif.
                  </p>
                  <Link
                    to="/events"
                    className="text-[10px] uppercase tracking-widest text-secondary font-semibold hover:underline"
                  >
                    Voir les événements →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Contenu onglet Critiques */}
          {tab === "critiques" && (
            <div className="flex flex-col gap-4">
              {reviews.length === 0 && (
                <p className="text-primary/40 text-sm italic">Aucune critique pour ce livre.</p>
              )}
              {reviews.map((review, index) => (
                <div key={index} className="bg-white rounded-xl border border-beige-medium p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xs font-bold uppercase">
                        {review.username?.[0] ?? "?"}
                      </div>
                      <span className="text-sm font-semibold text-primary">{review.username}</span>
                    </div>
                    {review.note && <StarRating note={review.note} />}
                  </div>
                  {review.content && (
                    <p className="text-sm text-primary/60 leading-relaxed">{review.content}</p>
                  )}
                  <p className="text-xs text-primary/30">
                    {new Date(review.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Contenu onglet Forum */}
          {tab === "forum" && (
            <div className="text-center py-10">
              <p className="text-primary/40 text-sm italic">Le forum arrive prochainement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;
