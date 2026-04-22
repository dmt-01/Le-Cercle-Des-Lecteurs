export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  profile_image?: string;
  created_at: string;
}

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
}

export interface Author {
  id: string;
  name: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

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

export interface Review {
  book_id: string;
  user_id: string;
  content?: string;
  note?: number;
  created_at: string;
  username?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  access_club: boolean;
  created_at: string;
  member_count?: number;
}

export interface GroupMessage {
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    profileImage?: string;
  };
}

export interface Message {
  id: string;
  content: string;
  sent_at: string;
  sender: { id: string; username: string };
  receiver: { id: string; username: string };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  link?: string;
  group: { id: string; name: string };
}

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
