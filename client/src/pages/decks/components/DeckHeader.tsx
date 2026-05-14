import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type{ Deck, DeckStats } from '../../../types/deck';
import { useDeleteDeck } from '../../../hooks/queries/useDecks';

interface DeckHeaderProps {
  deck: Deck;
  stats?: DeckStats;
  isUpdating: boolean;
  onTogglePublic: () => void;
}

export default function DeckHeader({ deck, stats, isUpdating, onTogglePublic }: DeckHeaderProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const { mutate: deleteDeck, isPending: isDeleting } = useDeleteDeck();

  const handleDelete = () => {
    deleteDeck(deck.id, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-800">
        <div>
          <Link to="/dashboard" className="text-neutral-500 hover:text-white text-sm mb-4 inline-block transition-colors">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white">{deck.title}</h1>
          <p className="text-neutral-400 mt-2 text-sm">{deck.description || 'No description provided'}</p>
        </div>
        
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-3 rounded-xl text-sm font-bold transition-all border flex-shrink-0 flex items-center justify-center bg-neutral-900 border-red-500/30 text-red-400 hover:bg-red-950/50 hover:border-red-500/60"
            title="Delete Deck"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>

          <button 
            onClick={onTogglePublic}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          />
          <div className="relative bg-neutral-900 border border-neutral-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Deck</h3>
              <p className="text-neutral-400 text-sm mb-1">
                Are you sure you want to delete
              </p>
              <p className="text-white font-semibold mb-1">"{deck.title}"</p>
              <p className="text-neutral-500 text-xs mb-6">
                This will permanently delete all cards in this deck. This action cannot be undone.
              </p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Deleting...
                    </span>
                  ) : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
