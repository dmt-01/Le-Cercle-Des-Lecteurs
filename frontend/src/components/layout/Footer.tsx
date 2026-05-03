import { Link } from "react-router";

function Footer() {
  return (
    <footer className="bg-primary px-6 lg:px-8 py-8 lg:py-10">
      <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">

        {/* Logo + copyright */}
        <div className="flex flex-col gap-4 max-w-xs text-center lg:text-left">
          <Link
            to="/"
            className="text-gold italic font-sansSerif text-xl hover:opacity-80 transition-opacity"
          >
            Le Cercle des lecteurs
          </Link>
          <p className="text-white/40 text-xs uppercase tracking-widest leading-relaxed">
            © 2026 Le Cercle des lecteurs. Conçu pour le bibliophile moderne. Tous
            droits réservés.
          </p>
        </div>

        {/* Légal + Support — côte à côte sur mobile et desktop */}
        <div className="flex gap-12">
          {/* Légal */}
          <div className="flex flex-col gap-3">
            <p className="text-white/50 text-xs uppercase tracking-widest font-medium">
              Légal
            </p>
            <nav aria-label="Liens légaux" className="flex flex-col gap-2">
              <Link to="/about" className="text-white/80 text-sm hover:text-gold transition-colors">
                Mentions Légales
              </Link>
              <Link to="/privacy" className="text-white/80 text-sm hover:text-gold transition-colors">
                Confidentialité
              </Link>
              <Link to="/terms" className="text-white/80 text-sm hover:text-gold transition-colors">
                Conditions générales d'utilisation
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-3">
            <p className="text-white/50 text-xs uppercase tracking-widest font-medium">
              Support
            </p>
            <nav aria-label="Liens support" className="flex flex-col gap-2">
              <Link to="/contact" className="text-white/80 text-sm hover:text-gold transition-colors">
                Contactez-nous
              </Link>
              <Link to="/help" className="text-white/80 text-sm hover:text-gold transition-colors">
                Aide
              </Link>
            </nav>
          </div>
        </div>

        {/* Retour en haut — icône seule sur mobile/tablette, icône + texte sur desktop */}
        <a
          href="#root"
          aria-label="Retour en haut de page"
          className="flex items-center gap-2 text-white/50 hover:text-gold transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <span className="hidden lg:inline text-sm">Retour en haut de page</span>
        </a>

      </div>
    </footer>
  );
}

export default Footer;
