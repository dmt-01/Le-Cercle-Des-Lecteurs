/** Rangée d'étoiles pour l'affichage d'une note dans les avis */
function StarRating({ note }: { note: number }) {
  return (
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
  );
}

export default StarRating;