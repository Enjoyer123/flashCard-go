import React, { useState, useEffect } from 'react';
import type { CardSummary } from '../../../types/deck';

interface EditCardModalProps {
  card: CardSummary | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (cardId: string, front: string, back: string) => void;
  isUpdating: boolean;
}

export default function EditCardModal({ card, isOpen, onClose, onEdit, isUpdating }: EditCardModalProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  useEffect(() => {
    if (card && isOpen) {
      setFront(card.front);
      setBack(card.back);
    }
  }, [card, isOpen]);

  if (!isOpen || !card) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit(card.id, front, back);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold mb-6 text-white">Edit Card</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Front (Question/Word)</label>
            <textarea 
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-white transition-all h-20 resize-none"
              placeholder="e.g. 食べる"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Back (Answer/Meaning)</label>
            <textarea 
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-white transition-all h-24 resize-none"
              placeholder="to eat"
              required
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUpdating}
              className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
