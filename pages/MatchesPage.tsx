
import React, { useState } from 'react';
import { MATCHES, COUNTRIES } from '../mockData';
import { PHASES_LABELS } from '../constants';

const MatchesPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('group');

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <header className="space-y-6">
        <h1 className="text-4xl font-black">Calendario de Pronósticos</h1>
        
        {/* Phase Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {Object.entries(PHASES_LABELS).map(([key, label]) => (
            <button 
              key={key} 
              onClick={() => setActiveTab(key)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all border ${
                activeTab === key 
                  ? 'bg-brand-green text-brand-blue-deep border-brand-green' 
                  : 'bg-brand-blue-mid text-brand-text-dim border-brand-blue-light hover:border-brand-green/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sub Filters */}
        <div className="flex gap-6 border-b border-brand-blue-light">
          {['Todos', 'Pendiente', 'Finalizado'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f.toLowerCase())}
              className={`pb-4 px-2 font-bold text-sm uppercase tracking-widest transition-all relative ${
                filter === f.toLowerCase() ? 'text-brand-green' : 'text-brand-text-dim'
              }`}
            >
              {f}
              {filter === f.toLowerCase() && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-green rounded-full"></div>}
            </button>
          ))}
        </div>
      </header>

      {/* Matches List */}
      <div className="space-y-4">
        {MATCHES.map(match => (
          <div key={match.id} className={`bg-brand-blue-mid border rounded-2xl overflow-hidden transition-all ${
            match.status === 'live' ? 'border-brand-green shadow-[0_0_20px_rgba(0,201,123,0.1)]' : 'border-brand-blue-light'
          }`}>
            <div className="bg-brand-surface px-6 py-3 flex justify-between items-center border-b border-brand-blue-light">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest bg-brand-blue-light px-2 py-0.5 rounded text-brand-text-dim">
                  {PHASES_LABELS[match.phase]}
                </span>
                <span className="text-xs font-bold text-brand-text-dim">Martes 15 Junio · 21:00</span>
              </div>
              <div className="bg-brand-green/10 text-brand-green text-[10px] px-2 py-0.5 rounded font-black">×{match.mult.toFixed(1)}</div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 items-center gap-8">
              <div className="flex items-center justify-end gap-6 order-1">
                <span className="font-black text-xl text-right hidden md:block">{match.home}</span>
                <span className="text-5xl">{match.homeFlag}</span>
              </div>

              <div className="flex flex-col items-center gap-4 order-2">
                {match.status === 'finished' ? (
                  <div className="text-center space-y-1">
                    <p className="text-4xl font-black mono-font tracking-tighter">{match.realScore}</p>
                    <p className="text-[10px] font-bold text-brand-text-dim uppercase">Resultado Final</p>
                  </div>
                ) : match.status === 'live' ? (
                  <div className="text-center space-y-1">
                    <div className="flex items-center gap-4">
                      <p className="text-4xl font-black mono-font tracking-tighter animate-pulse text-brand-green">{match.liveScore}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-red animate-ping"></span>
                      <p className="text-xs font-bold text-brand-red uppercase">{match.minute}' LIVE</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <input 
                      type="number" 
                      defaultValue={match.myPred?.split('-')[0]}
                      className="w-12 h-14 bg-brand-blue-deep border border-brand-blue-light rounded-xl text-center text-xl font-black focus:border-brand-green outline-none" 
                    />
                    <span className="text-brand-text-dim font-black">-</span>
                    <input 
                      type="number" 
                      defaultValue={match.myPred?.split('-')[1]}
                      className="w-12 h-14 bg-brand-blue-deep border border-brand-blue-light rounded-xl text-center text-xl font-black focus:border-brand-green outline-none" 
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-start gap-6 order-3">
                <span className="text-5xl">{match.awayFlag}</span>
                <span className="font-black text-xl text-left hidden md:block">{match.away}</span>
              </div>
            </div>

            {/* Footer / Results Info */}
            <div className="px-6 py-4 bg-brand-blue-deep/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-wider">
              {match.status === 'finished' ? (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-brand-text-dim">Tu pronóstico: <span className="text-white">{match.myPred}</span></span>
                    {match.result === 'exact' && <span className="bg-brand-gold text-brand-blue-deep px-2 py-1 rounded">🎯 ¡EXACTO! +15 PTS</span>}
                    {match.result === 'sign' && <span className="bg-brand-green text-brand-blue-deep px-2 py-1 rounded">✅ ¡SIGNO! +5 PTS</span>}
                  </div>
                  <span className="text-brand-text-dim">Se han repartido {match.pts} puntos</span>
                </>
              ) : (
                <>
                  <span className="text-brand-orange">Límite: 2h 14m</span>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-brand-surface border border-brand-blue-light flex items-center justify-center text-[10px]">👤</div>)}
                    </div>
                    <span className="text-brand-text-dim">+15 amigos han pronosticado</span>
                  </div>
                  <button className="bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep px-6 py-2 rounded-lg font-black transition-all">
                    Guardar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Special Predictions Component */}
      <section className="mt-16 bg-brand-blue-mid border border-brand-gold/30 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <span className="text-9xl">🏆</span>
        </div>
        <div className="relative space-y-6">
          <h2 className="text-3xl font-black text-brand-gold">Pronósticos Bonus</h2>
          <p className="text-brand-text-dim max-w-lg">Estos pronósticos se cerrarán al comenzar el primer partido del Mundial. ¡Gana puntos extra por el final del torneo!</p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-text-dim">🏆 Equipo Campeón (+15 pts)</label>
              <select className="w-full bg-brand-blue-deep border border-brand-blue-light rounded-xl p-4 font-bold outline-none focus:border-brand-gold appearance-none">
                <option>Selecciona selección...</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-text-dim">👟 Máximo Goleador (+10 pts)</label>
              <input type="text" placeholder="Nombre del jugador..." className="w-full bg-brand-blue-deep border border-brand-blue-light rounded-xl p-4 font-bold outline-none focus:border-brand-gold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-text-dim">🥈 Finalista (+8 pts)</label>
              <select className="w-full bg-brand-blue-deep border border-brand-blue-light rounded-xl p-4 font-bold outline-none focus:border-brand-gold appearance-none">
                <option>Selecciona selección...</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-text-dim">⚽ Total goles (±3) (+5 pts)</label>
              <input type="number" placeholder="ej. 172" className="w-full bg-brand-blue-deep border border-brand-blue-light rounded-xl p-4 font-bold outline-none focus:border-brand-gold" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MatchesPage;
