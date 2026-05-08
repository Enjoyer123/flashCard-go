import apiClient from './client';
import type { Deck, CreateDeckReq } from '../types/deck';

export const getDecksFn = async (): Promise<Deck[]> => {
  const response = await apiClient.get<Deck[]>('/decks');
  return response.data;
};

export const createDeckFn = async (data: CreateDeckReq): Promise<Deck> => {
  const response = await apiClient.post<Deck>('/decks', data);
  return response.data;
};
