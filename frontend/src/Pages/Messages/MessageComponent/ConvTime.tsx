/**
 * Formate la date du dernier message d'une conversation pour la sidebar.
 * Aujourd'hui → heure, hier → "Hier", sinon → "j mois" (ex : "3 janv.").
 */
function ConvTime(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Hier";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default ConvTime;