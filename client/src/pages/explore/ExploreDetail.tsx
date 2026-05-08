import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDeck, useForkDeck } from '../../hooks/queries/useDecks';

export default function ExploreDetail() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const { data: deck, isLoading } = useDeck(deckId || '');
  const { mutate: forkDeck, isPending: isForking } = useForkDeck();

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-neutral-900/50 rounded-3xl max-w-3xl mx-auto mt-10"></div>;
  }

  if (!deck) {
    return (
      <div className="text-center py-20 border border-dashed border-neutral-800 rounded-3xl bg-neutral-950/30">
        <div className="text-neutral-500 mb-4">Deck not found or is private.</div>
        <Link to="/explore" className="text-white text-sm hover:underline">Return to Explore</Link>
      </div>
    );
  }

  const handleFork = () => {
    if (!deckId) return;
    forkDeck(deckId, {
      onSuccess: (newDeck) => {
        navigate(`/decks/${newDeck.id}`);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-neutral-950/80 border border-neutral-800 p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
        
        <Link to="/explore" className="text-neutral-500 hover:text-white text-sm mb-6 inline-block transition-colors">
          ← Back to Explore
        </Link>
        
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">{deck.title}</h1>
        <p className="text-neutral-400 text-lg mb-8 leading-relaxed max-w-2xl">{deck.description || 'No description provided.'}</p>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleFork}
            disabled={isForking}
            className="px-8 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {isForking ? 'Cloning...' : 'Clone to My Library'}
          </button>
          <div className="text-sm font-bold text-neutral-400 px-5 py-3.5 bg-neutral-900/80 rounded-xl border border-neutral-800">
            {deck.cards?.length || 0} Cards
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h2 className="text-xl font-bold text-white mb-6">Preview Cards</h2>
        {(!deck.cards || deck.cards.length === 0) ? (
          <div className="text-neutral-500 italic text-center py-10 bg-neutral-950/30 rounded-2xl border border-dashed border-neutral-800">
            This deck is empty.
          </div>
        ) : (
          <div className="grid gap-3">
            {deck.cards.slice(0, 10).map((card, idx) => (
              <div key={idx} className="p-5 bg-neutral-950/50 border border-neutral-800/80 rounded-2xl flex flex-col sm:flex-row gap-4 hover:border-neutral-700 transition-colors">
                <div className="flex-1">
                  <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-2">Front</div>
                  <div className="text-base text-white">{card.front}</div>
                </div>
                <div className="hidden sm:block w-px bg-neutral-800/50"></div>
                <div className="flex-1">
                  <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-2">Back</div>
                  <div className="text-base text-neutral-400">{card.back}</div>
                </div>
              </div>
            ))}
            
            {deck.cards.length > 10 && (
              <div className="text-center py-6">
                <div className="inline-block px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  + {deck.cards.length - 10} more cards hidden
                </div>
                <p className="text-neutral-500 text-sm mt-3">Clone this deck to view and study all cards.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
