import apiClient from './client';

export interface CreateCardReq {
  front: string;
  back: string;
}

export const createCardFn = async (deckId: string, data: CreateCardReq) => {
  const response = await apiClient.post(`/decks/${deckId}/cards`, data);
  return response.data;
};
