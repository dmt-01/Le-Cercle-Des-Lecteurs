import type { Book } from "../../../types";
import StarRating from "./StarRating";
import { Link } from "react-router";

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

export default FeaturedBook;