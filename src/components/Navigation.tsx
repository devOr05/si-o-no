import React from 'react';
import { Landmark, Newspaper, Users, Flame } from 'lucide-react';

export type ActiveTab = 'congress' | 'news' | 'community';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingBillsCount: number;
  trendingPollsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  pendingBillsCount,
  trendingPollsCount
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-3 pb-1">
      <nav className="glass-card rounded-2xl p-1.5 flex items-center justify-between border border-slate-800 shadow-xl">
        
        {/* Tab 1: Congreso */}
        <button
          onClick={() => onTabChange('congress')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
            activeTab === 'congress'
              ? 'bg-gradient-to-r from-sky-500/20 to-blue-600/30 text-white border border-sky-400/30 shadow-md glow-accent'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Landmark className={`w-4 h-4 ${activeTab === 'congress' ? 'text-brand-accent' : 'text-slate-500'}`} />
          <span>Leyes / Congreso</span>
          {pendingBillsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-crimson/80 text-white text-[10px] font-mono flex items-center justify-center font-bold">
              {pendingBillsCount}
            </span>
          )}
        </button>

        {/* Tab 2: Noticias */}
        <button
          onClick={() => onTabChange('news')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'news'
              ? 'bg-gradient-to-r from-amber-500/20 to-yellow-600/30 text-white border border-amber-400/30 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Newspaper className={`w-4 h-4 ${activeTab === 'news' ? 'text-amber-400' : 'text-slate-500'}`} />
          <span>Noticias</span>
          <span className="hidden sm:inline text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            IA
          </span>
        </button>

        {/* Tab 3: Comunidad */}
        <button
          onClick={() => onTabChange('community')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
            activeTab === 'community'
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-600/30 text-white border border-purple-400/30 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Users className={`w-4 h-4 ${activeTab === 'community' ? 'text-purple-400' : 'text-slate-500'}`} />
          <span>Tu Sí o No</span>
          {trendingPollsCount > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Flame className="w-2.5 h-2.5 text-orange-400 fill-orange-400" />
              <span>{trendingPollsCount}</span>
            </span>
          )}
        </button>

      </nav>
    </div>
  );
};
