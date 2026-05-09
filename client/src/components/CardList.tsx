import type { CardSummary } from '../types/deck';

interface CardListProps {
  cards: CardSummary[] | null | undefined;
  onAddClick?: () => void;
  onEditClick?: (card: CardSummary) => void;
  previewMode?: boolean;
}

export default function CardList({ cards, onAddClick, onEditClick, previewMode = false }: CardListProps) {
  const formatDue = (due?: string | null, state?: number) => {
    if (state === 0) return <span className="text-blue-400 font-semibold">New Card</span>;
    if (!due) return <span className="text-neutral-500">Unknown</span>;
    
    const dueDate = new Date(due);
    const now = new Date();
    
    const diffTime = Math.max(0, dueDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes <= 0) return <span className="text-orange-400 font-semibold">Due now</span>;
    if (diffMinutes < 60) return <span className="text-orange-400">In {diffMinutes} mins</span>;
    if (diffDays <= 1) return <span className="text-green-400">Tomorrow</span>;
    
    return <span className="text-neutral-400">In {diffDays} days</span>;
  };

  const displayCards = previewMode && cards ? cards.slice(0, 10) : cards;
  const hiddenCount = previewMode && cards ? Math.max(0, cards.length - 10) : 0;

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {previewMode ? 'Preview Cards' : 'Cards'} 
          {!previewMode && <span className="text-neutral-500 text-base font-normal ml-2">({cards?.length || 0})</span>}
        </h2>
        {!previewMode && onAddClick && (
          <button 
            onClick={onAddClick}
            className="text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 transition-colors"
          >
            + Add Card
          </button>
        )}
      </div>
      
      {(!cards || cards.length === 0) ? (
        <div className={`text-center py-10 bg-neutral-950/30 rounded-2xl border border-dashed border-neutral-800 ${previewMode ? 'text-neutral-500 italic' : 'text-neutral-500'}`}>
          {previewMode ? 'This deck is empty.' : 'No cards in this deck yet. Add some to start learning!'}
        </div>
      ) : (
        <div className="grid gap-3">
          {displayCards?.map((card, idx) => (
            <div 
              key={card.id || idx} 
              className={`p-5 bg-neutral-950/50 border ${previewMode ? 'border-neutral-800/80 hover:border-neutral-700' : 'border-neutral-800 hover:border-neutral-600'} rounded-2xl flex flex-col sm:flex-row gap-4 transition-colors group`}
            >
              <div className="flex-1">
                <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-2">Front</div>
                <div className="text-base text-white">{card.front}</div>
              </div>
              <div className={`hidden sm:block w-px ${previewMode ? 'bg-neutral-800/50' : 'bg-neutral-800 group-hover:bg-neutral-700'} transition-colors`}></div>
              <div className="flex-1">
                <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-2">Back</div>
                <div className={`text-base ${previewMode ? 'text-neutral-400' : 'text-neutral-300'}`}>{card.back}</div>
              </div>
              
              {!previewMode && (
                <>
                  <div className="hidden sm:block w-px bg-neutral-800 group-hover:bg-neutral-700 transition-colors"></div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-2">Next Review</div>
                      <div className="text-sm mt-1">{formatDue(card.due, card.state)}</div>
                    </div>
                    {onEditClick && (
                      <button 
                        onClick={() => onEditClick(card)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-neutral-500 hover:text-white transition-all bg-neutral-900 hover:bg-neutral-800 rounded-lg"
                        title="Edit Card"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
          
          {previewMode && hiddenCount > 0 && (
            <div className="text-center py-6">
              <div className="inline-block px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                + {hiddenCount} more cards hidden
              </div>
              <p className="text-neutral-500 text-sm mt-3">Clone this deck to view and study all cards.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
