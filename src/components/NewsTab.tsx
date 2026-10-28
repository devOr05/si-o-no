import React, { useState } from 'react';
import { 
  Newspaper, 
  Sparkles, 
  Search, 
  ExternalLink, 
  Heart, 
  Share2, 
  Clock, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import type { NewsArticle, NewsCategory } from '../types';

interface NewsTabProps {
  news: NewsArticle[];
  onToggleLike: (articleId: string) => void;
  onRefreshNews?: () => void;
  isRefreshing?: boolean;
}

const CATEGORIES: NewsCategory[] = [
  'Todos',
  'Política',
  'Economía',
  'Sociedad',
  'Tecnología',
  'Espectáculos',
  'Deportes'
];

export const NewsTab: React.FC<NewsTabProps> = ({ 
  news, 
  onToggleLike, 
  onRefreshNews, 
  isRefreshing 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNews = news.filter((item) => {
    const matchCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.bullets.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleShare = (article: NewsArticle) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: `Noticia en ¿Sí o No?: ${article.title}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.title} - Leído en ¿Sí o No?`);
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-5">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase font-mono">
                Actualidad Curada & Síntesis con IA
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed mt-1">
              Las noticias más importantes de Argentina y el mundo procesadas por inteligencia artificial en <strong className="text-amber-300">3 puntos clave fácticos</strong>, sin clickbait ni adjetivos valorativos.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onRefreshNews && (
              <button
                onClick={onRefreshNews}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold transition-all active:scale-95 disabled:opacity-50"
                title="Actualizar noticias en vivo scrapeando Clarín, La Nación y BBC Mundo"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
                <span>{isRefreshing ? 'Scrapeando...' : 'Scrapear en Vivo'}</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Monitoreo 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por tema, medio o palabra clave..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg border font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 font-semibold shadow-sm'
                  : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl border border-slate-800">
            <Newspaper className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium">No se encontraron noticias en esta categoría.</p>
          </div>
        ) : (
          filteredNews.map((item) => (
            <article
              key={item.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700/80 transition-all shadow-md space-y-3.5"
            >
              {/* Card Meta Header */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
                    {item.sourceLogoText}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{item.category}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{item.timeAgo}</span>
                  <span>•</span>
                  <span>{item.readTime}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug hover:text-amber-300 transition-colors">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h3>

              {/* 3 Executive Bullets by AI */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800/80 p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Síntesis en 3 Balas Fácticas (IA):</span>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 mt-1.5 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleLike(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                      item.userLiked
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold'
                        : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800/40'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.userLiked ? 'fill-rose-500' : ''}`} />
                    <span>{item.likes}</span>
                  </button>

                  <button
                    onClick={() => handleShare(item)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all font-mono"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedId === item.id ? '¡Copiado!' : 'Compartir'}</span>
                  </button>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-400 hover:text-sky-300 font-mono text-[11px] transition-colors"
                >
                  <span>Leer fuente en {item.source}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
