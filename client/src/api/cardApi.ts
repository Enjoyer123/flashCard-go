import apiClient from './client';
import type { Card, ReviewCardReq } from '../types/card';

export interface CreateCardReq {
  front: string;
  back: string;
}

export interface AutoCardReq {
  word: string;
  deck_id: string;
}

export interface UpdateCardReq {
  front: string;
  back: string;
}

export interface StudyActivity {
  date: string;
  review_count: number;
}

export const createCardFn = async (deckId: string, data: CreateCardReq) => {
  const response = await apiClient.post(`/decks/${deckId}/cards`, data);
  return response.data;
};

export const getDueCardsFn = async (deckId: string): Promise<Card[]> => {
  const response = await apiClient.get<Card[]>(`/decks/${deckId}/review`);
  return response.data;
};

export const reviewCardFn = async (cardId: string, data: ReviewCardReq): Promise<Card> => {
  const response = await apiClient.post<Card>(`/cards/${cardId}/review`, data);
  return response.data;
};

export const autoCardFn = async (data: AutoCardReq): Promise<Card> => {
  const response = await apiClient.post<Card>('/cards/auto', data);
  return response.data;
};

export const updateCardFn = async (cardId: string, data: UpdateCardReq): Promise<Card> => {
  const response = await apiClient.patch<Card>(`/cards/${cardId}`, data);
  return response.data;
};

export const getUserStudyActivityFn = async (): Promise<StudyActivity[]> => {
  const response = await apiClient.get<StudyActivity[]>('/users/me/study-activity');
  return response.data;
};
