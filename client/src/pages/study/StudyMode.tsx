import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDueCards, useReviewCard } from '../../hooks/queries/useCards';
import { useStudyStore } from '../../store/useStudyStore';

export default function StudyMode() {
  const { deckId } = useParams<{ deckId: string }>();
  const { data: dueCards, isLoading, isError, error } = useDueCards(deckId || '');
  const { mutate: reviewCard, isPending: isReviewing } = useReviewCard();
  
  const { cards, currentIndex, isFlipped, isFinished, setCards, flipCard, processRating, resetSession } = useStudyStore();

  // Load cards into store when fetched
  useEffect(() => {
    if (dueCards) {
      setCards(dueCards);
    }
    return () => resetSession();
  }, [dueCards, setCards, resetSession]);

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-neutral-900/50 rounded-3xl max-w-2xl mx-auto mt-10"></div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-400">Failed to load cards: {error.message}</div>;
  }

  if (isFinished || cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white">All caught up!</h1>
        <p className="text-neutral-400">You've finished all due cards for this deck today.</p>
        <div className="pt-4">
          <Link 
            to={`/decks/${deckId}`}
            className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
          >
            Return to Deck
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleRating = (rating: number) => {
    if (!currentCard || isReviewing) return;
    
    reviewCard(
      { cardId: currentCard.id, data: { rating } },
      {
        onSuccess: (updatedCard) => {
          processRating(rating, updatedCard);
        }
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Progress */}
      <div className="flex items-center justify-between mb-8">
        <Link to={`/decks/${deckId}`} className="text-neutral-500 hover:text-white transition-colors text-sm">
          ← Quit Session
        </Link>
        <div className="text-sm font-medium text-neutral-400">
          Card {currentIndex + 1} of {cards.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex) / cards.length) * 100}%` }}
        ></div>
      </div>

      {/* Flashcard Area */}
      <div className="relative perspective-1000 mt-8">
        <div className={`min-h-[400px] w-full p-8 bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col transition-all duration-500 ${isFlipped ? 'border-neutral-700 bg-neutral-900/50' : ''}`}>
          
          {/* Front (Question) */}
          <div className="flex-1 flex flex-col justify-center text-center pb-8 border-b border-neutral-800/50">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-6">Front</span>
            <h2 className="text-4xl font-bold text-white whitespace-pre-wrap">{currentCard.front}</h2>
          </div>

          {/* Back (Answer) - Only visible if flipped */}
          <div className={`flex-1 flex flex-col justify-center text-center pt-8 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-6">Back</span>
            <div className="text-2xl text-neutral-300 whitespace-pre-wrap">{currentCard.back}</div>
          </div>

          {/* Blur Overlay (when not flipped) */}
          {!isFlipped && (
            <div className="absolute inset-x-8 bottom-8 top-1/2 flex items-center justify-center backdrop-blur-sm bg-neutral-950/40 rounded-b-xl z-10">
               <button 
                onClick={flipCard}
                className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                Show Answer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FSRS Rating Buttons (only visible when flipped) */}
      <div className={`grid grid-cols-4 gap-3 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button 
          onClick={() => handleRating(1)} disabled={isReviewing}
          className="group flex flex-col items-center justify-center p-4 bg-neutral-950 border border-red-900/30 rounded-2xl hover:bg-red-950/40 hover:border-red-800 transition-all active:scale-95 disabled:opacity-50"
        >
          <span className="text-red-400 font-bold mb-1 group-hover:text-red-300">Again</span>
          <span className="text-[10px] text-neutral-500 font-medium tracking-wider">Hardest</span>
        </button>
        <button 
          onClick={() => handleRating(2)} disabled={isReviewing}
          className="group flex flex-col items-center justify-center p-4 bg-neutral-950 border border-orange-900/30 rounded-2xl hover:bg-orange-950/40 hover:border-orange-800 transition-all active:scale-95 disabled:opacity-50"
        >
          <span className="text-orange-400 font-bold mb-1 group-hover:text-orange-300">Hard</span>
          <span className="text-[10px] text-neutral-500 font-medium tracking-wider">Tough</span>
        </button>
        <button 
          onClick={() => handleRating(3)} disabled={isReviewing}
          className="group flex flex-col items-center justify-center p-4 bg-neutral-950 border border-green-900/30 rounded-2xl hover:bg-green-950/40 hover:border-green-800 transition-all active:scale-95 disabled:opacity-50"
        >
          <span className="text-green-400 font-bold mb-1 group-hover:text-green-300">Good</span>
          <span className="text-[10px] text-neutral-500 font-medium tracking-wider">Normal</span>
        </button>
        <button 
          onClick={() => handleRating(4)} disabled={isReviewing}
          className="group flex flex-col items-center justify-center p-4 bg-neutral-950 border border-blue-900/30 rounded-2xl hover:bg-blue-950/40 hover:border-blue-800 transition-all active:scale-95 disabled:opacity-50"
        >
          <span className="text-blue-400 font-bold mb-1 group-hover:text-blue-300">Easy</span>
          <span className="text-[10px] text-neutral-500 font-medium tracking-wider">Simple</span>
        </button>
      </div>

    </div>
  );
}
