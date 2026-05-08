import React, { useState } from 'react';
import { useDecks, useCreateDeck } from '../../hooks/queries/useDecks';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: decks, isLoading, isError, error } = useDecks();
  const { mutate: createDeck, isPending: isCreating } = useCreateDeck();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createDeck({ title, description }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
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
          <Link 
            key={deck.id} 
            to={`/decks/${deck.id}`}
            className="group relative flex flex-col justify-between p-6 bg-neutral-950/50 border border-neutral-800 rounded-3xl hover:border-neutral-600 hover:bg-neutral-900/80 transition-all cursor-pointer overflow-hidden"
          >
            {/* Subtle Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-white text-neutral-100 transition-colors">{deck.title}</h3>
              <p className="text-neutral-400 text-sm line-clamp-2">{deck.description || 'No description provided'}</p>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between text-xs font-medium">
              <span className="text-neutral-500">
                {new Date(deck.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className={`px-2.5 py-1 rounded-md border ${deck.is_public ? 'border-blue-900/50 text-blue-400 bg-blue-950/30' : 'border-neutral-800 text-neutral-400 bg-neutral-900/50'}`}>
                {deck.is_public ? 'Public' : 'Private'}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6 text-white">Create New Deck</h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Deck Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                  placeholder="e.g. JLPT N5 Vocabulary"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Description (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-white transition-all h-24 resize-none"
                  placeholder="What is this deck about?"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create Deck'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
