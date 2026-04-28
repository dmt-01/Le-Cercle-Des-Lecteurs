// ─────────────────────────────────────────────────────────────────────────────
// Pages/Messages/MessagesPage.tsx
// Page de messagerie privée.
// Mise en page deux colonnes : liste des conversations (sidebar) + zone de chat.
// Sur mobile la sidebar et le chat s'alternent (selected contrôle la vue active).
// Toute la logique (chargement, envoi, groupement par jour) est dans useMessages().
// ─────────────────────────────────────────────────────────────────────────────

import ErrorMessage from "../../components/ui/ErrorMessage";
import { useMessages } from "../../hooks/useMessages";

/** Renvoie les deux premières lettres d'un nom en majuscules, pour les avatars. */
function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

/** Formate une heure de message en "HH:MM" pour l'affichage sous chaque bulle. */
function timeLabel(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formate la date du dernier message d'une conversation pour la sidebar.
 * Aujourd'hui → heure, hier → "Hier", sinon → "j mois" (ex : "3 janv.").
 */
function convTime(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Hier";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

/** Page de messagerie : sidebar conversations + zone de chat en temps réel. */
function MessagesPage() {
  const {
    selected,
    setSelected,
    text,
    setText,
    loading,
    error,
    sending,
    filter,
    setFilter,
    filtered,
    grouped,
    handleSend,
    load,
    endRef,
  } = useMessages();

  return (
    <div
      className="max-w-5xl mx-auto px-6 py-8"
      style={{ height: "calc(100vh - 120px)" }}
    >
      <div className="h-full flex gap-5">
        {/* ── Sidebar — liste des conversations ── */}
        <div
          className={`w-full md:w-72 shrink-0 flex-col bg-white rounded-2xl border border-beige-medium overflow-hidden ${selected ? "hidden md:flex" : "flex"}`}
        >
          <div className="p-4 border-b border-beige-medium">
            <h1 className="text-xl font-serif italic text-primary mb-3">
              Messages
            </h1>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 text-xs">
                🔍
              </span>
              <input
                type="text"
                placeholder="Filtrer les discussions"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="w-full bg-beige border border-beige-medium rounded-xl pl-8 pr-3 py-2 text-xs text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && (
              <p className="text-primary/40 text-xs text-center py-6">
                Chargement...
              </p>
            )}
            {error && <ErrorMessage message={error} onRetry={load} />}
            {!loading && !error && filtered.length === 0 && (
              <p className="text-primary/40 text-xs italic text-center py-6">
                Aucune conversation.
              </p>
            )}
            {filtered.map((conv) => {
              const isActive = selected?.partner.id === conv.partner.id;
              return (
                <button
                  key={conv.partner.id}
                  onClick={() => setSelected(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-beige transition-colors ${
                    isActive ? "bg-beige border-r-2 border-secondary" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xs font-bold shrink-0">
                    {initials(conv.partner.username)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="text-sm font-semibold text-primary truncate">
                        {conv.partner.username}
                      </p>
                      <p className="text-[10px] text-primary/30 shrink-0 ml-2">
                        {convTime(conv.last_message.sent_at)}
                      </p>
                    </div>
                    <p className="text-xs text-primary/40 truncate">
                      {conv.last_message.is_mine && "Vous : "}
                      {conv.last_message.content}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Zone de chat ── */}
        {selected ? (
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-beige-medium overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-beige-medium">
              <button
                onClick={() => setSelected(null)}
                className="md:hidden text-primary/40 hover:text-secondary transition-colors mr-1 text-lg leading-none"
              >
                ←
              </button>
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-sm font-bold shrink-0">
                {initials(selected.partner.username)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">
                  {selected.partner.username}
                </p>
                <p className="text-[9px] uppercase tracking-widest text-secondary">
                  Membre
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col">
              {grouped.length === 0 && (
                <p className="text-primary/30 text-xs italic text-center m-auto">
                  Démarrez la conversation.
                </p>
              )}

              {grouped.map(({ date, msgs }) => (
                <div key={date}>
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-beige-medium" />
                    <span className="text-[9px] uppercase tracking-widest text-primary/30">
                      {date}
                    </span>
                    <div className="flex-1 h-px bg-beige-medium" />
                  </div>

                  <div className="flex flex-col gap-3">
                    {msgs.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${msg.is_mine ? "flex-row-reverse" : ""}`}
                      >
                        {!msg.is_mine && (
                          <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-[10px] font-bold shrink-0">
                            {initials(selected.partner.username)}
                          </div>
                        )}
                        <div
                          className={`flex flex-col gap-1 max-w-[65%] ${msg.is_mine ? "items-end" : ""}`}
                        >
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              msg.is_mine
                                ? "bg-primary text-white rounded-br-sm"
                                : "bg-beige text-primary rounded-bl-sm"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <p className="text-[10px] text-primary/30">
                            {timeLabel(msg.sent_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="px-4 py-3 border-t border-beige-medium flex items-center gap-3">
              <button className="text-primary/30 hover:text-secondary transition-colors text-lg leading-none">
                ⊕
              </button>
              <input
                type="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Écrire votre message..."
                className="flex-1 bg-beige border border-beige-medium rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
              <button
                onClick={handleSend}
                disabled={!text.trim() || sending}
                className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-xs hover:bg-primary/80 transition-colors disabled:opacity-40 shrink-0"
              >
                ▶
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border border-beige-medium">
            {!loading && (
              <p className="text-primary/30 text-sm italic">
                Sélectionnez une conversation
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
