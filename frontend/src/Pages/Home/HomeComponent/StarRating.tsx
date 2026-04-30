/** Affiche une rangée d'étoiles et le nombre de votes pour un livre */
function StarRating({ note, count }: { note: number; count: number }) {
  if (count === 0) {
    return <span className="text-xs text-primary/30 italic">Aucun vote</span>;
  }
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Note : ${note} sur 5`}
    >
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <span
            key={starValue}
            className={starValue <= note ? "text-gold" : "text-beige-medium"}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-xs text-primary/40">
        ({count} vote{count > 1 ? "s" : ""})
      </span>
    </div>
  );
}

export default StarRating;