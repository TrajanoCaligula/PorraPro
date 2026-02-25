import React from 'react';
import { Link } from 'react-router-dom';
import { PLAYERS, MATCHES } from '../mockData';

const Dashboard = () => {
  const upcomingMatches = MATCHES.filter(m => m.status === 'upcoming').slice(0, 2);
  const me = PLAYERS.find(p => p.isMe);

  // Datos de las porras a las que está afiliado el usuario
  const porras = [
    {
      id: 1,
      nombre: "Mundial Oficina 2026",
      participantes: 20,
      posicion: 3,
      tendencia: 2,
      puntos: me?.pts || 0,
      aciertos: 23,
      totales: 48,
      exactos: me?.exactes || 0,
      progreso: '65%'
    },
    {
      id: 2,
      nombre: "Champions League",
      participantes: 100,
      posicion: 15,
      tendencia: -5,
      puntos: 85,
      aciertos: 12,
      totales: 30,
      exactos: 2,
      progreso: '40%'
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-12 bg-brand-blue-deep min-h-screen text-white">
      
      {/* Header General */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-brand-green text-sm animate-pulse">●</span>
            <span className="text-brand-text-dim font-bold uppercase tracking-widest text-xs">Usuario: {me?.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase">Mi Panel</h1>
          <p className="text-brand-text-dim font-medium">Resumen de todas tus competiciones activas.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">   
          <button className="bg-brand-green/10 border border-brand-green/20 text-brand-green px-6 py-3 rounded-xl font-bold hover:bg-brand-green hover:text-brand-blue-deep transition-all flex items-center justify-center gap-2">
            <span>👥</span> Invitar amigos
          </button>
        </div>
      </header>


      {/* Sección Inferior: Partidos y Ranking */}
      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Próximos Partidos */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase italic">
            <span>⚽</span> Próximos partidos
            <span className="bg-red-600 text-[10px] px-2 py-1 rounded-md uppercase tracking-tighter animate-pulse">Urgente</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {upcomingMatches.map(match => (
              <div key={match.id} className="bg-brand-blue-mid border border-brand-blue-light p-5 rounded-2xl space-y-4 shadow-xl hover:border-brand-green/50 transition-colors group">
                <div className="flex justify-between items-center text-xs text-brand-text-dim font-bold uppercase">
                  <span>GRUPO A</span>
                  <span className="text-orange-500">Cierra en 2h 14m</span>
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
                <button className="w-full bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep py-3 rounded-xl font-black transition-all transform active:scale-95">
                  Guardar pronóstico
                </button>
              </div>
            ))}
          </div>
          <Link to="/partits" className="block text-center text-brand-green font-bold hover:underline">Ver todo el calendario →</Link>
        </div>


      {/* Listado de Porras (Una sección por competición) */}
      <div className="space-y-16">
        {porras.map((porra) => (
          <div key={porra.id} className="space-y-6">
            
            {/* Cabecera de la Competición */}
            <div className="flex items-center justify-between px-2 border-l-4 border-brand-green pl-4">
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tight">{porra.nombre}</h2>
                <p className="text-brand-text-dim text-xs font-bold uppercase">{porra.participantes} Participantes en total</p>
              </div>
              <Link to={`/porra/${porra.id}`} className="text-brand-green text-sm font-bold hover:underline">
                Ver detalles →
              </Link>
            </div>

            {/* Grid de 4 cuadros originales */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              
              {/* Cuadro 1: Posición */}
              <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 font-black mono-font group-hover:scale-110 transition-transform select-none">
                  #{porra.posicion}
                </div>
                <p className="text-brand-text-dim text-sm font-bold uppercase mb-2">Posición</p>
                <p className="text-4xl font-black text-brand-green">
                  {porra.posicion}º <span className="text-xs text-brand-text-dim font-normal uppercase">de {porra.participantes}</span>
                </p>
                <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${porra.tendencia >= 0 ? 'text-brand-green' : 'text-red-500'}`}>
                  {porra.tendencia >= 0 ? '▲' : '▼'} {Math.abs(porra.tendencia)} posiciones
                </p>
              </div>

              {/* Cuadro 2: Puntos */}
              <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group">
                <p className="text-brand-text-dim text-sm font-bold uppercase mb-2">Puntos totales</p>
                <p className="text-4xl font-black mono-font">{porra.puntos} <span className="text-xs text-brand-text-dim font-normal uppercase">PTS</span></p>
                <div className="w-full bg-brand-blue-light h-1.5 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="bg-brand-green h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(0,255,0,0.3)]" 
                    style={{ width: porra.progreso }}
                  ></div>
                </div>
              </div>

              {/* Cuadro 3: Acertados */}
              <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group">
                <p className="text-brand-text-dim text-sm font-bold uppercase mb-2">Acertados</p>
                <p className="text-4xl font-black">
                  {porra.aciertos} <span className="text-xs text-brand-text-dim font-normal uppercase">/ {porra.totales}</span>
                </p>
                <p className="text-xs text-brand-text-dim mt-2 font-medium">
                  {Math.round((porra.aciertos / porra.totales) * 100)}% de acierto global
                </p>
              </div>

              {/* Cuadro 4: Exactos */}
              <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group border-b-4 border-b-brand-gold">
                <p className="text-brand-text-dim text-sm font-bold uppercase mb-2">Exactos</p>
                <p className="text-4xl font-black text-brand-gold">
                  {porra.exactos} <span className="text-xs text-brand-text-dim font-normal uppercase">🎯</span>
                </p>
                <p className="text-xs text-brand-gold font-bold mt-2">+{porra.exactos * 60} pts extra acumulados</p>
              </div>

            </div>
          </div>
        ))}
      </div>

      

        {/* Mini Ranking Lateral */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase italic"><span>🏆</span> Global</h2>
          <div className="bg-brand-blue-mid border border-brand-blue-light rounded-2xl overflow-hidden">
            {PLAYERS.slice(0, 5).map((player, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 border-b border-brand-blue-light last:border-0 ${player.isMe ? 'bg-brand-green/10' : ''}`}>
                <span className={`mono-font font-bold w-6 text-center text-sm ${i === 0 ? 'text-yellow-500' : 'text-brand-text-dim'}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-brand-blue-light flex items-center justify-center font-bold text-xs border border-brand-border">{player.avatar}</div>
                <span className={`flex-grow font-bold text-sm ${player.isMe ? 'text-brand-green' : ''}`}>{player.name}</span>
                <div className="text-right">
                  <p className="mono-font font-bold text-sm">{player.pts}</p>
                  <p className={`text-[10px] ${player.variacio > 0 ? 'text-brand-green' : 'text-red-500'}`}>
                    {player.variacio > 0 ? '▲' : player.variacio < 0 ? '▼' : '='} {Math.abs(player.variacio)}
                  </p>
                </div>
              </div>
            ))}
            <Link to="/ranking" className="block p-4 bg-brand-blue-light/50 text-center text-xs font-bold uppercase tracking-widest hover:bg-brand-blue-light transition-all text-brand-green">
              Ranking completo →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;