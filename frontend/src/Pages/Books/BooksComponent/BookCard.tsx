import StarRating from "../../../components/ui/StarRating";
import type { Book } from "../../../types";
import { Link } from "react-router";

/** Carte de livre compacte pour la grille principale */
function BookCard({ book }: { book: Book }) {
  return (
    <Link to={`/books/${book.id}`} 
          className="flex flex-col gap-2 group"
          aria-label={`Voir les détails du livre ${book.title}`}>
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
              background: "url(/img/template_book.png) center/cover no-repeat",
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

export default BookCard;