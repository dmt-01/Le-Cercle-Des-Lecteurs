import StaticPage from "../StaticPage";

export const HelpPage = () => (
  <StaticPage
    category="Support"
    title="Centre d'aide"
    subtitle="Vous trouverez ici les réponses aux questions les plus fréquentes."
    sections={[
      {
        heading: "Comment rejoindre un cercle ?",
        body: "Rendez-vous sur la page Groupes, parcourez les cercles disponibles et cliquez sur « Rejoindre ». Vous aurez immédiatement accès aux discussions et aux événements du cercle.",
      },
      {
        heading: "Comment modifier mon profil ?",
        body: "Accédez à votre profil via l'icône en haut à droite, puis cliquez sur « Modifier le profil ». Vous pouvez y changer votre photo, votre biographie et vos préférences de lecture.",
      },
      {
        heading: "J'ai un problème technique",
        body: "Si vous rencontrez un bug ou un problème d'accès, écrivez-nous à support@cercle-des-lecteurs.fr en décrivant le problème et votre navigateur. Nous vous répondons rapidement.",
      },
    ]}
  />
);