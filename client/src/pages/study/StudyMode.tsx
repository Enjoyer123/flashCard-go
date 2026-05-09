import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDueCards, useReviewCard } from '../../hooks/queries/useCards';
import { useStudyStore } from '../../store/useStudyStore';

import StudyProgress from './components/StudyProgress';
import Flashcard from './components/Flashcard';
import RatingControls from './components/RatingControls';

export default function StudyMode() {
  const { deckId } = useParams<{ deckId: string }>();
  const { data: dueCards, isLoading, isError, error } = useDueCards(deckId || '');
  const { mutate: reviewCard, isPending: isReviewing } = useReviewCard();
  
  const { cards, currentIndex, isFlipped, isFinished, setCards, flipCard, processRating, resetSession } = useStudyStore();

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
      <StudyProgress 
        deckId={deckId || ''} 
        currentIndex={currentIndex} 
        totalCards={cards.length} 
      />

      <Flashcard 
        front={currentCard.front}
        back={currentCard.back}
        isFlipped={isFlipped}
        onFlip={flipCard}
      />

      <RatingControls 
        isFlipped={isFlipped}
        isReviewing={isReviewing}
        onRating={handleRating}
      />
    </div>
  );
}
