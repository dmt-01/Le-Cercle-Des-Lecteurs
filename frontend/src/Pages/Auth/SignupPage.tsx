import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptNewsletter, setAcceptNewsletter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordChecks = {
    length:    password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    symbol:    /[^A-Za-z0-9]/.test(password),
  };
  
  const passwordValid = Object.values(passwordChecks).every(Boolean);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!acceptTerms) {
      setError("Vous devez accepter les Conditions Générales pour continuer.");
      return;
    }
    if (!passwordValid) {
      setError("Le mot de passe ne respecte pas les critères requis.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signup(username, email, password);
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
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
          <span className="border border-white/30 text-white/60 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block">
            Invitation exclusive
          </span>
          <h1 className="text-5xl font-serif italic leading-tight mb-6">
            Rejoignez le salon<br />littéraire numérique.
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-sm mb-10">
            Un espace hors du temps pour ceux qui considèrent la lecture comme un art de vivre.
            Partagez vos découvertes, cultivez votre bibliothèque idéale.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-secondary", "bg-gold", "bg-primary"].map((c, i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white/30 ${c}`} />
              ))}
            </div>
            <p className="text-white/60 text-xs uppercase tracking-widest">
              + de 10k membres actifs
            </p>
          </div>
        </div>
      </div>

      {/* ── Panneau droit — formulaire ── */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-beige px-8 py-16">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-serif italic text-primary mb-2">
            Créer votre compte
          </h2>
          <p className="text-primary/50 text-sm mb-8">
            Déjà membre ?{" "}
            <Link to="/login" className="text-secondary font-semibold hover:underline">
              S'identifier
            </Link>
          </p>

          {error && (
            <p role="alert" className="text-red-600 text-sm mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="username" className="block text-[10px] uppercase tracking-widest text-primary/50 mb-1.5">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex. Victor_H"
                required
                autoComplete="username"
                className="w-full bg-white border border-beige-medium rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-primary/50 mb-1.5">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                autoComplete="email"
                className="w-full bg-white border border-beige-medium rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] uppercase tracking-widest text-primary/50 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                required
                autoComplete="new-password"
                className="w-full bg-white border border-beige-medium rounded-xl px-4 py-3.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
              {passwordTouched && (
                <ul className="mt-2.5 flex flex-col gap-1.5">
                  {[
                    { ok: passwordChecks.length,    label: "12 caractères minimum" },
                    { ok: passwordChecks.uppercase,  label: "1 lettre majuscule" },
                    { ok: passwordChecks.lowercase,  label: "1 lettre minuscule" },
                    { ok: passwordChecks.symbol,     label: "1 symbole (ex. ! @ # $)" },
                  ].map(({ ok, label }) => (
                    <li key={label} className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${ok ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary/30"}`}>
                        {ok ? "✓" : "·"}
                      </span>
                      <span className={`text-xs transition-colors ${ok ? "text-green-600" : "text-primary/40"}`}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-secondary rounded shrink-0"
                />
                <span className="text-xs text-primary/60 leading-relaxed">
                  J'accepte les{" "}
                  <Link to="/terms" className="underline hover:text-secondary">Conditions Générales</Link>
                  {" "}et la{" "}
                  <Link to="/privacy" className="underline hover:text-secondary">Politique de Confidentialité</Link>.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptNewsletter}
                  onChange={(e) => setAcceptNewsletter(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-secondary rounded shrink-0"
                />
                <span className="text-xs text-primary/60 leading-relaxed">
                  J'accepte de recevoir les lettres d'information du Cercle. (optionnel)
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white font-semibold text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-secondary-hover transition-colors disabled:opacity-50 min-h-[52px] mt-2"
            >
              {loading ? "Inscription..." : "Ouvrir les portes du Cercle →"}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}

export default SignupPage;
