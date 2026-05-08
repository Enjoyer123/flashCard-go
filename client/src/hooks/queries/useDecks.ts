import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDecksFn, createDeckFn } from '../../api/deckApi';
import type { Deck, CreateDeckReq } from '../../types/deck';
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
      // เมื่อสร้างเสร็จ สั่งให้ TanStack ล้างแคชเก่า แล้วดึงข้อมูลใหม่ทันที
      queryClient.invalidateQueries({ queryKey: ['decks'] });
    },
  });
};
