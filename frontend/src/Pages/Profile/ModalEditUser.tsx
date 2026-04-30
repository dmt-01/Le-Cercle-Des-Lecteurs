import type { PublicProfile } from "../../types";
import { apiFetch } from "../../services/api";
import { useState } from "react";

/**
 * Modal permettant à l'utilisateur de modifier son nom et sa biographie.
 * Appelle PUT /users/me et remonte le profil mis à jour via `onSaved`.
 */
function EditProfileModal({
  profile,
  onClose,
  onSaved,
}: {
  profile: PublicProfile;
  onClose: () => void;
  onSaved: (updated: PublicProfile) => void;
}) {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify({ username: username.trim(), bio: bio.trim() || undefined }),
      });
      onSaved({ ...profile, username: res.data.username, bio: res.data.bio ?? undefined });
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue");
    }
    setSaving(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-2xl font-serif italic text-primary mb-6">Éditer le profil</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-primary/50 mb-1.5">
              Nom d'utilisateur <span className="text-secondary">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              maxLength={50}
              className="w-full bg-beige border border-beige-medium rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30"
              aria-label="Nom de l'utilisateur"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-primary/50 mb-1.5">
              Biographie
            </label>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Parlez-nous de vous et de vos lectures..."
              aria-label="Biographie"
              rows={4}
              maxLength={300}
              className="w-full bg-beige border border-beige-medium rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30 resize-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-beige-medium text-primary text-sm font-semibold py-3 rounded-xl hover:border-secondary/40 transition-colors"
              aria-label="Annuler les modifications et fermer la fenêtre"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || !username.trim()}
              className="flex-1 bg-secondary text-white text-sm font-semibold py-3 rounded-xl hover:bg-secondary-hover transition-colors disabled:opacity-50"
              aria-label="Enregistrer les modifications"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;