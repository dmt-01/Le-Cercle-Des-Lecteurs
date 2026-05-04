/** Rangée d'étoiles avec note et nombre de votes optionnel */
function StarRating({
  rating,
  count,
}: {
  rating: number | null;
  count?: number;
}) {
  if (rating === null || count === 0) {
    return <span className="text-xs text-primary/30 italic">Aucun vote</span>;
  }

  const rounded = Math.round(rating);

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Note : ${rating.toFixed(1)} sur 5`}
    >
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <span
            key={starValue}
            className={starValue <= rounded ? "text-[#A45C09]" : "text-beige-medium"}
          >
            ★
          </span>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-primary/40">
          ({count} vote{count > 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
}

export default StarRating;
