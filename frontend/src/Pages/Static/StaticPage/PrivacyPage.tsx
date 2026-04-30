import StaticPage from "../StaticPage";

export const PrivacyPage = () => (
  <StaticPage
    category="Légal"
    title="Politique de confidentialité"
    subtitle="Nous accordons la plus grande importance à la protection de vos données personnelles."
    sections={[
      {
        heading: "Données collectées",
        body: "Nous collectons uniquement les données nécessaires au bon fonctionnement du Cercle : adresse email, nom d'utilisateur et préférences de lecture. Aucune donnée n'est vendue à des tiers.",
      },
      {
        heading: "Utilisation des cookies",
        body: "Le Cercle utilise des cookies de session pour vous maintenir connecté et améliorer votre expérience. Aucun cookie publicitaire n'est utilisé.",
      },
      {
        heading: "Vos droits",
        body: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à privacy@cercle-des-lecteurs.fr.",
      },
    ]}
  />
);
