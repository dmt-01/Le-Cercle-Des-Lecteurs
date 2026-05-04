import StaticPage from "../StaticPage";

export const ContactPage = () => (
  <StaticPage
    category="Contact"
    title="Nous écrire"
    subtitle="Une question, une suggestion, ou simplement l'envie d'échanger ? Nous sommes à votre écoute."
    sections={[
      {
        heading: "Par email",
        body: "Pour toute demande générale, écrivez-nous à contact@cercle-des-lecteurs.fr. Nous vous répondons dans les 48 heures.",
      },
      {
        heading: "Rejoindre la communauté",
        body: "Vous souhaitez proposer un cercle de lecture, un événement ou un article ? Contactez-nous à redaction@cercle-des-lecteurs.fr.",
      },
      {
        heading: "Partenariats",
        body: "Libraires, éditeurs, auteurs — pour toute proposition de partenariat : partenaires@cercle-des-lecteurs.fr.",
      },
    ]}
  />
);