/** Formate une date d'événement en { month, day } pour les mini-calendriers de la section "À venir" */
function FormatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    month: date.toLocaleString("fr-FR", { month: "short" }).toUpperCase(),
    day: String(date.getDate()).padStart(2, "0"),
  };
}

export default FormatEventDate;