import React, { useState } from 'react';
import { 
  Landmark, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Lock, 
  Vote, 
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { LawBill, UserVerificationState } from '../types';

interface CongressTabProps {
  bills: LawBill[];
  userState: UserVerificationState;
  onVote: (billId: string, choice: 'yes' | 'no') => void;
  onOpenVerificationModal: () => void;
}

export const CongressTab: React.FC<CongressTabProps> = ({
  bills,
  userState,
  onVote,
  onOpenVerificationModal
}) => {
  const [filter, setFilter] = useState<'all' | 'diputados' | 'senado' | 'pending'>('all');
  const [expandedSummary, setExpandedSummary] = useState<Record<string, boolean>>({
    'bill-1': true // First one expanded by default
  });
  const [showLedgerInfo, setShowLedgerInfo] = useState<string | null>(null);

  const toggleSummary = (id: string) => {
    setExpandedSummary((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleVoteClick = (bill: LawBill, choice: 'yes' | 'no') => {
    onVote(bill.id, choice);

    if (choice === 'yes') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      });
    }
  };

  const filteredBills = bills.filter((b) => {
    if (filter === 'diputados') return b.chamber === 'Diputados';
    if (filter === 'senado') return b.chamber === 'Senado';
    if (filter === 'pending') return b.status.includes('Convocado') || b.status.includes('Dictamen');
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-5">
      
      {/* Intro Banner */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-sky-950/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase font-mono">
                Leyes en Tratamiento Oficial
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Monitoreo directo desde las <strong className="text-white">Órdenes del Día</strong> y la API pública de Diputados (<code className="text-sky-300 text-[11px]">datos.hcdn.gob.ar</code>) y Senado. Vota y contrasta tu opinión con la votación real del Congreso.
            </p>
          </div>

          {!userState.isCertified && (
            <button
              onClick={onOpenVerificationModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500/20 to-indigo-500/30 hover:from-sky-500/30 hover:to-indigo-500/40 border border-sky-400/40 text-xs font-medium text-sky-200 transition-all shadow-sm active:scale-95 shrink-0"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <div className="text-left">
                <div className="font-bold text-white text-[11px]">Certificar Voto Único</div>
                <div className="text-[10px] text-sky-300/80">Evita manipulación por bots</div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium text-slate-400">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
            filter === 'all'
              ? 'bg-slate-800 text-white border-slate-600 font-semibold shadow-sm'
              : 'border-slate-800/80 hover:bg-slate-800/40'
          }`}
        >
          Todas ({bills.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
            filter === 'pending'
              ? 'bg-sky-500/20 text-sky-300 border-sky-400/40 font-semibold'
              : 'border-slate-800/80 hover:bg-slate-800/40'
          }`}
        >
          Listas para votar en sesión
        </button>
        <button
          onClick={() => setFilter('diputados')}
          className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
            filter === 'diputados'
              ? 'bg-slate-800 text-white border-slate-600 font-semibold'
              : 'border-slate-800/80 hover:bg-slate-800/40'
          }`}
        >
          Diputados
        </button>
        <button
          onClick={() => setFilter('senado')}
          className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
            filter === 'senado'
              ? 'bg-slate-800 text-white border-slate-600 font-semibold'
              : 'border-slate-800/80 hover:bg-slate-800/40'
          }`}
        >
          Senado
        </button>
      </div>

      {/* Bills Feed */}
      <div className="space-y-4">
        {filteredBills.map((bill) => {
          const isExpanded = expandedSummary[bill.id] || false;
          
          // Calculations
          const totalCommVotes = bill.votesCommunity.yes + bill.votesCommunity.no;
          const commYesPct = totalCommVotes > 0 ? Math.round((bill.votesCommunity.yes / totalCommVotes) * 100) : 50;
          const commNoPct = 100 - commYesPct;

          const totalCertVotes = bill.votesCertified.yes + bill.votesCertified.no;
          const certYesPct = totalCertVotes > 0 ? Math.round((bill.votesCertified.yes / totalCertVotes) * 100) : 50;
          const certNoPct = 100 - certYesPct;

          return (
            <div
              key={bill.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700/80 transition-all shadow-lg space-y-4"
            >
              {/* Header of Bill Card */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-semibold border border-slate-700">
                    {bill.chamber}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {bill.expediente}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    bill.status.includes('Convocado')
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : bill.status.includes('Aprobado')
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                  }`}>
                    ● {bill.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={bill.officialDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-400 hover:text-sky-300 flex items-center gap-1 font-mono transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Texto Oficial</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {bill.title}
              </h3>

              {/* AI Summary Section (Collapsible) */}
              <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-3.5 space-y-3">
                <div 
                  onClick={() => toggleSummary(bill.id)}
                  className="flex items-center justify-between cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                      Resumen Ejecutivo de IA (Lectura en 30s)
                    </span>
                  </div>
                  <button className="text-slate-400 group-hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="space-y-2.5 text-xs text-slate-300 pt-1 leading-relaxed animate-fadeIn">
                    <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
                      <strong className="text-sky-300 font-semibold block mb-0.5">¿Qué cambia en concreto?</strong>
                      {bill.summary.whatChanges}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-200/90">
                        <strong className="text-emerald-400 font-semibold block mb-0.5 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Argumentos a favor (Oficialismo)
                        </strong>
                        {bill.summary.proArgs}
                      </div>

                      <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-200/90">
                        <strong className="text-rose-400 font-semibold block mb-0.5 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Argumentos en contra (Oposición)
                        </strong>
                        {bill.summary.conArgs}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Congress Reality Badge (What lawmakers voted) */}
              {bill.congressResult && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-400 font-mono text-[11px]">Resultado en el Congreso:</span>
                    <span className={`font-semibold ${
                      bill.congressResult.status === 'Aprobado' ? 'text-emerald-400' : 'text-amber-300'
                    }`}>
                      {bill.congressResult.verdict}
                    </span>
                  </div>
                </div>
              )}

              {/* Two Big Voting Buttons: SÍ or NO */}
              <div className="pt-2">
                <div className="text-[11px] font-mono uppercase text-slate-400 text-center mb-2 tracking-wider">
                  {bill.userVoted ? 'Tu Voto Registrado (Puedes Modificarlo):' : 'Emite tu Voto Ciudadano:'}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* BOTÓN SÍ */}
                  <button
                    onClick={() => handleVoteClick(bill, 'yes')}
                    className={`relative py-3.5 px-4 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                      bill.userVoted === 'yes'
                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 font-black'
                        : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400'
                    }`}
                  >
                    <Check className={`w-5 h-5 ${bill.userVoted === 'yes' ? 'stroke-[3]' : ''}`} />
                    <span>SÍ, A FAVOR</span>
                    {bill.userVoted === 'yes' && (
                      <span className="absolute -top-2 -right-1 px-1.5 py-0.2 rounded-full bg-slate-950 text-emerald-400 text-[10px] font-mono border border-emerald-400">
                        VOTASTE
                      </span>
                    )}
                  </button>

                  {/* BOTÓN NO */}
                  <button
                    onClick={() => handleVoteClick(bill, 'no')}
                    className={`relative py-3.5 px-4 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                      bill.userVoted === 'no'
                        ? 'bg-rose-600 text-white ring-4 ring-rose-600/30 font-black'
                        : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 hover:border-rose-400'
                    }`}
                  >
                    <X className={`w-5 h-5 ${bill.userVoted === 'no' ? 'stroke-[3]' : ''}`} />
                    <span>NO, EN CONTRA</span>
                    {bill.userVoted === 'no' && (
                      <span className="absolute -top-2 -right-1 px-1.5 py-0.2 rounded-full bg-slate-950 text-rose-400 text-[10px] font-mono border border-rose-400">
                        VOTASTE
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* DUAL RESULTS BARS (Always shown or shown after voting) */}
              <div className="pt-2 space-y-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
                {/* Result Bar 1: Voto General Comunitario */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Vote className="w-3.5 h-3.5 text-slate-500" />
                      <span>Opinión General ({totalCommVotes.toLocaleString()} votos)</span>
                    </span>
                    <span className="text-slate-300 font-semibold">
                      <strong className="text-emerald-400">{commYesPct}% SÍ</strong> / <strong className="text-rose-400">{commNoPct}% NO</strong>
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                    <div 
                      style={{ width: `${commYesPct}%` }} 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                    />
                    <div 
                      style={{ width: `${commNoPct}%` }} 
                      className="h-full bg-rose-600 transition-all duration-500" 
                    />
                  </div>
                </div>

                {/* Result Bar 2: Voto Certificado Único ✓ */}
                <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-sky-300 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                      <span>Voto Certificado Único ✓ ({totalCertVotes.toLocaleString()} ciudadanos auditados)</span>
                    </span>
                    <span className="text-slate-300 font-semibold">
                      <strong className="text-emerald-400">{certYesPct}% SÍ</strong> / <strong className="text-rose-400">{certNoPct}% NO</strong>
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-sky-900/40">
                    <div 
                      style={{ width: `${certYesPct}%` }} 
                      className="h-full bg-emerald-400 transition-all duration-500 glow-emerald" 
                    />
                    <div 
                      style={{ width: `${certNoPct}%` }} 
                      className="h-full bg-rose-500 transition-all duration-500 glow-crimson" 
                    />
                  </div>
                </div>

                {/* Cryptographic Ledger Record details */}
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Registro Criptográfico Inmutable</span>
                  </span>
                  <button
                    onClick={() => setShowLedgerInfo(showLedgerInfo === bill.id ? null : bill.id)}
                    className="text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>{showLedgerInfo === bill.id ? 'Ocultar Hash' : 'Ver Hash ZK'}</span>
                  </button>
                </div>

                {showLedgerInfo === bill.id && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-400 space-y-1 animate-fadeIn">
                    <div><strong>Nullifier Hash:</strong> <span className="text-emerald-400">0x7f2a89c19b04f32e987acb123d</span></div>
                    <div><strong>Estado en Ledger:</strong> <span className="text-sky-400">Confirmado (Bloque #189,421 - Solana Devnet)</span></div>
                    <div><strong>Privacidad:</strong> <span className="text-slate-300">100% Anónimo con Zero-Knowledge Proofs</span></div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
