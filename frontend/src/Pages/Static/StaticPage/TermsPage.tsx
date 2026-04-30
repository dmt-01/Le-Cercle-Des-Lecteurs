import StaticPage from "../StaticPage";

export const TermsPage = () => (
  <StaticPage
    category="Légal"
    title="Conditions d'utilisation"
    subtitle="En rejoignant Le Cercle des Lecteurs, vous acceptez les présentes conditions d'utilisation."
    sections={[
      {
        heading: "Accès à la plateforme",
        body: "L'inscription est gratuite et ouverte à toute personne majeure. Chaque membre s'engage à respecter la communauté et à contribuer à un espace de discussion bienveillant.",
      },
      {
        heading: "Contenu publié",
        body: "Les membres sont responsables du contenu qu'ils publient (critiques, messages, commentaires). Tout contenu injurieux, discriminatoire ou hors sujet pourra être supprimé.",
      },
      {
        heading: "Propriété intellectuelle",
        body: "Le contenu éditorial du Cercle (articles, sélections, illustrations) est protégé par le droit d'auteur. Toute reproduction sans accord préalable est interdite.",
      },
    ]}
  />
);