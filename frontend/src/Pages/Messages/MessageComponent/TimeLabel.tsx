/** Formate une heure de message en "HH:MM" pour l'affichage sous chaque bulle. */
function TimeLabel(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default TimeLabel;