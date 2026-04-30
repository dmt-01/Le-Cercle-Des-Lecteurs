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

export default Pagination;