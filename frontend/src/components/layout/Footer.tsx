import { Link } from "react-router";

function Footer() {
  return (
    <footer className="bg-primary px-8 py-10 flex items-start justify-between gap-12">

      {/* Gauche — Logo + copyright */}
      <div className="flex flex-col gap-4 max-w-xs">
        <Link to="/" className="text-gold italic font-sansSerif text-xl hover:opacity-80 transition-opacity">
          Le Cercle des lecteurs
        </Link>
        <p className="text-white/40 text-xs uppercase tracking-widest leading-relaxed">
          © 2026 Le Cercle des lecteurs. Conçu pour le bibliophile moderne. Tous droits réservés.
        </p>
      </div>

      {/* Centre — Légal */}
      <div className="flex flex-col gap-3">
        <p className="text-white/50 text-xs uppercase tracking-widest font-medium">
          Légal
        </p>
        <nav aria-label="Liens légaux" className="flex flex-col gap-2">
          <Link to="/legal" className="text-white/80 text-sm hover:text-gold transition-colors">
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

      {/* Droite — Support */}
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

    </footer>
  );
}

export default Footer;