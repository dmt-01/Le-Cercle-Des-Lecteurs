/** Renvoie les deux premières lettres d'un nom en majuscules, pour les avatars. */
function Initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export default Initials;