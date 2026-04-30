// ─────────────────────────────────────────────────────────────────────────────
// hooks/useMessages.ts
// Hook de la page de messagerie privée.
//
// Gère deux niveaux de données :
//   • La liste des conversations (sidebar gauche)
//   • Les messages de la conversation sélectionnée (zone de chat droite)
//
// Les messages sont regroupés par jour pour afficher des séparateurs de date.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../utils/errors";
import { useSearchParams } from "react-router";
import { apiFetch } from "../services/api";

/** Résumé d'une conversation affiché dans la sidebar */
export type Conversation = {
  partner: { id: string; username: string; profileImage?: string };
  last_message: {
    content: string;
    sent_at: string;
    read: boolean;
    is_mine: boolean;
  };
};

/** Message individuel dans le fil de discussion */
export type ChatMessage = {
  id: string;
  content: string;
  sent_at: string;
  read: boolean;
  /** true si le message a été envoyé par l'utilisateur courant */
  is_mine: boolean;
  sender: { id: string; username: string };
};

/**
 * Calcule le label de séparation de jour pour une date donnée.
 * Retourne "Aujourd'hui", "Hier" ou la date formatée en français.
 */
function dayLabel(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Hier";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

/**
 * Regroupe une liste de messages par jour pour afficher des séparateurs.
 * Retourne un tableau de { date: label, msgs: messages[] }.
 */
function groupByDay(messages: ChatMessage[]) {
  const groups: { date: string; msgs: ChatMessage[] }[] = [];
  for (const msg of messages) {
    const label = dayLabel(msg.sent_at);
    const last = groups[groups.length - 1];
    // Si le message appartient au même jour que le précédent, on l'ajoute au groupe
    if (!last || last.date !== label) {
      groups.push({ date: label, msgs: [msg] });
    } else {
      last.msgs.push(msg);
    }
  }
  return groups;
}

/**
 * Fournit toutes les données et handlers pour la page de messagerie (MessagesPage).
 *
 * • conversations / filtered — liste complète et liste filtrée par le champ de recherche
 * • selected / setSelected   — conversation actuellement ouverte dans le chat
 * • grouped                  — messages de la conversation active regroupés par jour
 * • filter / setFilter       — texte de filtrage dans la sidebar
 * • endRef                   — ref attachée au bas du fil pour le scroll automatique
 * • handleSend               — envoie un message et met à jour localement la conversation
 * • load                     — recharge la liste des conversations
 */
export function useMessages() {
  const [searchParams] = useSearchParams();

  // 1. STATE — Liste des conversations (sidebar)
  const [conversations, setConversations] = useState<Conversation[]>([]);
  // 1.1 STATE — Conversation sélectionnée (zone de chat)
  const [selected, setSelected] = useState<Conversation | null>(null);
  // 1.2 STATE — Partenaire en attente (nouvelle conv depuis un profil, pas encore dans la liste)
  const [pendingPartner, setPendingPartner] = useState<{ id: string; username: string } | null>(null);
  // 1.3 STATE — Messages de la conversation sélectionnée
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 2. STATE — Champ de saisie du message à envoyer
  const [text, setText] = useState("");

  // 3. STATE — États de chargement et d'erreur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // 4. STATE — Filtre de recherche dans la sidebar
  const [filter, setFilter] = useState("");

  // 5. REF : ancre DOM au bas du fil de messages pour le scroll automatique
  const endRef = useRef<HTMLDivElement>(null);

  /**
   * Charge ou recharge la liste des conversations.
   * Si l'URL contient ?to=userId, ouvre directement cette conversation
   * (ou crée un "partenaire en attente" si elle n'existe pas encore).
   */
  function load() {
    setLoading(true);
    setError(null);
    const toId = searchParams.get("to");
    const toUsername = searchParams.get("username");
    apiFetch("/messages")
      .then((res) => {
        const convs: Conversation[] = res.data ?? [];
        setConversations(convs);
        if (toId) {
          const existing = convs.find((c) => c.partner.id === toId);
          if (existing) {
            setSelected(existing);
          } else if (toUsername) {
            // Première conversation avec cette personne — pas encore dans la liste
            setPendingPartner({ id: toId, username: toUsername });
          }
        } else if (convs.length > 0) {
          setSelected(convs[0]);
        }
      })
      .catch((err) =>
        setError(getErrorMessage(err, "Impossible de charger les conversations") || "Erreur inconnue"),
      )
      .finally(() => setLoading(false));
  }

  // 6. EFFECT : chargement initial des conversations au montage
  useEffect(() => {
    load();
  }, []);

  // 7. EFFECT : chargement des messages quand la conversation sélectionnée change
  // On vide les messages précédents pour éviter un flash du contenu ancien
  useEffect(() => {
    if (!selected) return;
    setMessages([]);
    apiFetch(`/messages/${selected.partner.id}`)
      .then((res) => setMessages(res.data ?? []))
      .catch((err) => setError(getErrorMessage(err, "Impossible de charger les messages") || "Erreur inconnue"));
  }, [selected?.partner.id]);

  // 8. EFFECT : scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Envoie le message saisi et met à jour l'état local immédiatement.
   * • Vide le champ de saisie avant la réponse de l'API (UX plus fluide)
   * • Ajoute le message en bas du fil sans rechargement
   * • Met à jour le dernier message dans la sidebar
   */
  async function handleSend() {
    const partnerId = selected?.partner.id ?? pendingPartner?.id;
    if (!text.trim() || !partnerId || sending) return;
    const content = text.trim();
    setSending(true);
    setText("");
    try {
      const res = await apiFetch(`/messages/${partnerId}`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      const newMsg: ChatMessage = {
        id: res.data.id,
        content: res.data.content,
        sent_at: res.data.sent_at,
        read: false,
        is_mine: true,
        sender: res.data.sender,
      };

      if (selected) {
        // Conversation existante — mise à jour optimiste
        setMessages((prev) => [...prev, newMsg]);
        setConversations((prev) =>
          prev.map((conv) =>
            conv.partner.id === selected.partner.id
              ? { ...conv, last_message: { content, sent_at: res.data.sent_at, read: false, is_mine: true } }
              : conv,
          ),
        );
      } else {
        // Première conversation — recharge la liste et sélectionne la nouvelle conv
        const res2 = await apiFetch("/messages");
        const convs: Conversation[] = res2.data ?? [];
        setConversations(convs);
        const newConv = convs.find((c) => c.partner.id === partnerId);
        if (newConv) setSelected(newConv);
        setPendingPartner(null);
        setMessages([newMsg]);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Impossible d'envoyer le message") || "Erreur inconnue");
    }
    setSending(false);
  }

  /** Ferme le chat actif (conversation réelle ou en attente). */
  function clearSelection() {
    setSelected(null);
    setPendingPartner(null);
  }

  // 9. CALCUL : filtrage des conversations par nom d'utilisateur (insensible à la casse)
  const filtered = conversations.filter((conv) =>
    conv.partner.username.toLowerCase().includes(filter.toLowerCase()),
  );

  // 10. CALCUL : regroupement des messages par jour pour les séparateurs de date
  const grouped = groupByDay(messages);

  return {
    conversations,
    selected,
    setSelected,
    messages,
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
    clearSelection,
    pendingPartner,
    load,
    endRef,
  };
}