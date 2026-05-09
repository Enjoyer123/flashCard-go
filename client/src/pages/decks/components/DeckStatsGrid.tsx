import type{ DeckStats } from '../../../types/deck';

interface DeckStatsGridProps {
  stats?: DeckStats;
}

export default function DeckStatsGrid({ stats }: DeckStatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-neutral-950/50 border border-neutral-800 p-6 rounded-2xl">
        <div className="text-neutral-500 text-xs font-medium mb-1 uppercase tracking-wider">Total Cards</div>
        <div className="text-3xl font-bold text-white">{stats?.total_cards || 0}</div>
      </div>
      <div className="bg-neutral-950/50 border border-blue-900/30 p-6 rounded-2xl">
        <div className="text-blue-500/70 text-xs font-medium mb-1 uppercase tracking-wider">New</div>
        <div className="text-3xl font-bold text-blue-400">{stats?.new_cards || 0}</div>
      </div>
      <div className="bg-neutral-950/50 border border-orange-900/30 p-6 rounded-2xl">
        <div className="text-orange-500/70 text-xs font-medium mb-1 uppercase tracking-wider">Learning</div>
        <div className="text-3xl font-bold text-orange-400">{stats?.learning_cards || 0}</div>
      </div>
      <div className="bg-neutral-950/50 border border-green-900/30 p-6 rounded-2xl">
        <div className="text-green-500/70 text-xs font-medium mb-1 uppercase tracking-wider">To Review</div>
        <div className="text-3xl font-bold text-green-400">{stats?.review_cards || 0}</div>
      </div>
    </div>
  );
}
