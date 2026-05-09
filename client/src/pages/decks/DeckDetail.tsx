import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDeck, useDeckStats, useUpdateDeck } from '../../hooks/queries/useDecks';
import { useCreateCard } from '../../hooks/queries/useCards';

import DeckHeader from './components/DeckHeader';
import DeckStatsGrid from './components/DeckStatsGrid';
import CardList from '../../components/CardList';
import AddCardModal from './components/AddCardModal';

export default function DeckDetail() {
  const { deckId } = useParams<{ deckId: string }>();
  
  const { data: deck, isLoading: isDeckLoading } = useDeck(deckId || '');
  const { data: stats, isLoading: isStatsLoading } = useDeckStats(deckId || '');
  const { mutate: createCard, isPending: isCreating } = useCreateCard();
  const { mutate: updateDeck, isPending: isUpdating } = useUpdateDeck();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddCard = (front: string, back: string) => {
    if (!deckId) return;

    createCard({ deckId, data: { front, back } }, {
      onSuccess: () => {
        setIsAddModalOpen(false);
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
      />

      <AddCardModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddCard} 
        isCreating={isCreating} 
      />
    </div>
  );
}
