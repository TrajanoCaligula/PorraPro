
import React from 'react';

export const COLORS = {
  green: '#00C97B',
  greenDark: '#009B5E',
  gold: '#FFD700',
  blueDeep: '#0F1B2D',
  blueMid: '#162236',
  blueLight: '#1E3050',
  surface: '#1A2B42',
  text: '#E8F4FF',
  textDim: '#7A9CC0',
  red: '#FF4757',
  orange: '#FF8C00',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

export const PHASES_LABELS: Record<string, string> = {
  group: 'Fase de Grupos',
  round16: 'Octavos de Final',
  quarter: 'Cuartos de Final',
  semi: 'Semifinales',
  final: 'Final',
};

export const Logo: React.FC<{ className?: string }> = ({ className = "h-8" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative w-8 h-8 rounded-[14px] bg-gradient-to-br from-brand-green to-brand-green-dark flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,201,123,0.4)]">
      <span className="text-xl">⚽</span>
      <div className="absolute bottom-1 right-1 flex gap-0.5 items-end">
        <div className="w-1 h-2 bg-brand-gold rounded-full"></div>
        <div className="w-1 h-3 bg-brand-gold rounded-full"></div>
        <div className="w-1 h-4 bg-brand-gold rounded-full"></div>
      </div>
    </div>
    <span className="display-font text-2xl font-black tracking-tight text-white">PORRA <span className="text-brand-green">PRO</span></span>
  </div>
);
