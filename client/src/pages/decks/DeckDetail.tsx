import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDeck, useDeckStats, useUpdateDeck } from '../../hooks/queries/useDecks';
import { useCreateCard } from '../../hooks/queries/useCards';

export default function DeckDetail() {
  const { deckId } = useParams<{ deckId: string }>();
  
  const { data: deck, isLoading: isDeckLoading } = useDeck(deckId || '');
  const { data: stats, isLoading: isStatsLoading } = useDeckStats(deckId || '');
  const { mutate: createCard, isPending: isCreating } = useCreateCard();
  const { mutate: updateDeck, isPending: isUpdating } = useUpdateDeck();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleAddCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!deckId) return;

    createCard({ deckId, data: { front, back } }, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setFront('');
        setBack('');
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

  const formatDue = (due?: string | null, state?: number) => {
    if (state === 0) return <span className="text-blue-400 font-semibold">New Card</span>;
    if (!due) return <span className="text-neutral-500">Unknown</span>;
    
    const dueDate = new Date(due);
    const now = new Date();
    
    const diffTime = Math.max(0, dueDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes <= 0) return <span className="text-orange-400 font-semibold">Due now</span>;
    if (diffMinutes < 60) return <span className="text-orange-400">In {diffMinutes} mins</span>;
    if (diffDays <= 1) return <span className="text-green-400">Tomorrow</span>;
    
    return <span className="text-neutral-400">In {diffDays} days</span>;
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-800">
        <div>
          <Link to="/dashboard" className="text-neutral-500 hover:text-white text-sm mb-4 inline-block transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white">{deck.title}</h1>
          <p className="text-neutral-400 mt-2 text-sm">{deck.description || 'No description provided'}</p>
        </div>
        
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button 
            onClick={handleTogglePublic}
            disabled={isUpdating}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all border flex-shrink-0 flex items-center justify-center
              ${deck.is_public 
                ? 'bg-neutral-900 border-green-500/50 text-green-400 hover:bg-neutral-800' 
                : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:bg-neutral-800'
              }`}
            title={deck.is_public ? 'Make Private' : 'Make Public'}
          >
            {deck.is_public ? 'Public' : 'Private'}
          </button>
          
          <Link 
            to={`/study/${deck.id}`}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 text-center flex-shrink-0
              ${stats?.due_today 
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]' 
                : 'bg-white text-black hover:bg-neutral-200'
              }`}
          >
            {stats?.due_today ? `Study Now (${stats.due_today} due)` : 'Study Anyway'}
          </Link>
        </div>
      </div>

      {/* Stats Grid (FSRS Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-950/50 border border-neutral-800 p-6 rounded-2xl">
          <div className="text-neutral-500 text-xs font-medium mb-1 uppercase tracking-wider">Total Cards</div>
          <div className="text-3xl font-bold text-white">{stats?.total_cards || 0}</div>
        </div>
        <div className="bg-neutral-950/50 border border-blue-900/30 p-6 rounded-2xl">
          <div className="text-blue-500/70 text-xs font-medium mb-1 uppercase tracking-wider">New</div>
          <div className="text-3xl font-bold text-blue-400">{stats?.new_cards || 0}</div>
        </div>
        <div className="bg-neutral-950/50 border border-orange-900/30 p-6 rounded-2xl">
          <div className="text-orange-500/70 text-xs font-medium mb-1 uppercase tracking-wider">Learning</div>
          <div className="text-3xl font-bold text-orange-400">{stats?.learning_cards || 0}</div>
        </div>
        <div className="bg-neutral-950/50 border border-green-900/30 p-6 rounded-2xl">
          <div className="text-green-500/70 text-xs font-medium mb-1 uppercase tracking-wider">To Review</div>
          <div className="text-3xl font-bold text-green-400">{stats?.review_cards || 0}</div>
        </div>
      </div>

      {/* Cards List Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Cards <span className="text-neutral-500 text-base font-normal">({deck.cards?.length || 0})</span></h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 transition-colors"
          >
            + Add Card
          </button>
        </div>
        
        {(!deck.cards || deck.cards.length === 0) ? (
          <div className="text-center py-16 border border-dashed border-neutral-800 rounded-3xl text-neutral-500 bg-neutral-950/30">
            No cards in this deck yet. Add some to start learning!
          </div>
        ) : (
          <div className="grid gap-3">
            {deck.cards.map((card, idx) => (
              <div 
                key={card.id || idx} 
                className="p-5 bg-neutral-950/50 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row gap-4 hover:border-neutral-600 transition-colors group"
              >
                <div className="flex-1">
                  <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-2">Front</div>
                  <div className="text-base text-white">{card.front}</div>
                </div>
                <div className="hidden sm:block w-px bg-neutral-800 group-hover:bg-neutral-700 transition-colors"></div>
                <div className="flex-1">
                  <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-2">Back</div>
                  <div className="text-base text-neutral-300">{card.back}</div>
                </div>
                <div className="hidden sm:block w-px bg-neutral-800 group-hover:bg-neutral-700 transition-colors"></div>
                <div className="flex-1">
                  <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-2">Next Review</div>
                  <div className="text-sm mt-1">{formatDue(card.due, card.state)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6 text-white">Add New Card</h2>
            <form onSubmit={handleAddCard} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Front (Question/Word)</label>
                <textarea 
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-white transition-all h-20 resize-none"
                  placeholder="e.g. 食べる"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Back (Answer/Meaning)</label>
                <textarea 
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-white transition-all h-24 resize-none"
                  placeholder="to eat"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Adding...' : 'Add Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
