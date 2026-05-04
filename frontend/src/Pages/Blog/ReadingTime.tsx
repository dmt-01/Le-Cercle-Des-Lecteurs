/** Calcule le temps de lecture estimé d'un article (200 mots/min) */
function readingTime(content?: string | null) {
  if (!content) return "1 min de lecture";
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min de lecture`;
}

export default readingTime;