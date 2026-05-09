import { Link } from 'react-router-dom';
import type { Card } from '../../../types/card';

interface StudyProgressProps {
  deckId: string;
  currentIndex: number;
  cards: Card[];
}

export default function StudyProgress({ deckId, currentIndex, cards }: StudyProgressProps) {
  const remainingCards = cards.slice(currentIndex);
  
  const newCards = remainingCards.filter(c => c.state === 0).length;
  const learningCards = remainingCards.filter(c => c.state === 1 || c.state === 3).length;
  const reviewCards = remainingCards.filter(c => c.state === 2).length;

  return (
    <div className="flex items-center justify-between mb-8">
      <Link to={`/decks/${deckId}`} className="text-neutral-500 hover:text-white transition-colors text-sm">
        &larr; Quit Session
      </Link>
      <div className="flex items-center gap-4 text-sm font-medium">
        {/*counters */}
        <div className="flex items-center gap-4 bg-neutral-900/80 px-4 py-1.5 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-1.5" title="New Cards">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            <span className="text-blue-400 font-bold">{newCards}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Learning / Relearning">
            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
            <span className="text-orange-400 font-bold">{learningCards}</span>
          </div>
          <div className="flex items-center gap-1.5" title="To Review">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span className="text-green-400 font-bold">{reviewCards}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
