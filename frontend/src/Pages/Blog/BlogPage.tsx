// ─────────────────────────────────────────────────────────────────────────────
// Pages/Blog/BlogPage.tsx
// Page liste des articles de blog.
// Mise en page : hero (premier article) + grille + sidebar.
// Filtrage par catégorie côté client via useBlog().
// ─────────────────────────────────────────────────────────────────────────────

import ErrorMessage from "../../components/ui/ErrorMessage";
import { useBlog } from "../../hooks/useBlog";
import readingTime from "./ReadingTime";
import { Link } from "react-router";

function BlogPage() {
  const {
    loading,
    error,
    activeCategory,
    setActiveCategory,
    categories,
    featured,
    rest,
    load,
  } = useBlog();

  return (
    <div className="min-h-screen">
      {/* ── Hero — article à la une ── */}
      {featured && (
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div
            className="aspect-[4/3] rounded-2xl"
            style={{
              background: `url(/img/template_blog.png) center/cover no-repeat`,
            }}
          />
          <div className="flex flex-col gap-5">
            {featured.category && (
              <p className="text-[10px] uppercase tracking-widest text-secondary font-medium">
                {featured.category}
              </p>
            )}
            <h1 className="text-4xl font-serif italic text-primary leading-tight">
              {featured.title}
            </h1>
            {featured.content && (
              <p className="text-primary/60 text-sm leading-relaxed italic">
                "{featured.content.slice(0, 180).trimEnd()}…"
              </p>
            )}
            <Link
              to={`/blog/${featured.id}`}
              className="bg-secondary text-white text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-full w-fit hover:bg-secondary-hover transition-colors"
            >
              Lire la suite →
            </Link>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-primary/40 text-sm text-center py-12">
          Chargement...
        </p>
      )}

      {error && <ErrorMessage message={error} onRetry={load} />}

      {/* ── Dernières publications + sidebar ── */}
      {!loading && !error && (
        <div className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-10">
          {/* Articles */}
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="text-2xl font-serif italic text-primary">
                Dernières Publications
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeCategory === null
                      ? "bg-primary text-white"
                      : "bg-white border border-beige-medium text-primary/50 hover:border-primary hover:text-primary"
                  }`}
                >
                  Tous
                </button>
                {categories.map((categorie) => (
                  <button
                    key={categorie}
                    onClick={() => setActiveCategory(categorie)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === categorie
                        ? "bg-primary text-white"
                        : "bg-white border border-beige-medium text-primary/50 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {categorie}
                  </button>
                ))}
              </div>
            </div>

            {rest.length === 0 ? (
              <p className="text-primary/40 text-sm italic">
                Aucun autre article pour le moment.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="flex flex-col gap-3 group"
                  >
                    <div
                      className="aspect-[16/9] rounded-xl"
                      style={{
                        background: `url(/img/template_blog.png) center/cover no-repeat`,
                      }}
                    />
                    {post.category && (
                      <span className="text-[9px] uppercase tracking-widest text-secondary font-semibold">
                        {post.category}
                      </span>
                    )}
                    <h3 className="text-base font-serif italic text-primary leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.content && (
                      <p className="text-xs text-primary/50 leading-relaxed line-clamp-2">
                        {post.content.slice(0, 120)}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-primary/40 uppercase tracking-widest">
                      <span>{post.author.username}</span>
                      <span>·</span>
                      <span>{readingTime(post.content)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-beige-medium p-5">
              <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-4">
                Lecture du moment
              </p>
              <div className="flex gap-3 mb-4">
                <div
                  className="w-14 h-20 rounded-lg"
                  style={{
                    background: `url(/img/template_book.png) center/cover no-repeat`,
                  }}
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-serif italic text-primary leading-snug">
                      Les Illusions Perdues
                    </p>
                    <p className="text-xs text-primary/40">Honoré de Balzac</p>
                    <p className="text-gold text-sm mt-1">★★★★</p>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-secondary font-semibold border border-secondary/30 px-2 py-1 rounded w-fit cursor-not-allowed">
                    Acheter
                  </span>
                </div>
              </div>
              <p className="text-xs text-primary/50 italic leading-relaxed">
                "Une plongée brutale et magnifique dans les rouages de la presse
                parisienne du XIXe siècle."
              </p>
            </div>

            <div className="rounded-2xl p-6 flex flex-col gap-4 bg-secondary">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                Newsletter
              </p>
              <h3 className="text-xl font-serif italic text-white leading-snug">
                La Lettre du Cercle
              </h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Chaque dimanche matin, recevez une sélection de lectures, des
                entretiens inédits et l'actualité des salons littéraires.
              </p>
              <input
                type="email"
                placeholder="votre@email.fr"
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button className="bg-beige-light text-secondary text-xs font-semibold uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-secondary-hover transition-colors">
                S'abonner
              </button>
              <p className="text-white/30 text-[9px] text-center">
                Aucun spam, uniquement de la littérature.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-beige-medium p-5">
              <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-4">
                Navigation Thématique
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "#Classiques",
                  "#Poésie",
                  "#Essais",
                  "#Manuscrits",
                  "#Bibliophile",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-primary/50 border border-beige-medium px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
