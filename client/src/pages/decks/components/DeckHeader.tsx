import { Link } from 'react-router-dom';
import type{ Deck, DeckStats } from '../../../types/deck';

interface DeckHeaderProps {
  deck: Deck;
  stats?: DeckStats;
  isUpdating: boolean;
  onTogglePublic: () => void;
}

export default function DeckHeader({ deck, stats, isUpdating, onTogglePublic }: DeckHeaderProps) {
  return (
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
  );
}
