import apiClient from './client';
import type { Deck, CreateDeckReq, DeckStats } from '../types/deck';

export const getDecksFn = async (): Promise<Deck[]> => {
  const response = await apiClient.get<Deck[]>('/decks');
  return response.data;
};

export const createDeckFn = async (data: CreateDeckReq): Promise<Deck> => {
  const response = await apiClient.post<Deck>('/decks', data);
  return response.data;
};

export const getDeckByIdFn = async (deckId: string): Promise<Deck> => {
  const response = await apiClient.get<Deck>(`/decks/${deckId}`);
  return response.data;
};

export const getDeckStatsFn = async (deckId: string): Promise<DeckStats> => {
  const response = await apiClient.get<DeckStats>(`/decks/${deckId}/stats`);
  return response.data;
};
