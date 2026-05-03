import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Accueil", end: true },
  { to: "/books", label: "Livres", end: false },
  { to: "/groups", label: "Groupes", end: false },
  { to: "/events", label: "Événements", end: false },
  { to: "/blog", label: "Blog", end: false },
];

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Ferme le menu à chaque changement de page
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = (
      event.currentTarget.elements.namedItem("search") as HTMLInputElement
    ).value.trim();
    if (search) navigate(`/books?search=${encodeURIComponent(search)}`);
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded"
      >
        Aller au contenu principal
      </a>

      <header className="bg-primary w-full relative z-40">
        <div className="flex items-center px-4 lg:px-30 py-3 gap-4">

          {/* ── Burger (mobile uniquement) ── */}
          <button
            className="lg:hidden text-white/80 hover:text-gold transition-colors p-1 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* ── Logo — centré sur mobile, aligné à gauche sur desktop ── */}
          <Link
            to="/"
            className="text-gold italic font-serif text-xl whitespace-nowrap hover:opacity-80 transition-opacity absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          >
            Le Cercle des lecteurs
          </Link>

          {/* ── Navigation principale (desktop uniquement) ── */}
          <nav
            aria-label="Navigation principale"
            className="hidden lg:flex items-center justify-center gap-6 flex-1"
          >
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `text-sm transition-colors ${
                    isActive
                      ? "text-gold border-b border-gold pb-0.5 font-medium"
                      : "text-white/80 hover:text-gold"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Droite : recherche + actions utilisateur ── */}
          <div className="ml-auto flex items-center gap-3">

            {/* Recherche — desktop uniquement */}
            <form role="search" onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="flex items-center bg-white/10 rounded-full px-3 py-1.5 gap-2 w-48 focus-within:ring-1 focus-within:ring-white/30 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="search"
                  name="search"
                  placeholder="Rechercher..."
                  aria-label="Rechercher un livre"
                  className="bg-transparent text-white/70 text-sm outline-none placeholder-white/40 w-full"
                />
              </div>
            </form>

            {/* Actions utilisateur (desktop uniquement — présentes dans le menu mobile) */}
            {user ? (
              <nav aria-label="Navigation utilisateur" className="hidden lg:flex items-center gap-3">
                <Link to="/messages" aria-label="Messagerie" className="text-white/80 text-sm hover:text-gold transition-colors">
                  Messages
                </Link>
                <Link to={`/users/${user.id}`} aria-label="Mon profil" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <img src="/img/icon_profil.png" alt="Profil" className="rounded-full object-cover" />
                </Link>
                <button onClick={logout} aria-label="Se déconnecter" className="text-white/60 text-sm hover:text-gold transition-colors">
                  Déconnexion
                </button>
              </nav>
            ) : (
              <nav aria-label="Connexion" className="hidden lg:flex items-center gap-3">
                <Link to="/login" className="text-white/80 text-sm hover:text-gold transition-colors">
                  Connexion
                </Link>
                <Link to="/signup" className="bg-secondary text-white text-sm px-4 py-1.5 rounded-full hover:bg-secondary-hover transition-colors min-h-[44px] flex items-center">
                  Inscription
                </Link>
              </nav>
            )}
          </div>
        </div>

        {/* ── Menu mobile déroulant ── */}
        {menuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Menu mobile"
            className="lg:hidden border-t border-white/10 px-6 py-4 flex flex-col"
          >
            {/* Liens de navigation */}
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-widest py-3.5 border-b border-white/10 transition-colors ${
                    isActive ? "text-gold font-medium" : "text-white/80 hover:text-gold"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Liens utilisateur */}
            <div className="mt-2 flex flex-col">
              {user ? (
                <>
                  <Link to="/messages" className="text-sm uppercase tracking-widest text-white/80 hover:text-gold py-3.5 border-b border-white/10 transition-colors">
                    Messages
                  </Link>
                  <Link to={`/users/${user.id}`} className="text-sm uppercase tracking-widest text-white/80 hover:text-gold py-3.5 border-b border-white/10 transition-colors">
                    Mon profil
                  </Link>
                  <button onClick={logout} className="text-left text-sm uppercase tracking-widest text-white/60 hover:text-gold py-3.5 transition-colors">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm uppercase tracking-widest text-white/80 hover:text-gold py-3.5 border-b border-white/10 transition-colors">
                    Connexion
                  </Link>
                  <Link to="/signup" className="text-sm uppercase tracking-widest text-white/80 hover:text-gold py-3.5 transition-colors">
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

export default Header;
