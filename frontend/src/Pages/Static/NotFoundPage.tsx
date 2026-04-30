import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[10px] uppercase tracking-widest text-secondary font-medium mb-4">
        Erreur 404
      </p>
      <h1 className="text-7xl font-serif italic text-primary mb-4 leading-none">
        Page introuvable
      </h1>
      <p className="text-primary/50 text-sm leading-relaxed max-w-sm mb-10">
        La page que vous cherchez n'existe pas ou a été déplacée. Retournez à
        l'accueil pour continuer votre lecture.
      </p>
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="bg-primary text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-primary/80 transition-colors"
          aria-label="Retour à l'accueil"
        >
          Retour à l'accueil
        </Link>
        <Link
          to="/books"
          className="border border-beige-medium text-primary/60 text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full hover:border-secondary hover:text-secondary transition-colors"
          aria-label="Parcourir les livres"
        >
          Parcourir les livres
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
