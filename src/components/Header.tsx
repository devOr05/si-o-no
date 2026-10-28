import React from 'react';
import { ShieldCheck, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import type { UserVerificationState } from '../types';

interface HeaderProps {
  userState: UserVerificationState;
  onOpenVerificationModal: () => void;
  canInstallPWA: boolean;
  onInstallPWA: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userState,
  onOpenVerificationModal,
  canInstallPWA,
  onInstallPWA
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-emerald/20 via-brand-surface to-brand-crimson/20 border border-slate-700/60 flex items-center justify-center p-1 shadow-inner">
            <span className="font-mono font-black text-sm text-brand-emerald">S</span>
            <span className="text-slate-500 font-mono text-xs">/</span>
            <span className="font-mono font-black text-sm text-brand-crimson">N</span>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-accent animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-accent" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1">
                ¿SÍ O NO?
              </h1>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-brand-accent/10 border border-brand-accent/30 text-brand-accent font-semibold">
                CIVIC TECH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Votación Ciudadana & Noticias Curadas
            </p>
          </div>
        </div>

        {/* Action Pills: PWA install & Verification */}
        <div className="flex items-center gap-2">
          {canInstallPWA && (
            <button
              onClick={onInstallPWA}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-accent/15 hover:bg-brand-accent/25 text-brand-accent border border-brand-accent/30 text-xs font-semibold transition-all active:scale-95"
              title="Instalar aplicación en tu pantalla principal"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar App</span>
            </button>
          )}

          {userState.isCertified ? (
            <button
              onClick={onOpenVerificationModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
              <span className="hidden xs:inline">Ciudadano</span>
              <span>Verificado</span>
            </button>
          ) : (
            <button
              onClick={onOpenVerificationModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 text-sky-300 border border-sky-400/30 text-xs font-medium shadow-sm transition-all active:scale-95 group"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="hidden xs:inline">Obtener</span>
              <span className="font-semibold text-white">Tilde Azul</span>
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
