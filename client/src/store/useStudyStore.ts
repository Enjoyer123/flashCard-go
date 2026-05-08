import { create } from 'zustand';
import type { Card } from '../types/card';

interface StudyState {
  cards: Card[];
  currentIndex: number;
  isFlipped: boolean;
  isFinished: boolean;
  
  setCards: (cards: Card[]) => void;
  flipCard: () => void;
  nextCard: () => void;
  processRating: (rating: number, updatedCard: Card) => void;
  resetSession: () => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  cards: [],
  currentIndex: 0,
  isFlipped: false,
  isFinished: false,

  setCards: (cards) => set({ 
    cards, 
    currentIndex: 0, 
    isFlipped: false, 
    isFinished: cards.length === 0 
  }),
  
  flipCard: () => set({ isFlipped: true }),
  
  nextCard: () => {
    const { currentIndex, cards } = get();
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= cards.length) {
      set({ isFinished: true, isFlipped: false });
    } else {
      set({ currentIndex: nextIndex, isFlipped: false });
    }
  },

  processRating: (rating, updatedCard) => {
    const { currentIndex, cards } = get();
    let newCards = [...cards];
    
    newCards[currentIndex] = updatedCard;

    if (rating === 1) {
      newCards.push(updatedCard);
    }

    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= newCards.length) {
      set({ cards: newCards, isFinished: true, isFlipped: false });
    } else {
      set({ cards: newCards, currentIndex: nextIndex, isFlipped: false });
    }
  },
  
  resetSession: () => set({
    cards: [],
    currentIndex: 0,
    isFlipped: false,
    isFinished: false
  }),
}));
