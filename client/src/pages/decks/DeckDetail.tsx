import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDeck, useDeckStats, useUpdateDeck } from '../../hooks/queries/useDecks';
import { useCreateCard, useAutoCard, useUpdateCard } from '../../hooks/queries/useCards';
import type { CardSummary } from '../../types/deck';

import DeckHeader from './components/DeckHeader';
import DeckStatsGrid from './components/DeckStatsGrid';
import CardList from '../../components/CardList';
import AddCardModal from './components/AddCardModal';
import EditCardModal from './components/EditCardModal';

export default function DeckDetail() {
  const { deckId } = useParams<{ deckId: string }>();
  
  const { data: deck, isLoading: isDeckLoading } = useDeck(deckId || '');
  const { data: stats, isLoading: isStatsLoading } = useDeckStats(deckId || '');
  const { mutate: createCard, isPending: isCreating } = useCreateCard();
  const { mutateAsync: autoCardAsync } = useAutoCard();
  const { mutate: updateCard, isPending: isCardUpdating } = useUpdateCard();
  const { mutate: updateDeck, isPending: isUpdating } = useUpdateDeck();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardSummary | null>(null);

  const handleAddCard = (front: string, back: string) => {
    if (!deckId) return;

    createCard({ deckId, data: { front, back } }, {
      onSuccess: () => {
        setIsAddModalOpen(false);
      }
    });
  };

  const handleAutoCard = async (word: string) => {
    if (!deckId) return null;
    try {
      return await autoCardAsync({ deck_id: deckId, word });
    } catch (error) {
      console.error("Failed to generate card:", error);
      return null;
    }
  };

  const handleEditCard = (cardId: string, front: string, back: string) => {
    if (!deckId) return;
    updateCard({ cardId, deckId, data: { front, back } }, {
      onSuccess: () => {
        setEditingCard(null);
      }
    });
  };

  const handleTogglePublic = () => {
    if (!deck) return;
    updateDeck({
      deckId: deck.id,
      data: {
        title: deck.title,
        description: deck.description,
        is_public: !deck.is_public
      }
    });
  };

  if (isDeckLoading || isStatsLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-24 bg-neutral-900/50 rounded-2xl border border-neutral-800"></div>
        <div className="h-32 bg-neutral-900/50 rounded-2xl border border-neutral-800"></div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="text-center py-20 border border-dashed border-neutral-800 rounded-3xl bg-neutral-950/30">
        <div className="text-neutral-500 mb-4">Deck not found</div>
        <Link to="/dashboard" className="text-white text-sm hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DeckHeader 
        deck={deck} 
        stats={stats} 
        isUpdating={isUpdating} 
        onTogglePublic={handleTogglePublic} 
      />

      <DeckStatsGrid stats={stats} />

      <CardList 
        cards={deck.cards} 
        onAddClick={() => setIsAddModalOpen(true)} 
        onEditClick={(card) => setEditingCard(card)}
      />

      <AddCardModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddCard} 
        onAutoAdd={handleAutoCard}
        isCreating={isCreating} 
      />

      <EditCardModal
        card={editingCard}
        isOpen={!!editingCard}
        onClose={() => setEditingCard(null)}
        onEdit={handleEditCard}
        isUpdating={isCardUpdating}
      />
    </div>
  );
}
