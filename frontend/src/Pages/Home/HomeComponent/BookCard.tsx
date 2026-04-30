import type { Book } from "../../../types";
import { Link } from "react-router";
import StarRating from "./StarRating";

/** Carte de livre utilisée dans la section "Recommandés pour vous" */
function BookCard({ book }: { book: Book }) {
  return (
    <Link to={`/books/${book.id}`} className="flex flex-col gap-2 group">
      <div className="aspect-[2/3] bg-beige-medium rounded-lg overflow-hidden">
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={`Couverture de ${book.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-end justify-center"
            style={{
              background: "linear-gradient(rgba(42, 0, 2, 0), rgba(42, 0, 2, 0.90)), url(/img/template_book.png) center/cover no-repeat",
            }}
          >
            <span className="text-white text-center p-2">{book.title}</span>
          </div>
        )}
      </div>
      <div>
        {book.genres[0] && (
          <p className="text-xs uppercase tracking-widest text-secondary font-medium mb-0.5">
            {book.genres[0].name}
          </p>
        )}
        <StarRating
          note={Math.round(book.average_rating ?? 0)}
          count={book.review_count ?? 0}
        />
        <p className="text-sm font-semibold text-primary mt-0.5 line-clamp-1">
          {book.title}
        </p>
        {book.authors[0] && (
          <p className="text-xs text-primary/50">{book.authors[0].name}</p>
        )}
      </div>
    </Link>
  );
}

export default BookCard;