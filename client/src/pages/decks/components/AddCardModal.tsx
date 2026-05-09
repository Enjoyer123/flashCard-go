import React, { useState, useEffect } from 'react';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (front: string, back: string) => void;
  isCreating: boolean;
}

export default function AddCardModal({ isOpen, onClose, onAdd, isCreating }: AddCardModalProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFront('');
      setBack('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAdd(front, back);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold mb-6 text-white">Add New Card</h2>
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
              disabled={isCreating}
              className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Adding...' : 'Add Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
