// ─────────────────────────────────────────────────────────────────────────────
// Pages/Profile/UserProfilePage.tsx
// Page de profil utilisateur, en mode double : propre profil (édition, bibliothèque,
// wishlist) ou profil public (bouton "Suivre").
// Sous-composant : EditProfileModal (modal d'édition du profil).
// Toute la logique de chargement et d'abonnement est dans useUserProfile().
// ─────────────────────────────────────────────────────────────────────────────

import { useUserProfile } from "../../hooks/useUserProfile";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import EditProfileModal from "./ModalEditUser";
import { Link } from "react-router";
import { useState } from "react";

/**
 * Page profil.
 * `showEditModal` est en état local (et non dans le hook) car c'est un état
 * purement UI sans effet réseau.
 */
function UserProfilePage() {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const {
    profile, setProfile,
    library, wishlist,
    loading, error,
    isOwnProfile,
    following, followLoading,
    handleFollow, load,
  } = useUserProfile();

  if (loading) {
    return <div className="max-w-5xl mx-auto px-6 py-20 text-center text-primary/40">Chargement...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={load} />;
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-primary/50 mb-4">Profil introuvable.</p>
        <Link to="/" className="text-secondary hover:underline text-sm">← Retour à l'accueil</Link>
      </div>
    );
  }

  const initials = profile.username.slice(0, 2).toUpperCase();
  const memberSince = new Date(profile.created_at).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const featuredBook = library[0] ?? null;
  const secondaryBooks = library.slice(1, 3);

  return (
    <div className="min-h-screen">

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSaved={(updated) => { setProfile(updated); setShowEditModal(false); }}
        />
      )}

      {/* ── Hero ── */}
      <div
        className="relative w-full"
        style={{ background: "linear-gradient(to bottom, #2c1f14dd, #1A1A2Eee), url('/hero-books.jpg') center/cover no-repeat" }}
      >
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-8 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-6 flex-wrap">

            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                {profile.profile_image ? (
                  <img src={profile.profile_image} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary/40 flex items-center justify-center text-white text-2xl font-bold">
                    {initials}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-serif italic text-white">{profile.username}</h1>
                  <span className="text-gold">✦</span>
                </div>
                {profile.bio && (
                  <p className="text-white/60 text-sm max-w-md leading-relaxed italic">"{profile.bio}"</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 mt-1">
              {isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-2.5 rounded-lg hover:bg-white/20 transition-colors"
                >
                  ✏ Éditer le profil
                </button>
              ) : user ? (
                <>
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`text-xs font-semibold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors ${
                      following
                        ? "bg-white/10 text-white border border-white/30 hover:bg-white/20"
                        : "bg-secondary text-white hover:bg-secondary-hover"
                    }`}
                  >
                    {following ? "Suivi ✓" : "+ Suivre"}
                  </button>
                  <Link
                    to={`/messages?to=${profile.id}&username=${encodeURIComponent(profile.username)}`}
                    className="text-xs font-semibold uppercase tracking-widest px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                  >
                    ✉ Message
                  </Link>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            {[
              { label: "abonnés", value: profile.followers },
              { label: "abonnements", value: profile.following },
              { label: "lectures", value: profile.reads },
              { label: "critiques", value: profile.reviews },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-white text-lg font-bold leading-none">{value}</p>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-10">

        <div className="flex flex-col gap-12">

          {isOwnProfile && (
            <section>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-medium mb-1">Ma Bibliothèque</p>
                  <h2 className="text-2xl font-serif italic text-primary">Lectures en cours & Finies</h2>
                </div>
                <Link to="/wishlist" className="text-xs uppercase tracking-widest text-primary/40 hover:text-secondary transition-colors">
                  Voir tout
                </Link>
              </div>

              {library.length === 0 ? (
                <p className="text-primary/40 text-sm italic">Aucune lecture en cours ou terminée.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-4">
                  {featuredBook && (
                    <Link to={`/books/${featuredBook.book.id}`} className="relative rounded-2xl overflow-hidden aspect-[3/4] group block">
                      {featuredBook.book.cover_image ? (
                        <img src={featuredBook.book.cover_image} alt={featuredBook.book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2c1f14] to-[#6b3a1a]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="bg-secondary text-white text-[9px] uppercase tracking-widest px-2 py-1 rounded mb-2 inline-block">
                          {featuredBook.status}
                        </span>
                        <p className="text-white font-serif italic text-lg leading-snug">{featuredBook.book.title}</p>
                        {featuredBook.book.authors[0] && (
                          <p className="text-white/60 text-xs mt-1">{featuredBook.book.authors[0].name}</p>
                        )}
                      </div>
                    </Link>
                  )}
                  <div className="flex flex-col gap-4">
                    {secondaryBooks.map((item) => (
                      <Link key={item.book.id} to={`/books/${item.book.id}`} className="flex-1 rounded-xl overflow-hidden relative group block">
                        {item.book.cover_image ? (
                          <img src={item.book.cover_image} alt={item.book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-xl flex items-end p-3">
                            <p className="text-primary text-xs font-serif italic line-clamp-2">{item.book.title}</p>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs font-semibold line-clamp-1 drop-shadow">{item.book.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {isOwnProfile && (
            <section>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-medium mb-1">À découvrir</p>
                  <h2 className="text-2xl font-serif italic text-primary">Ma Wishlist</h2>
                </div>
              </div>
              {wishlist.length === 0 ? (
                <p className="text-primary/40 text-sm italic">Votre wishlist est vide.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  {wishlist.slice(0, 4).map((item) => (
                    <Link key={item.book.id} to={`/books/${item.book.id}`} className="flex flex-col gap-2 group">
                      <div className="aspect-[2/3] bg-beige-medium rounded-xl overflow-hidden">
                        {item.book.cover_image ? (
                          <img src={item.book.cover_image} alt={item.book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/20 flex items-end p-3">
                            <p className="text-primary text-xs font-serif italic line-clamp-2">{item.book.title}</p>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-primary line-clamp-1">{item.book.title}</p>
                      {item.book.authors[0] && (
                        <p className="text-xs text-primary/40">{item.book.authors[0].name}</p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}

          <section>
            <p className="text-[10px] uppercase tracking-widest text-secondary font-medium mb-1">Historique</p>
            <h2 className="text-2xl font-serif italic text-primary mb-5">Activité récente</h2>
            <div className="bg-white rounded-2xl border border-beige-medium p-8 text-center">
              <p className="text-primary/30 text-sm italic">L'activité sera disponible prochainement.</p>
            </div>
          </section>
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-6">

          <div className="bg-white rounded-2xl border border-beige-medium p-5">
            <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-4 flex items-center gap-1.5">
              ✦ Auteurs favoris
            </p>
            {[
              { name: "Virginia Woolf", abbr: "VW" },
              { name: "Marcel Proust", abbr: "MP" },
              { name: "Sylvia Plath", abbr: "SP" },
            ].map((author) => (
              <div key={author.name} className="flex items-center gap-3 py-2 border-b border-beige-medium last:border-0">
                <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary text-[10px] font-bold shrink-0">
                  {author.abbr}
                </div>
                <p className="text-sm text-primary/70">{author.name}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-beige-medium p-5">
            <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-4 flex items-center gap-1.5">
              👥 Groupes rejoints
            </p>
            {profile.groups.length === 0 ? (
              <p className="text-primary/30 text-sm italic text-center py-2">Aucun groupe rejoint.</p>
            ) : (
              <div className="flex flex-col gap-2 mb-3">
                {profile.groups.slice(0, 3).map((group) => (
                  <Link
                    key={group.id}
                    to={`/groups/${group.id}`}
                    className="flex items-center justify-between text-sm text-primary/70 hover:text-secondary transition-colors py-1 border-b border-beige-medium last:border-0"
                  >
                    <span className="truncate">{group.name}</span>
                    <span className="text-primary/30 ml-2">→</span>
                  </Link>
                ))}
              </div>
            )}
            <Link
              to="/groups"
              className="block text-center text-[10px] uppercase tracking-widest border border-beige-medium text-primary/50 hover:border-secondary hover:text-secondary px-4 py-2.5 rounded-lg transition-colors"
            >
              Découvrir les groupes
            </Link>
          </div>

          <div
            className="rounded-2xl p-6 text-white"
            style={{ background: "linear-gradient(to bottom, #6B2737, #2c1f14)" }}
          >
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-5">Parcours de lecture</p>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Livres lus</p>
                <p className="text-3xl font-bold">{profile.reads}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Critiques</p>
                <p className="text-3xl font-bold">{profile.reviews}</p>
              </div>
            </div>
            <p className="text-white/40 text-xs italic leading-relaxed">
              « Membre du Cercle depuis {memberSince} »
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
