import apiClient from './client';
import type { Deck, CreateDeckReq, UpdateDeckReq, DeckStats, PublicDeckRes } from '../types/deck';

export const getDecksFn = async (): Promise<Deck[]> => {
  const response = await apiClient.get<Deck[]>('/decks');
  return response.data;
};

export const createDeckFn = async (data: CreateDeckReq): Promise<Deck> => {
  const response = await apiClient.post<Deck>('/decks', data);
  return response.data;
};

export const updateDeckFn = async (deckId: string, data: UpdateDeckReq): Promise<Deck> => {
  const response = await apiClient.patch<Deck>(`/decks/${deckId}`, data);
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

export const getPublicDecksFn = async (search: string = '', page: number = 1, limit: number = 10): Promise<PublicDeckRes> => {
  const response = await apiClient.get<PublicDeckRes>('/decks/public', {
    params: { search, page, limit }
  });
  return response.data;
};

export const deleteDeckFn = async (deckId: string): Promise<void> => {
  await apiClient.delete(`/decks/${deckId}`);
};

export const forkDeckFn = async (deckId: string): Promise<Deck> => {
  const response = await apiClient.post<Deck>(`/decks/${deckId}/fork`);
  return response.data;
};
