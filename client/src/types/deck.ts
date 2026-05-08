export interface CardSummary {
  id: string;
  front: string;
  back: string;
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
