import StaticPage from "../StaticPage";

export const AboutPage = () => (
  <StaticPage
    category="Le Cercle"
    title="À propos"
    subtitle="Le Cercle des Lecteurs est une communauté privée dédiée aux bibliophiles exigeants. Un espace pour partager, découvrir et échanger autour de la littérature."
    sections={[
      {
        heading: "Notre histoire",
        body: "Fondé par des passionnés de littérature, Le Cercle des Lecteurs est né du désir de créer un espace intime et cultivé, loin du bruit numérique. Nous croyons que la lecture est un art qui se partage.",
      },
      {
        heading: "Notre mission",
        body: "Réunir des lecteurs exigeants autour d'œuvres qui comptent. Proposer des cercles de lecture thématiques, des événements exclusifs et des discussions profondes sur la littérature d'hier et d'aujourd'hui.",
      },
      {
        heading: "L'équipe",
        body: "Le Cercle est animé par une équipe de curateurs passionnés, d'écrivains et de critiques littéraires, unis par l'amour du livre papier et de la lecture lente.",
      },
    ]}
  />
);