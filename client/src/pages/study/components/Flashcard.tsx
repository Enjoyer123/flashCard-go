interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({ front, back, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div className="relative mt-8" style={{ perspective: '1200px' }}>
      <div 
        className="relative w-full grid transition-transform duration-500 ease-out"
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)' 
        }}
      >
        {/* Front of the card */}
        <div 
          className="row-start-1 col-start-1 w-full min-h-[400px] p-8 bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col items-center relative"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mt-2 mb-8">Front</span>
          
          <div className="flex-1 flex items-center justify-center w-full mb-16">
            <h2 className="text-4xl font-bold text-white whitespace-pre-wrap text-center">{front}</h2>
          </div>

          <div className="absolute bottom-8 inset-x-8 flex justify-center">
             <button 
              onClick={onFlip}
              className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              Show Answer
            </button>
          </div>
        </div>

        {/* Back of the card */}
        <div 
          className="row-start-1 col-start-1 w-full min-h-[400px] p-8 bg-neutral-900 border border-neutral-700 rounded-3xl shadow-2xl flex flex-col items-center"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateX(180deg)' 
          }}
        >
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mt-2 mb-8">Back</span>
          
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="text-xl text-neutral-400 whitespace-pre-wrap text-center mb-6">{front}</div>
            <div className="w-16 h-px bg-neutral-700 mb-6"></div>
            <div className="text-3xl font-medium text-white whitespace-pre-wrap text-center leading-relaxed">{back}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
