import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDecksFn, createDeckFn, updateDeckFn, getDeckByIdFn, getDeckStatsFn, getPublicDecksFn, forkDeckFn, deleteDeckFn } from '../../api/deckApi';
import type { Deck, CreateDeckReq, UpdateDeckReq, DeckStats, PublicDeckRes } from '../../types/deck';
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

export const useUpdateDeck = () => {
  const queryClient = useQueryClient();
  return useMutation<Deck, AxiosError, { deckId: string; data: UpdateDeckReq }>({
    mutationFn: ({ deckId, data }) => updateDeckFn(deckId, data),
    onSuccess: (updatedDeck) => {
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      queryClient.invalidateQueries({ queryKey: ['decks', updatedDeck.id] });
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

export const usePublicDecks = (search: string, page: number) => {
  return useQuery<PublicDeckRes, AxiosError>({
    queryKey: ['decks', 'public', search, page],
    queryFn: () => getPublicDecksFn(search, page),
  });
};

export const useForkDeck = () => {
  const queryClient = useQueryClient();
  return useMutation<Deck, AxiosError, string>({
    mutationFn: (deckId) => forkDeckFn(deckId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] });
    },
  });
};

export const useDeleteDeck = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: (deckId) => deleteDeckFn(deckId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] });
    },
  });
};
