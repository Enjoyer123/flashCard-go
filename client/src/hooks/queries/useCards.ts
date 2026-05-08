import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCardFn } from '../../api/cardApi';
import type { CreateCardReq } from '../../api/cardApi';

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
