export interface Card {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  due?: string | null;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number; // 0: New, 1: Learning, 2: Review, 3: Relearning
  last_review?: string | null;
  created_at: string;
}

export interface ReviewCardReq {
  rating: number; // 1: Again, 2: Hard, 3: Good, 4: Easy
}
