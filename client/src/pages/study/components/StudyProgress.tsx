import { Link } from 'react-router-dom';

interface StudyProgressProps {
  deckId: string;
  currentIndex: number;
  totalCards: number;
}

export default function StudyProgress({ deckId, currentIndex, totalCards }: StudyProgressProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <Link to={`/decks/${deckId}`} className="text-neutral-500 hover:text-white transition-colors text-sm">
          &larr; Quit Session
        </Link>
        <div className="text-sm font-medium text-neutral-400">
          Card {currentIndex + 1} of {totalCards}
        </div>
      </div>

      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${(currentIndex / totalCards) * 100}%` }}
        ></div>
      </div>
    </>
  );
}
