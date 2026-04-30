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

export default StarRating;