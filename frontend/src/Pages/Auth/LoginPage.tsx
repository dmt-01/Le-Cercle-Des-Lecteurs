// ─────────────────────────────────────────────────────────────────────────────
// Pages/Auth/LoginPage.tsx
// Page de connexion au Cercle.
// Mise en page deux colonnes : accroche visuelle à gauche, formulaire à droite.
// Redirige vers la page d'origine après connexion (ex: si redirigé depuis /events).
// ─────────────────────────────────────────────────────────────────────────────

import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

/**
 * Page de connexion.
 * Lit location.state.from pour rediriger vers la page que l'utilisateur
 * tentait d'atteindre avant d'être renvoyé vers /login.
 */
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Récupère la page de destination après connexion (défaut : accueil)
  const from = (location.state as { from?: string })?.from ?? "/";

  // État du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Soumet le formulaire de connexion.
   * En cas de succès, redirige vers la page demandée initialement.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        className="hidden md:flex md:w-1/2 flex-col justify-center align-center p-12 text-white relative overflow-hidden bg-[#4A0E0E] z-1"
      >
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(58, 6, 18, 1), rgba(73, 17, 17, 0), rgba(73, 17, 17, 0)), url(/img/template_connexion.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
        }}
      ></div>

        <div>
          <h1 className="text-6xl font-serif leading-tight mb-6">
            Redécouvrez le plaisir de la lecture lente.
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm mb-10">
            Un espace privé pour les bibliophiles exigeants. Partagez vos
            découvertes, construisez votre catalogue idéal et échangez avec des
            curateurs passionnés.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-secondary", "bg-gold", "bg-primary"].map(
                (colorClass, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 border-white/30 ${colorClass}`}
                  />
                ),
              )}
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

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] uppercase tracking-widest text-primary/50 mb-1.5"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="votre@email.fr"
                required
                autoComplete="email"
                className="w-full bg-white border border-beige-medium rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-[10px] uppercase tracking-widest text-primary/50"
                >
                  Mot de passe
                </label>
                <span
                  className="text-xs text-primary/40 cursor-not-allowed"
                  title="Disponible prochainement"
                >
                  Oublié ?
                </span>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-white border border-beige-medium rounded-xl px-4 py-3.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="w-4 h-4 accent-secondary rounded"
              />
              <span className="text-sm text-primary/60">
                Se souvenir de moi
              </span>
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
            <Link
              to="/signup"
              className="text-secondary font-semibold hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
