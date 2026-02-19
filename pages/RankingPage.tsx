
import React from 'react';
import { PLAYERS } from '../mockData';

const RankingPage: React.FC = () => {
  const podium = [PLAYERS[1], PLAYERS[0], PLAYERS[2]]; // 2nd, 1st, 3rd

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black">Clasificación General</h1>
          <p className="text-brand-text-dim">Última actualización: hace 3 minutos · Actualización automática</p>
        </div>
        <button className="bg-brand-blue-light border border-brand-blue-light text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-surface transition-all flex items-center gap-2">
          <span>📸</span> Compartir ranking
        </button>
      </header>

      {/* Podium */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 pt-10 pb-6">
        {podium.map((p, i) => {
          const isFirst = i === 1;
          const isSecond = i === 0;
          const isThird = i === 2;
          
          return (
            <div key={i} className={`flex flex-col items-center w-full md:w-48 transition-transform hover:-translate-y-2 duration-300 ${isFirst ? 'order-2 scale-110 z-10' : isSecond ? 'order-1' : 'order-3'}`}>
              <div className="relative mb-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black border-4 ${
                  isFirst ? 'border-brand-gold' : isSecond ? 'border-brand-silver' : 'border-brand-bronze'
                } bg-brand-blue-mid overflow-hidden`}>
                  {p.avatar}
                </div>
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 text-3xl`}>
                  {isFirst ? '🥇' : isSecond ? '🥈' : '🥉'}
                </div>
              </div>
              <div className={`w-full p-4 rounded-t-2xl text-center flex flex-col gap-1 border border-b-0 border-brand-blue-light ${
                isFirst ? 'bg-brand-gold/10' : isSecond ? 'bg-brand-silver/10' : 'bg-brand-bronze/10'
              }`}>
                <span className="font-black text-lg">{p.name}</span>
                <span className="mono-font text-2xl font-black">{p.pts} <span className="text-xs font-normal">pts</span></span>
              </div>
              <div className={`w-full h-24 md:h-32 rounded-b-xl border border-t-0 border-brand-blue-light flex items-center justify-center ${
                isFirst ? 'bg-brand-gold/20' : isSecond ? 'bg-brand-silver/20' : 'bg-brand-bronze/20'
              }`}>
                <span className="text-4xl opacity-20 font-black">{isFirst ? '1' : isSecond ? '2' : '3'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-brand-blue-mid border border-brand-blue-light rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-surface text-[10px] font-black uppercase tracking-widest text-brand-text-dim border-b border-brand-blue-light">
              <th className="px-6 py-4 w-16 text-center">Pos</th>
              <th className="px-6 py-4">Jugador</th>
              <th className="px-6 py-4 text-center">Pts</th>
              <th className="px-6 py-4 text-center hidden sm:table-cell">Exactos</th>
              <th className="px-6 py-4 text-center hidden sm:table-cell">1X2</th>
              <th className="px-6 py-4 text-center hidden sm:table-cell">% Acierto</th>
              <th className="px-6 py-4 text-right">Variación</th>
            </tr>
          </thead>
          <tbody>
            {PLAYERS.map((p, i) => (
              <tr key={i} className={`border-b border-brand-blue-light/50 last:border-0 transition-colors ${p.isMe ? 'bg-brand-green/10' : 'hover:bg-brand-blue-light/20'}`}>
                <td className="px-6 py-5 text-center">
                  <span className={`mono-font font-bold text-lg ${i < 3 ? 'text-brand-gold' : 'text-brand-text-dim'}`}>
                    {i + 1}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-blue-deep border border-brand-border flex items-center justify-center font-bold text-xs">
                      {p.avatar}
                    </div>
                    <span className={`font-bold ${p.isMe ? 'text-brand-green' : 'text-white'}`}>{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-black mono-font text-lg">{p.pts}</td>
                <td className="px-6 py-5 text-center hidden sm:table-cell font-bold text-brand-gold">{p.exactes} ⭐</td>
                <td className="px-6 py-5 text-center hidden sm:table-cell text-brand-text-dim">{p.signe}</td>
                <td className="px-6 py-5 text-center hidden sm:table-cell text-brand-text-dim font-mono">{Math.round((p.signe / 48) * 100)}%</td>
                <td className="px-6 py-5 text-right">
                  <span className={`font-bold text-sm ${p.variacio > 0 ? 'text-brand-green' : p.variacio < 0 ? 'text-brand-red' : 'text-brand-text-dim'}`}>
                    {p.variacio > 0 ? `↑${p.variacio}` : p.variacio < 0 ? `↓${Math.abs(p.variacio)}` : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-brand-blue-mid p-6 rounded-2xl border border-brand-blue-light space-y-2">
          <p className="text-[10px] font-black text-brand-text-dim uppercase tracking-widest">Mejor Racha</p>
          <p className="text-xl font-black">Nil V. 🔥</p>
          <p className="text-xs text-brand-text-dim">4 aciertos consecutivos</p>
        </div>
        <div className="bg-brand-blue-mid p-6 rounded-2xl border border-brand-blue-light space-y-2">
          <p className="text-[10px] font-black text-brand-text-dim uppercase tracking-widest">Estadística Curiosa</p>
          <p className="text-xl font-black">Laura P. 🇪🇸</p>
          <p className="text-xs text-brand-text-dim">Ha acertado el 80% de los partidos españoles</p>
        </div>
        <div className="bg-brand-blue-mid p-6 rounded-2xl border border-brand-blue-light space-y-2">
          <p className="text-[10px] font-black text-brand-text-dim uppercase tracking-widest">Más Exactos</p>
          <p className="text-xl font-black">Nil V. 🎯</p>
          <p className="text-xs text-brand-text-dim">Total de 9 resultados clave</p>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
