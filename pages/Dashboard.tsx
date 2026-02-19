
import React from 'react';
import { Link } from 'react-router-dom';
import { PLAYERS, MATCHES } from '../mockData';

const Dashboard: React.FC = () => {
  const upcomingMatches = MATCHES.filter(m => m.status === 'upcoming').slice(0, 2);
  const me = PLAYERS.find(p => p.isMe);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-brand-green text-sm animate-pulse">●</span>
            <span className="text-brand-text-dim font-bold uppercase tracking-widest text-xs">EN CURSO — Fase de Grupos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black">Mundial Oficina 2026</h1>
          <p className="text-brand-text-dim">18 de 20 miembros ya han enviado sus pronósticos</p>
        </div>
        <button className="bg-brand-green/10 border border-brand-green/20 text-brand-green px-6 py-3 rounded-xl font-bold hover:bg-brand-green hover:text-brand-blue-deep transition-all flex items-center gap-2">
          <span>👥</span> Invitar amigos
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 font-black mono-font group-hover:scale-110 transition-transform">#3</div>
          <p className="text-brand-text-dim text-sm font-bold uppercase mb-2">Posición</p>
          <p className="text-4xl font-black text-brand-green">3º <span className="text-xs text-brand-text-dim font-normal uppercase">de 20</span></p>
          <p className="text-xs text-brand-green font-bold mt-2">▲ 2 posiciones</p>
        </div>
        <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group">
          <p className="text-brand-text-dim text-sm font-bold uppercase mb-2">Puntos totales</p>
          <p className="text-4xl font-black mono-font">{me?.pts} <span className="text-xs text-brand-text-dim font-normal uppercase">PTS</span></p>
          <div className="w-full bg-brand-blue-light h-1.5 rounded-full mt-4">
            <div className="bg-brand-green h-full rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
        <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group">
          <p className="text-brand-text-dim text-sm font-bold uppercase mb-2">Acertados</p>
          <p className="text-4xl font-black">23 <span className="text-xs text-brand-text-dim font-normal uppercase">/ 48</span></p>
          <p className="text-xs text-brand-text-dim mt-2">48% de acierto global</p>
        </div>
        <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group border-b-4 border-b-brand-gold">
          <p className="text-brand-text-dim text-sm font-bold uppercase mb-2">Exactos</p>
          <p className="text-4xl font-black text-brand-gold">{me?.exactes} <span className="text-xs text-brand-text-dim font-normal uppercase">🎯</span></p>
          <p className="text-xs text-brand-gold font-bold mt-2">+120 pts extras</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Urgent Predictions */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <span>⚽</span> Próximos partidos
            <span className="bg-brand-red text-[10px] px-2 py-1 rounded-md uppercase tracking-tighter">Urgente</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {upcomingMatches.map(match => (
              <div key={match.id} className="bg-brand-surface border border-brand-border p-5 rounded-2xl space-y-4 shadow-xl">
                <div className="flex justify-between items-center text-xs text-brand-text-dim font-bold uppercase">
                  <span>GRUPO A</span>
                  <span className="text-brand-orange animate-pulse">Cierra en 2h 14m</span>
                </div>
                <div className="flex justify-around items-center py-2">
                  <div className="text-center space-y-2">
                    <span className="text-4xl">{match.homeFlag}</span>
                    <p className="text-sm font-bold">{match.home}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="0" className="w-12 h-14 bg-brand-blue-deep border border-brand-blue-light rounded-xl text-center text-xl font-black focus:border-brand-green outline-none" />
                    <span className="text-brand-text-dim font-black">-</span>
                    <input type="number" placeholder="0" className="w-12 h-14 bg-brand-blue-deep border border-brand-blue-light rounded-xl text-center text-xl font-black focus:border-brand-green outline-none" />
                  </div>
                  <div className="text-center space-y-2">
                    <span className="text-4xl">{match.awayFlag}</span>
                    <p className="text-sm font-bold">{match.away}</p>
                  </div>
                </div>
                <button className="w-full bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep py-3 rounded-xl font-black transition-all">
                  Guardar pronóstico
                </button>
              </div>
            ))}
          </div>
          <Link to="/partits" className="block text-center text-brand-green font-bold hover:underline">Ver todo el calendario →</Link>
        </div>

        {/* Mini Ranking */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3"><span>🏆</span> Ranking actual</h2>
          <div className="bg-brand-blue-mid border border-brand-blue-light rounded-2xl overflow-hidden">
            {PLAYERS.slice(0, 5).map((player, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 border-b border-brand-blue-light last:border-0 ${player.isMe ? 'bg-brand-green/5' : ''}`}>
                <span className={`mono-font font-bold w-6 text-center ${i === 0 ? 'text-brand-gold' : i === 1 ? 'text-brand-silver' : i === 2 ? 'text-brand-bronze' : 'text-brand-text-dim'}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-brand-blue-light flex items-center justify-center font-bold text-xs border border-brand-border">{player.avatar}</div>
                <span className={`flex-grow font-bold text-sm ${player.isMe ? 'text-brand-green' : ''}`}>{player.name}</span>
                <div className="text-right">
                  <p className="mono-font font-bold text-sm">{player.pts}</p>
                  <p className={`text-[10px] ${player.variacio > 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                    {player.variacio > 0 ? '▲' : player.variacio < 0 ? '▼' : '='} {Math.abs(player.variacio)}
                  </p>
                </div>
              </div>
            ))}
            <Link to="/ranking" className="block p-4 bg-brand-blue-light/50 text-center text-xs font-bold uppercase tracking-widest hover:bg-brand-blue-light transition-all">
              Ranking completo →
            </Link>
          </div>

          {/* Activity Feed */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-brand-text-dim tracking-widest">Actividad reciente</h3>
            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-brand-blue-light">
              {[
                { text: 'Marc G. ha acertado el exacto del Brasil-Argentina! +60 pts 🎯', time: 'hace 5m' },
                { text: 'Laura P. ha subido al 2º puesto 📈', time: 'hace 20m' },
                { text: 'Jordi T. ha pronosticado el próximo partido ⚽', time: 'hace 1h' },
              ].map((act, i) => (
                <div key={i} className="flex gap-4 items-start pl-8 relative">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-brand-green border-2 border-brand-blue-deep"></div>
                  <div className="flex-grow">
                    <p className="text-xs text-brand-text-dim leading-relaxed"><span className="text-white font-medium">{act.text}</span></p>
                    <span className="text-[10px] text-brand-text-dim uppercase">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
