// ─────────────────────────────────────────────────────────────────────────────
// types/index.ts
// Centralise tous les types et interfaces partagés dans le frontend.
// Chaque interface reflète la forme des données renvoyées par l'API backend.
// ─────────────────────────────────────────────────────────────────────────────

/** Utilisateur connecté — données issues du token JWT / endpoint /users/me */
export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  profile_image?: string;
  created_at: string;
}

/**
 * Profil public d'un utilisateur visible par tous.
 * Inclut les compteurs sociaux et la liste des groupes rejoints.
 */
export interface PublicProfile {
  id: string;
  username: string;
  bio?: string;
  profile_image?: string;
  created_at: string;
  followers: number;
  following: number;
  reads: number;
  reviews: number;
  groups: { id: string; name: string }[];
  /** true si l'utilisateur connecté suit déjà ce profil — absent si non connecté */
  is_following?: boolean;
}

/** Auteur d'un livre */
export interface Author {
  id: string;
  name: string;
}

/** Genre littéraire associé à un livre */
export interface Genre {
  id: string;
  name: string;
}

/** Tag thématique associé à un livre */
export interface Tag {
  id: string;
  name: string;
}

/**
 * Livre de la bibliothèque.
 * average_rating et review_count sont optionnels car absents si aucun avis.
 */
export interface Book {
  id: string;
  title: string;
  cover_image?: string;
  description?: string;
  publication_date?: string;
  average_rating?: number | null;
  review_count?: number;
  authors: Author[];
  genres: Genre[];
  tags: Tag[];
}

/** Avis laissé par un utilisateur sur un livre */
export interface Review {
  book_id: string;
  user_id: string;
  content?: string;
  note?: number;
  created_at: string;
  username?: string;
}

/** Cercle de lecture (groupe) */
export interface Group {
  id: string;
  name: string;
  description?: string;
  /** true = visible par tous, false = sur invitation */
  access_club: boolean;
  created_at: string;
  member_count: number;
  message_count: number;
}

/** Message posté dans le fil de discussion d'un groupe */
export interface GroupMessage {
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    profileImage?: string;
  };
}

/** Message privé entre deux utilisateurs */
export interface Message {
  id: string;
  content: string;
  sent_at: string;
  sender: { id: string; username: string };
  receiver: { id: string; username: string };
}

/** Événement littéraire organisé par un groupe */
export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  /** URL externe d'inscription (facultatif) */
  link?: string;
  group: { id: string; name: string };
}

/** Article de blog rédigé par un membre */
export interface BlogPost {
  id: string;
  title: string;
  content?: string;
  category?: string;
  created_at: string;
  author: {
    id: string;
    username: string;
    profileImage?: string;
  };
}

/** Interface du contexte d'authentification exposé via useAuth() */
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updated: User) => void;
}

/** Onglets disponibles sur la page de détail d'un livre */
export type Tab = "resume" | "critiques" | "forum";

/**
 * Entrée de wishlist/bibliothèque.
 * status peut être "À lire", "En cours" ou "Lu".
 */
export type WishlistItem = { status: string; added_at: string; book: Book };

/** Section de contenu structuré (titre + corps) */
export type Section = { heading: string; body: string };