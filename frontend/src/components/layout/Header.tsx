import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = (
      event.currentTarget.elements.namedItem("search") as HTMLInputElement
    ).value.trim();
    if (search) navigate(`/books?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="bg-primary flex items-center justify-between px-8 py-3 w-full">
      {/* Logo */}
      <Link
        to="/"
        className="text-gold italic font-serif text-xl whitespace-nowrap hover:opacity-80 transition-opacity"
      >
        Le Cercle des lecteurs
      </Link>

      {/* Navigation principale */}
      <nav
        aria-label="Navigation principale"
        className="flex items-center gap-6"
      >
        {[
          { to: "/", label: "Accueil", end: true },
          { to: "/books", label: "Livres", end: false },
          { to: "/groups", label: "Groupes", end: false },
          { to: "/events", label: "Événements", end: false },
          { to: "/blog", label: "Blog", end: false },
        ].map(({ to, label, end }) => (
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

      {/* Droite : recherche + user */}
      <div className="flex items-center gap-3">
        <form
          role="search"
          onSubmit={handleSearch}
          className="flex items-center"
        >
          <div className="flex items-center bg-white/10 rounded-full px-3 py-1.5 gap-2 w-48 focus-within:ring-1 focus-within:ring-white/30 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white/50 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
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

        {user ? (
          <nav
            aria-label="Navigation utilisateur"
            className="flex items-center gap-3"
          >
            <Link
              to="/messages"
              aria-label="Messagerie"
              className="text-white/80 text-sm hover:text-gold transition-colors"
            >
              Messages
            </Link>
            <Link
              to={`/users/${user.id}`}
              aria-label="Mon profil"
              className="w-9 h-9 rounded-full  flex items-center justify-center hover:bg-white/20 transition"
            >
              <img
                src="/img/icon_profil.png"
                alt="icon"
                className="rounded-full object-cover bg-color-gold"
              />
            </Link>
            <button
              onClick={logout}
              aria-label="Se déconnecter"
              className="text-white/60 text-sm hover:text-gold transition-colors"
            >
              Déconnexion
            </button>
          </nav>
        ) : (
          <nav aria-label="Connexion" className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-white/80 text-sm hover:text-gold transition-colors"
            >
              Connexion
            </Link>
            <Link
              to="/signup"
              className="bg-secondary text-white text-sm px-4 py-1.5 rounded-full hover:bg-secondary-hover transition-colors min-h-[44px] flex items-center"
            >
              Inscription
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
