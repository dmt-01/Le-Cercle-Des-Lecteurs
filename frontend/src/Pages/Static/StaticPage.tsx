import type { Section } from "../../types";

type Props = {
  category: string;
  title: string;
  subtitle: string;
  sections: Section[];
};

function StaticPage({ category, title, subtitle, sections }: Props) {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">

        {/* ── En-tête ── */}
        <p className="text-[10px] uppercase tracking-widest text-secondary font-medium mb-2">{category}</p>
        <h1 className="text-4xl font-serif italic text-primary mb-4 leading-tight">{title}</h1>
        <p className="text-primary/50 text-sm leading-relaxed mb-10 max-w-lg">{subtitle}</p>

        {/* ── Sections ── */}
        <div className="flex flex-col gap-5">
          {sections.map((s) => (
            <div key={s.heading} className="bg-white rounded-2xl border border-beige-medium p-6">
              <h2 className="text-lg font-serif italic text-primary mb-3">{s.heading}</h2>
              <p className="text-sm text-primary/60 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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

export default StaticPage;
