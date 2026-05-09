interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({ front, back, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div className="relative perspective-1000 mt-8">
      <div className={`min-h-[400px] w-full p-8 bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col transition-all duration-500 ${isFlipped ? 'border-neutral-700 bg-neutral-900/50' : ''}`}>
        
        <div className="flex-1 flex flex-col justify-center text-center pb-8 border-b border-neutral-800/50">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-6">Front</span>
          <h2 className="text-4xl font-bold text-white whitespace-pre-wrap">{front}</h2>
        </div>

        <div className={`flex-1 flex flex-col justify-center text-center pt-8 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-6">Back</span>
          <div className="text-2xl text-neutral-300 whitespace-pre-wrap">{back}</div>
        </div>

        {!isFlipped && (
          <div className="absolute inset-x-8 bottom-8 top-1/2 flex items-center justify-center backdrop-blur-sm bg-neutral-950/40 rounded-b-xl z-10">
             <button 
              onClick={onFlip}
              className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              Show Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
