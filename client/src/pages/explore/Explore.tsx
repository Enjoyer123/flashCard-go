import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePublicDecks } from '../../hooks/queries/useDecks';

export default function Explore() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePublicDecks(search, page);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Explore Decks</h1>
          <p className="text-neutral-400 mt-2 text-sm">Discover and clone public decks created by the community.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <input 
            type="text" 
            placeholder="Search decks by title or description..." 
            value={search}
            onChange={handleSearch}
            className="w-full pl-4 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-white transition-all text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-36 bg-neutral-900/50 rounded-2xl border border-neutral-800"></div>)}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 bg-neutral-950/30 border border-dashed border-neutral-800 rounded-3xl">
          No public decks found matching your search.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((deck) => (
            <Link 
              key={deck.id} 
              to={`/explore/${deck.id}`}
              className="group bg-neutral-950/50 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-600 transition-all hover:bg-neutral-900/50 flex flex-col h-full"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">{deck.title}</h3>
                <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{deck.description || 'No description provided.'}</p>
              </div>
              <div className="flex items-center text-xs text-blue-500 font-bold uppercase tracking-wider mt-4">
                <span>View Details & Clone →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {data && data.total > data.limit && (
        <div className="flex justify-center items-center gap-4 mt-8 pt-8 border-t border-neutral-800/50">
           <button 
             disabled={page === 1} 
             onClick={() => setPage(p => p - 1)}
             className="px-4 py-2 bg-neutral-900 text-white font-medium text-sm rounded-xl disabled:opacity-30 hover:bg-neutral-800 transition-colors"
           >
             Previous
           </button>
           <span className="px-4 py-2 text-neutral-500 text-sm font-medium">Page {page} of {Math.ceil(data.total / data.limit)}</span>
           <button 
             disabled={page * data.limit >= data.total} 
             onClick={() => setPage(p => p + 1)}
             className="px-4 py-2 bg-neutral-900 text-white font-medium text-sm rounded-xl disabled:opacity-30 hover:bg-neutral-800 transition-colors"
           >
             Next
           </button>
        </div>
      )}
    </div>
  );
}
