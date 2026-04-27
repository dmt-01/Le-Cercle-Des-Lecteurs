import { useBlogDetail } from "../../hooks/useBlogDetail";
import { Link } from "react-router";

function readingTime(content?: string | null) {
  if (!content) return "1 min de lecture";
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min de lecture`;
}

function BlogDetailPage() {
  const { post, loading, comment, setComment } = useBlogDetail();

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-primary/40">
        Chargement...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-primary/50 mb-4">Article introuvable.</p>
        <Link to="/blog" className="text-secondary hover:underline text-sm">
          ← Retour au blog
        </Link>
      </div>
    );
  }

  const date = new Date(post.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const initials = post.author.username.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-16">
        {/* ── Fil + temps de lecture ── */}
        <div className="flex items-center gap-3 mb-8">
          {post.category ? (
            <span className="text-[9px] uppercase tracking-widest text-secondary font-semibold border border-secondary/30 px-3 py-1 rounded">
              {post.category}
            </span>
          ) : (
            <Link
              to="/blog"
              className="text-[9px] uppercase tracking-widest text-primary/40 hover:text-secondary transition-colors"
            >
              ← Blog
            </Link>
          )}
          <span className="text-[9px] uppercase tracking-widest text-primary/30">
            {readingTime(post.content)}
          </span>
        </div>

        {/* ── Titre ── */}
        <h1 className="text-4xl md:text-5xl font-serif italic text-primary leading-tight mb-8">
          {post.title}
        </h1>

        {/* ── Auteur + date ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-sm font-bold shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">
                {post.author.username}
              </p>
              <p className="text-xs text-primary/40">Critique Curatrice</p>
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-primary/40">
            Publié le {date}
          </p>
        </div>

        {/* ── Image hero ── */}
        <div className="w-full aspect-[16/7] rounded-2xl bg-gradient-to-br from-[#1a2c1a] to-[#2c5c3a] mb-10 shadow-lg" />

        {/* ── Contenu ── */}
        {post.content ? (
          <div className="space-y-5 mb-12">
            {post.content.split("\n\n").map((para, index) => (
              <p
                key={index}
                className="text-primary/70 text-sm leading-relaxed"
              >
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-primary/40 italic mb-12">
            Contenu non disponible.
          </p>
        )}

        {/* ── À propos de l'auteur ── */}
        <div className="bg-beige rounded-2xl p-6 flex items-start gap-4 mb-12">
          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-1">
              À propos de {post.author.username}
            </p>
            <p className="text-sm text-primary/60 leading-relaxed">
              Membre actif du Cercle des lecteurs, passionné de littérature et
              de culture.
            </p>
            <Link
              to={`/users/${post.author.id}`}
              className="inline-block mt-3 bg-primary text-white text-[9px] uppercase tracking-widest font-semibold px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
            >
              Suivre {post.author.username}
            </Link>
          </div>
        </div>

        {/* ── Commentaires ── */}
        <div className="border-t border-beige-medium pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif italic text-primary">
              Commentaires
            </h2>
            <span className="text-[10px] uppercase tracking-widest text-primary/40">
              Tri par récent
            </span>
          </div>

          <p className="text-primary/40 text-sm italic mb-6">
            Les commentaires seront disponibles prochainement.
          </p>

          <div>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Partagez votre avis sur cet article..."
              rows={3}
              className="w-full bg-beige border border-beige-medium rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30 resize-none mb-3"
            />
            <div className="flex justify-end">
              <button
                disabled
                className="bg-primary/20 text-primary/40 text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-xl cursor-not-allowed"
              >
                Publier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
