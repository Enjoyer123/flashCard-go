import { Link } from 'react-router-dom';

interface DeckCardProps {
  id: string;
  title: string;
  description: string;
  linkTo: string;
  variant?: 'dashboard' | 'explore';
  createdAt?: string;
  isPublic?: boolean;
}

export default function DeckCard({ 
  title, 
  description, 
  linkTo, 
  variant = 'dashboard', 
  createdAt, 
  isPublic 
}: DeckCardProps) {
  if (variant === 'explore') {
    return (
      <Link 
        to={linkTo}
        className="group bg-neutral-950/50 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-600 transition-all hover:bg-neutral-900/50 flex flex-col h-full"
      >
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">{title}</h3>
          <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{description || 'No description provided.'}</p>
        </div>
        <div className="flex items-center text-xs text-blue-500 font-bold uppercase tracking-wider mt-4">
          <span>View Details & Clone &rarr;</span>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={linkTo}
      className="group relative flex flex-col justify-between p-6 bg-neutral-950/50 border border-neutral-800 rounded-3xl hover:border-neutral-600 hover:bg-neutral-900/80 transition-all cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-white text-neutral-100 transition-colors">{title}</h3>
        <p className="text-neutral-400 text-sm line-clamp-2">{description || 'No description provided'}</p>
      </div>

      <div className="relative z-10 mt-8 flex items-center justify-between text-xs font-medium">
        {createdAt && (
          <span className="text-neutral-500">
            {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
        {isPublic !== undefined && (
          <span className={`px-2.5 py-1 rounded-md border ${isPublic ? 'border-blue-900/50 text-blue-400 bg-blue-950/30' : 'border-neutral-800 text-neutral-400 bg-neutral-900/50'}`}>
            {isPublic ? 'Public' : 'Private'}
          </span>
        )}
      </div>
    </Link>
  );
}
