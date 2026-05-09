import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCardFn, getDueCardsFn, reviewCardFn, autoCardFn, updateCardFn, getUserStudyActivityFn } from '../../api/cardApi';
import type { CreateCardReq, AutoCardReq, UpdateCardReq } from '../../api/cardApi';
import type { Card, ReviewCardReq } from '../../types/card';
import type { StudyActivity } from '../../api/cardApi';
import { AxiosError } from 'axios';

export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation<any, any, { deckId: string; data: CreateCardReq }>({
    mutationFn: ({ deckId, data }) => createCardFn(deckId, data),
    onSuccess: (_, { deckId }) => {
      queryClient.invalidateQueries({ queryKey: ['decks', deckId] });
      queryClient.invalidateQueries({ queryKey: ['decks', deckId, 'stats'] });
    },
  });
};

export const useDueCards = (deckId: string) => {
  return useQuery<Card[], AxiosError>({
    queryKey: ['decks', deckId, 'due-cards'],
    queryFn: () => getDueCardsFn(deckId),
    enabled: !!deckId,
  });
};

export const useReviewCard = () => {
  return useMutation<Card, AxiosError, { cardId: string; data: ReviewCardReq }>({
    mutationFn: ({ cardId, data }) => reviewCardFn(cardId, data),
  });
};

export const useAutoCard = () => {
  return useMutation<Card, AxiosError, AutoCardReq>({
    mutationFn: (data) => autoCardFn(data),
  });
};

export const useUpdateCard = () => {
  const queryClient = useQueryClient();

  return useMutation<Card, AxiosError, { cardId: string; deckId: string; data: UpdateCardReq }>({
    mutationFn: ({ cardId, data }) => updateCardFn(cardId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['decks', variables.deckId] });
      queryClient.invalidateQueries({ queryKey: ['decks', variables.deckId, 'due-cards'] });
    },
  });
};

export const useStudyActivity = () => {
  return useQuery<StudyActivity[], AxiosError>({
    queryKey: ['study-activity'],
    queryFn: () => getUserStudyActivityFn(),
  });
};
