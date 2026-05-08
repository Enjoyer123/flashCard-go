export interface CardSummary {
  id: string;
  front: string;
  back: string;
  due?: string | null;
  state?: number;
}

export interface Deck {
  id: string;
  user_id: string;
  title: string;
  description: string;
  is_public: boolean;
  created_at: string;
  cards?: CardSummary[] | null;
}

export interface CreateDeckReq {
  title: string;
  description: string;
}

export interface DeckStats {
  total_cards: number;
  due_today: number;
  new_cards: number;
  learning_cards: number;
  review_cards: number;
}
