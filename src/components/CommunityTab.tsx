import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Check, 
  X, 
  Flame, 
  Clock, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  Send,
  Radio,
  Globe,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CommunityPoll, UserVerificationState } from '../types';
import { networkService } from '../services/networkService';

interface CommunityTabProps {
  polls: CommunityPoll[];
  userState: UserVerificationState;
  onVotePoll: (pollId: string, choice: 'yes' | 'no') => void;
  onCreatePoll: (poll: Omit<CommunityPoll, 'id' | 'votes' | 'userVoted' | 'commentsCount' | 'timeAgo'>) => void;
}

export const CommunityTab: React.FC<CommunityTabProps> = ({
  polls,
  userState,
  onVotePoll,
  onCreatePoll
}) => {
  const [subTab, setSubTab] = useState<'trending' | 'recent'>('trending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [newQuestion, setNewQuestion] = useState('');
  const [newContext, setNewContext] = useState('');
  const [newCategory, setNewCategory] = useState('Sociedad');
  const [isModerating, setIsModerating] = useState(false);

  const handleVote = (pollId: string, choice: 'yes' | 'no') => {
    onVotePoll(pollId, choice);
    if (choice === 'yes') {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#10b981', '#a7f3d0']
      });
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setIsModerating(true);

    // Simulate AI Moderation pipeline
    setTimeout(() => {
      setIsModerating(false);
      onCreatePoll({
        author: userState.isCertified ? 'Tú (Verificado ✓)' : 'Tú (Comunidad)',
        isAuthorVerified: userState.isCertified,
        category: newCategory,
        question: newQuestion.trim(),
        context: newContext.trim() || undefined,
        isTrending: false
      });

      setNewQuestion('');
      setNewContext('');
      setIsModalOpen(false);

      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 800);
  };

  const handleShare = (poll: CommunityPoll) => {
    if (navigator.share) {
      navigator.share({
        title: poll.question,
        text: `¿Qué opinas? Vota Sí o No: "${poll.question}"`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`¿Qué opinas? Vota Sí o No: "${poll.question}" en https://si-o-no.vercel.app`);
      setCopiedId(poll.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const sortedPolls = [...polls].sort((a, b) => {
    if (subTab === 'trending') {
      const totalA = a.votes.yes + a.votes.no;
      const totalB = b.votes.yes + b.votes.no;
      return totalB - totalA;
    }
    return 0; // recent
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-5">
      
      {/* Intro Banner */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase font-mono">
                Comunidad: Tu Sí o No (UGC)
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Crea tus propias votaciones sobre debates de actualidad, tendencias, cultura o decisiones comunitarias. Respuestas directas sin filtro ni encuestas engorrosas.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Crear Pregunta</span>
          </button>
        </div>
      </div>

      {/* Live Decentralized Network Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono shadow-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-semibold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              Red Descentralizada en Vivo
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">(Relays: nos.lol, relay.primal.net)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Visible para toda la red</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-400" title="Tu clave pública de firma en la red">
            <Lock className="w-3 h-3 text-slate-500" />
            <span>ID: {networkService.getShortKey()}</span>
          </span>
        </div>
      </div>

      {/* Subtabs Filter */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <button
          onClick={() => setSubTab('trending')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border transition-all ${
            subTab === 'trending'
              ? 'bg-purple-500/20 text-purple-300 border-purple-400/40 font-semibold'
              : 'border-slate-800/80 text-slate-400 hover:bg-slate-800/40'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Tendencias</span>
        </button>

        <button
          onClick={() => setSubTab('recent')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border transition-all ${
            subTab === 'recent'
              ? 'bg-purple-500/20 text-purple-300 border-purple-400/40 font-semibold'
              : 'border-slate-800/80 text-slate-400 hover:bg-slate-800/40'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Recientes</span>
        </button>
      </div>

      {/* Community Polls Feed */}
      <div className="space-y-4">
        {sortedPolls.map((poll) => {
          const totalVotes = poll.votes.yes + poll.votes.no;
          const yesPct = totalVotes > 0 ? Math.round((poll.votes.yes / totalVotes) * 100) : 50;
          const noPct = 100 - yesPct;

          return (
            <div
              key={poll.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700/80 transition-all shadow-md space-y-3.5"
            >
              {/* Poll Header Meta */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200 flex items-center gap-1">
                    {poll.author}
                    {poll.isAuthorVerified && (
                      <span title="Usuario Verificado">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
                      </span>
                    )}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] border border-purple-500/20 font-sans">
                    {poll.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  {poll.isTrending && (
                    <span className="flex items-center gap-0.5 text-orange-400 font-bold">
                      <Flame className="w-3 h-3 fill-orange-400" />
                      <span>TRENDING</span>
                    </span>
                  )}
                  <span>{poll.timeAgo}</span>
                </div>
              </div>

              {/* Question */}
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {poll.question}
              </h3>

              {/* Context if provided */}
              {poll.context && (
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                  {poll.context}
                </p>
              )}

              {/* Voting Action */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => handleVote(poll.id, 'yes')}
                  className={`py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    poll.userVoted === 'yes'
                      ? 'bg-emerald-500 text-slate-950 font-black ring-4 ring-emerald-500/30'
                      : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>SÍ</span>
                  {poll.userVoted && <span className="font-mono text-xs ml-1">({yesPct}%)</span>}
                </button>

                <button
                  onClick={() => handleVote(poll.id, 'no')}
                  className={`py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    poll.userVoted === 'no'
                      ? 'bg-rose-600 text-white font-black ring-4 ring-rose-600/30'
                      : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <X className="w-4 h-4 stroke-[3]" />
                  <span>NO</span>
                  {poll.userVoted && <span className="font-mono text-xs ml-1">({noPct}%)</span>}
                </button>
              </div>

              {/* Real-time Result Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                  <div style={{ width: `${yesPct}%` }} className="h-full bg-emerald-500 transition-all duration-300" />
                  <div style={{ width: `${noPct}%` }} className="h-full bg-rose-600 transition-all duration-300" />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{totalVotes.toLocaleString()} votos comunitarios</span>
                  <span>
                    <strong className="text-emerald-400">{yesPct}% SÍ</strong> — <strong className="text-rose-400">{noPct}% NO</strong>
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{poll.commentsCount} comentarios</span>
                </div>

                <button
                  onClick={() => handleShare(poll)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors font-mono"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedId === poll.id ? '¡Copiado!' : 'Compartir'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE POLL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                  ?
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Crear Nuevo "Sí o No"</h3>
                  <p className="text-[11px] text-slate-400 font-mono">La comunidad votará con [ SÍ ] o [ NO ]</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Pregunta Central (Directa y concisa):
                </label>
                <textarea
                  required
                  maxLength={140}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ej: ¿Debería implementarse el juicio por jurados en todas las provincias?"
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all resize-none"
                />
                <div className="text-[10px] font-mono text-slate-500 text-right">
                  {newQuestion.length}/140 caracteres
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Contexto o breve explicación (Opcional):
                </label>
                <textarea
                  maxLength={250}
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="Añade datos o argumentos para contextualizar la votación..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Categoría Temática:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="Sociedad">Sociedad & Convivencia</option>
                  <option value="Justicia">Justicia & Leyes</option>
                  <option value="Economía">Economía & Trabajo</option>
                  <option value="Educación">Educación & Ciencia</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Cultura">Cultura & Espectáculos</option>
                </select>
              </div>

              {/* AI Moderation notice */}
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-white text-[11px]">Moderación Preventiva con IA</div>
                  <div className="text-[10px] text-purple-300/80">
                    Tu pregunta será analizada para certificar que cumpla con las pautas comunitarias (cero discriminación, doxxing o spam).
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={!newQuestion.trim() || isModerating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all active:scale-95"
                >
                  {isModerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-purple-200" />
                      <span>Auditando con IA...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Publicar Pregunta</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
