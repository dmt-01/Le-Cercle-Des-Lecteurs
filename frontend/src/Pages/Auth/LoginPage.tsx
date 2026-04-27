import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Panneau gauche — image + accroche ── */}
      <div
        className="hidden md:flex md:w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #2c1f14e0, #6B2737cc), url('/hero-books.jpg') center/cover no-repeat",
        }}
      >
        <Link to="/" className="text-gold italic font-sansSerif text-xl">
          Le Cercle des lecteurs
        </Link>

        <div>
          <h1 className="text-5xl font-serif leading-tight mb-6">
            Redécouvrez le plaisir<br />de la lecture lente.
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-sm mb-10">
            Un espace privé pour les bibliophiles exigeants. Partagez vos découvertes,
            construisez votre catalogue idéal et échangez avec des curateurs passionnés.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-secondary", "bg-gold", "bg-primary"].map((c, i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white/30 ${c}`} />
              ))}
            </div>
            <p className="text-white/60 text-xs uppercase tracking-widest">
              Rejoignez 5 000+ lecteurs
            </p>
          </div>
        </div>
      </div>

      {/* ── Panneau droit — formulaire ── */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-beige px-8 py-16">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-serif italic text-primary mb-2">
            Bienvenue au Cercle
          </h2>
          <p className="text-primary/50 text-sm mb-8">
            Connectez-vous pour accéder à votre bibliothèque personnelle.
          </p>

          {error && (
            <p role="alert" className="text-red-600 text-sm mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-primary/50 mb-1.5">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                required
                autoComplete="email"
                className="w-full bg-white border border-beige-medium rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-[10px] uppercase tracking-widest text-primary/50">
                  Mot de passe
                </label>
                <span className="text-xs text-primary/40 cursor-not-allowed" title="Disponible prochainement">
                  Oublié ?
                </span>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-white border border-beige-medium rounded-xl px-4 py-3.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-secondary rounded"
              />
              <span className="text-sm text-primary/60">Se souvenir de moi</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white font-semibold text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-secondary-hover transition-colors disabled:opacity-50 min-h-[52px] mt-2"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-primary/50 mt-8">
            Pas encore membre ?{" "}
            <Link to="/signup" className="text-secondary font-semibold hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default LoginPage;
