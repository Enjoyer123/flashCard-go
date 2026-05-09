import { useState } from 'react';
import { useDecks, useCreateDeck } from '../../hooks/queries/useDecks';

import DeckCard from '../../components/DeckCard';
import CreateDeckModal from './components/CreateDeckModal';

export default function Dashboard() {
  const { data: decks, isLoading, isError, error } = useDecks();
  const { mutate: createDeck, isPending: isCreating } = useCreateDeck();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (title: string, description: string) => {
    createDeck({ title, description }, {
      onSuccess: () => {
        setIsModalOpen(false);
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Decks</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage and study your flashcard collections.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 active:scale-95"
        >
          + Create Deck
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-neutral-900/50 rounded-2xl border border-neutral-800"></div>
          ))}
        </div>
      )}
      
      {isError && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-900/50 text-red-400">
          Failed to load decks: {error?.message}
        </div>
      )}

      {!isLoading && !isError && decks?.length === 0 && (
        <div className="text-center py-20 border border-dashed border-neutral-800 rounded-3xl bg-neutral-950/30">
          <div className="text-neutral-500 mb-4">No decks found</div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-white text-sm font-medium hover:underline underline-offset-4"
          >
            Create your first deck
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks?.map(deck => (
          <DeckCard 
            key={deck.id}
            id={deck.id}
            title={deck.title}
            description={deck.description}
            linkTo={`/decks/${deck.id}`}
            variant="dashboard"
            createdAt={deck.created_at}
            isPublic={deck.is_public}
          />
        ))}
      </div>

      <CreateDeckModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
        isCreating={isCreating}
      />
    </div>
  );
}
