import { getErrorMessage } from "../../../utils/errors";
import { apiFetch } from "../../../services/api";
import { useState } from "react";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

/** Modal de création d'un nouveau livre dans la bibliothèque. */
function ModalAddBook({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await apiFetch("/books", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          coverImage: coverImage.trim() || undefined,
          publicationDate: publicationDate || undefined,
        }),
      });
      onCreated();
    } catch (err) {
      setError(getErrorMessage(err, "Impossible d'ajouter le livre."));
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif italic text-primary">
            Ajouter un livre
          </h2>
          <button
            onClick={onClose}
            className="text-primary/40 hover:text-primary text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-primary/40 mb-1.5">
              Titre <span className="text-secondary">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex : Les Misérables"
              aria-label="Titre du livre"
              className="w-full bg-beige rounded-lg px-4 py-2.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-primary/40 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Résumé ou présentation du livre..."
              aria-label="Description du livre"
              className="w-full bg-beige rounded-lg px-4 py-2.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30 resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-primary/40 mb-1.5">
              URL de la couverture (optionnel)
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              aria-label="URL de la couverture (optionnel)"
              className="w-full bg-beige rounded-lg px-4 py-2.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-primary/40 mb-1.5">
              Date de publication (optionnel)
            </label>
            <input
              type="date"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              className="w-full bg-beige rounded-lg px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30"
              aria-label="Date de publication (optionnel)"
            />
          </div>

          {error && <p className="text-secondary text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-beige text-primary text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-beige-medium transition-colors"
              aria-label="Annuler l'ajout d'un nouveau livre"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 bg-secondary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-secondary-hover transition-colors disabled:opacity-50"
              aria-label="Ajouter le livre"
            >
              {loading ? "Ajout en cours..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAddBook;
