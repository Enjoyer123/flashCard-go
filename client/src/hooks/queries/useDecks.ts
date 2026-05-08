import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDecksFn, createDeckFn, getDeckByIdFn, getDeckStatsFn } from '../../api/deckApi';
import type { Deck, CreateDeckReq, DeckStats } from '../../types/deck';
import { AxiosError } from 'axios';


export const useDecks = () => {
  return useQuery<Deck[], AxiosError>({
    queryKey: ['decks'],
    queryFn: getDecksFn,
  });
};


export const useCreateDeck = () => {
  const queryClient = useQueryClient();

  return useMutation<Deck, AxiosError, CreateDeckReq>({
    mutationFn: createDeckFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] });
    },
  });
};

export const useDeck = (deckId: string) => {
  return useQuery<Deck, AxiosError>({
    queryKey: ['decks', deckId],
    queryFn: () => getDeckByIdFn(deckId),
    enabled: !!deckId, 
  });
};

export const useDeckStats = (deckId: string) => {
  return useQuery<DeckStats, AxiosError>({
    queryKey: ['decks', deckId, 'stats'],
    queryFn: () => getDeckStatsFn(deckId),
    enabled: !!deckId,
  });
};
