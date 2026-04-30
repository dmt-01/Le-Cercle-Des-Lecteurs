import { apiFetch } from "../../../services/api";
import type { Group } from "../../../types";
import { useState } from "react";

function CreateGroupModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (group: Group) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await apiFetch("/groups", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          accessClub: true,
        }),
      });
      onCreated(res.data);
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue");
    }
    setCreating(false);
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
        <h2 className="text-2xl font-serif italic text-primary mb-6">
          Créer un cercle
        </h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-primary/50 mb-1.5">
              Nom du cercle <span className="text-secondary">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex : Les Amateurs de Proust"
              required
              maxLength={100}
              className="w-full bg-beige border border-beige-medium rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-primary/50 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Décrivez l'esprit de votre cercle..."
              rows={3}
              maxLength={500}
              className="w-full bg-beige border border-beige-medium rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30 resize-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-beige-medium text-primary text-sm font-semibold py-3 rounded-xl hover:border-secondary/40 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="flex-1 bg-secondary text-white text-sm font-semibold py-3 rounded-xl hover:bg-secondary-hover transition-colors disabled:opacity-50"
            >
              {creating ? "Création..." : "Créer le cercle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupModal;