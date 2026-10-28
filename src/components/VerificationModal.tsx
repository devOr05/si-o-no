import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Eye, 
  CreditCard, 
  Nfc
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { UserVerificationState } from '../types';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserVerificationState;
  onCompleteVerification: (method: 'World ID' | 'DNI + Selfie' | 'DNI NFC') => void;
  onResetVerification: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  userState,
  onCompleteVerification,
  onResetVerification
}) => {
  const [activeStep, setActiveStep] = useState<'options' | 'processing' | 'success'>('options');
  const [selectedMethod, setSelectedMethod] = useState<'World ID' | 'DNI + Selfie' | 'DNI NFC' | null>(null);

  if (!isOpen) return null;

  const handleStartVerification = (method: 'World ID' | 'DNI + Selfie' | 'DNI NFC') => {
    setSelectedMethod(method);
    setActiveStep('processing');

    setTimeout(() => {
      onCompleteVerification(method);
      setActiveStep('success');

      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#38bdf8', '#818cf8', '#34d399', '#f59e0b']
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-600/30 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              Identidad Cívica & Tilde Azul
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Blindaje antibots: 1 persona real = 1 voto certificado
            </p>
          </div>
        </div>

        {/* If already certified */}
        {userState.isCertified && activeStep !== 'processing' ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto fill-emerald-500/20" />
              <h4 className="text-base font-bold text-white">¡Eres un Ciudadano Verificado!</h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed max-w-sm mx-auto">
                Tu identidad fue acreditada mediante <strong className="text-white">{userState.certificationMethod}</strong>. Todos tus votos se computan en la métrica oficial de <strong className="text-emerald-300">Voto Certificado Único ✓</strong> con respaldo criptográfico.
              </p>
              <div className="pt-2 font-mono text-[11px] text-slate-400">
                Identificador ZK Anónimo: <code className="text-sky-300 bg-slate-900 px-2 py-0.5 rounded">{userState.voterBadgeId}</code>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                onClick={onResetVerification}
                className="text-slate-500 hover:text-slate-300 underline font-mono text-[11px]"
              >
                (Pruebas) Restablecer verificación
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : activeStep === 'processing' ? (
          /* Processing Step */
          <div className="py-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-full border-4 border-sky-400/20 border-t-sky-400 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Verificando Credencial con {selectedMethod}...</h4>
              <p className="text-xs text-slate-400 font-mono">
                Generando Nullifier criptográfico Zero-Knowledge para voto secreto...
              </p>
            </div>
          </div>
        ) : (
          /* Selection Step */
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Para garantizar que los resultados de las leyes no sean distorsionados por cuentas falsas o granjas de bots, puedes obtener tu <strong>Tilde Verificada</strong> usando cualquiera de los siguientes métodos oficiales:
            </p>

            <div className="space-y-2.5">
              {/* Option A: World ID */}
              <button
                onClick={() => handleStartVerification('World ID')}
                className="w-full p-4 rounded-xl glass-card border border-slate-700/80 hover:border-sky-400/50 hover:bg-slate-800/60 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-sky-400 group-hover:border-sky-400/40 transition-colors">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <span>World ID (Worldcoin)</span>
                      <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 text-[10px] font-mono font-normal">
                        Recomendado
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Prueba biométrica de humanidad con ZK-Proofs. 0 datos personales.
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-sky-400 group-hover:translate-x-1 transition-transform">
                  Vincular →
                </span>
              </button>

              {/* Option B: DNI + Selfie */}
              <button
                onClick={() => handleStartVerification('DNI + Selfie')}
                className="w-full p-4 rounded-xl glass-card border border-slate-700/80 hover:border-emerald-400/50 hover:bg-slate-800/60 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:border-emerald-400/40 transition-colors">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <span>DNI Físico + Selfie de Vida</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Validación de documento argentino frente/dorso y prueba facial.
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Escanear →
                </span>
              </button>

              {/* Option C: DNI Chip NFC */}
              <button
                onClick={() => handleStartVerification('DNI NFC')}
                className="w-full p-4 rounded-xl glass-card border border-slate-700/80 hover:border-purple-400/50 hover:bg-slate-800/60 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-purple-400 group-hover:border-purple-400/40 transition-colors">
                    <Nfc className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <span>DNI Electrónico / Chip NFC</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Apoya tu DNI contra el celular para firma criptográfica local.
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-purple-400 group-hover:translate-x-1 transition-transform">
                  Apoyar →
                </span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>
                <strong>Garantía de Voto Secreto:</strong> Ninguno de los métodos asocia tu nombre o documento al sentido de tu voto. La red criptográfica solo certifica que eres 1 ciudadano único mediante claves anónimas.
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
