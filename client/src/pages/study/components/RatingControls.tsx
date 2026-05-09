interface RatingControlsProps {
  isFlipped: boolean;
  isReviewing: boolean;
  onRating: (rating: number) => void;
}

export default function RatingControls({ isFlipped, isReviewing, onRating }: RatingControlsProps) {
  return (
    <div className={`grid grid-cols-4 gap-3 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <button 
        onClick={() => onRating(1)} disabled={isReviewing}
        className="group flex flex-col items-center justify-center p-4 bg-neutral-950 border border-red-900/30 rounded-2xl hover:bg-red-950/40 hover:border-red-800 transition-all active:scale-95 disabled:opacity-50"
      >
        <span className="text-red-400 font-bold mb-1 group-hover:text-red-300">Again</span>
        <span className="text-[10px] text-neutral-500 font-medium tracking-wider">Hardest</span>
      </button>
      <button 
        onClick={() => onRating(2)} disabled={isReviewing}
        className="group flex flex-col items-center justify-center p-4 bg-neutral-950 border border-orange-900/30 rounded-2xl hover:bg-orange-950/40 hover:border-orange-800 transition-all active:scale-95 disabled:opacity-50"
      >
        <span className="text-orange-400 font-bold mb-1 group-hover:text-orange-300">Hard</span>
        <span className="text-[10px] text-neutral-500 font-medium tracking-wider">Tough</span>
      </button>
      <button 
        onClick={() => onRating(3)} disabled={isReviewing}
        className="group flex flex-col items-center justify-center p-4 bg-neutral-950 border border-green-900/30 rounded-2xl hover:bg-green-950/40 hover:border-green-800 transition-all active:scale-95 disabled:opacity-50"
      >
        <span className="text-green-400 font-bold mb-1 group-hover:text-green-300">Good</span>
        <span className="text-[10px] text-neutral-500 font-medium tracking-wider">Normal</span>
      </button>
      <button 
        onClick={() => onRating(4)} disabled={isReviewing}
        className="group flex flex-col items-center justify-center p-4 bg-neutral-950 border border-blue-900/30 rounded-2xl hover:bg-blue-950/40 hover:border-blue-800 transition-all active:scale-95 disabled:opacity-50"
      >
        <span className="text-blue-400 font-bold mb-1 group-hover:text-blue-300">Easy</span>
        <span className="text-[10px] text-neutral-500 font-medium tracking-wider">Simple</span>
      </button>
    </div>
  );
}
