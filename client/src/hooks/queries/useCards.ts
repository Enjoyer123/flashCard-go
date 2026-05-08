import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCardFn, getDueCardsFn, reviewCardFn } from '../../api/cardApi';
import type { CreateCardReq } from '../../api/cardApi';
import type { Card, ReviewCardReq } from '../../types/card';
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
