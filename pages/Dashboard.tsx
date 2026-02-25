import React from 'react';
import { Link } from 'react-router-dom';
import { PLAYERS, MATCHES } from '../mockData';

const Dashboard: React.FC = () => {
  const upcomingMatches = MATCHES.filter(m => m.status === 'upcoming').slice(0, 2);
  const me = PLAYERS.find(p => p.isMe);

  // 1. Datos de las competiciones (Porras)
  const porras = [
    {
      id: 1,
      nombre_porra: "Mundial Oficina 2026",
      siglas: "WC",
      total_participantes: 20,
      posicion: 3,
      tendencia: 2,
      puntos: me?.pts || 0,
      max_puntos_posibles: 500,
      aciertos: 23,
      total_partidos: 48,
      porcentaje_acierto: 48,
      exactos: me?.exactes || 0
    },
    {
      id: 2,
      nombre_porra: "Champions League",
      siglas: "CL",
      total_participantes: 100,
      posicion: 15,
      tendencia: -5,
      puntos: 80,
      max_puntos_posibles: 120,
      aciertos: 10,
      total_partidos: 24,
      porcentaje_acierto: 41,
      exactos: 2
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-12 bg-brand-blue-dark">
      
      {/* HEADER DINÁMICO (Muestra la primera porra como principal) */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-brand-green text-sm animate-pulse">●</span>
            <span className="text-brand-text-dim font-bold uppercase tracking-widest text-xs">
              EN CURSO — {porras[0].nombre_porra}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase">Panel de Control</h1>
          <p className="text-brand-text-dim">Gestiona tus pronósticos y revisa tu clasificación global.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">   
          <button className="bg-brand-green/10 border border-brand-green/20 text-brand-green px-6 py-3 rounded-xl font-bold hover:bg-brand-green hover:text-brand-blue-deep transition-all flex items-center justify-center gap-2">
            <span>👥</span> Invitar amigos
          </button>
        </div>
      </header>

      {/* SECCIÓN DE PORRAS: Una fila por cada porra afiliada */}
      <section className="space-y-16">
        {porras.map((porra) => (
          <div key={porra.id} className="space-y-6">
            {/* Título de la fila */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-2 h-2 bg-brand-green rounded-full shadow-[0_0_10px_rgba(0,255,0,0.5)]"></div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{porra.nombre_porra}</h2>
            </div>

            {/* Grid de 4 cuadros solicitado */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              
              {/* CUADRO 1: Info Porra */}
              <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-2 text-6xl opacity-5 font-black group-hover:rotate-12 transition-transform select-none">
                  {porra.siglas}
                </div>
                <p className="text-brand-text-dim text-sm font-bold uppercase mb-2">Competición</p>
                <p className="text-xl lg:text-2xl font-black text-white truncate">{porra.nombre_porra}</p>
                <p className="text-xs text-brand-text-dim font-bold mt-2 uppercase">{porra.total_participantes} Participantes</p>
              </div>

              {/* CUADRO 2: Posición (Antes Cuadro 1) */}
              <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 font-black group-hover:scale-110 transition-transform">
                  #{porra.posicion}
                </div>
                <p className="text-brand-text-dim text-sm font-bold uppercase mb-2">Posición</p>
                <p className="text-4xl font-black text-brand-green">
                  {porra.posicion}º <span className="text-xs text-brand-text-dim font-normal uppercase text-white/50">de {porra.total_participantes}</span>
                </p>
                <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${porra.tendencia >= 0 ? 'text-brand-green' : 'text-red-500'}`}>
                  {porra.tendencia >= 0 ? '▲' : '▼'} {Math.abs(porra.tendencia)} posiciones
                </p>
              </div>

              {/* CUADRO 3: Puntos (Antes Cuadro 2) */}
              <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group">
                <p className="text-brand-text-dim text-sm font-bold uppercase mb-2">Puntos totales</p>
                <p className="text-4xl font-black text-white">{porra.puntos} <span className="text-xs text-brand-text-dim font-normal uppercase">PTS</span></p>
                <div className="w-full bg-brand-blue-light h-1.5 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="bg-brand-green h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,255,0,0.4)]" 
                    style={{ width: `${(porra.puntos / porra.max_puntos_posibles) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* CUADRO 4: Acertados (Antes Cuadro 3) */}
              <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group border-b-4 border-b-brand-gold">
                <p className="text-brand-text-dim text-sm font-bold uppercase mb-2">Aciertos Exactos</p>
                <p className="text-4xl font-black text-brand-gold">
                  {porra.exactos} <span className="text-xs text-brand-text-dim font-normal uppercase">🎯</span>
                </p>
                <p className="text-xs text-brand-text-dim mt-2">
                  <span className="text-white font-bold">{porra.aciertos}</span> aciertos globales ({porra.porcentaje_acierto}%)
                </p>
              </div>

            </div>
          </div>
        ))}
      </section>

      {/* SECCIÓN INFERIOR: Partidos y Ranking */}
      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Urgent Predictions */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3 text-white italic uppercase">
            <span>⚽</span> Próximos partidos
            <span className="bg-red-600 text-[10px] px-2 py-1 rounded-md uppercase tracking-tighter animate-pulse">Urgente</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {upcomingMatches.map(match => (
              <div key={match.id} className="bg-brand-blue-mid border border-brand-blue-light p-5 rounded-2xl space-y-4 shadow-xl group hover:border-brand-green transition-colors">
                <div className="flex justify-between items-center text-xs text-brand-text-dim font-bold uppercase">
                  <span>{match.group || 'GRUPO A'}</span>
                  <span className="text-orange-500">Cierra en 2h 14m</span>
                </div>
                <div className="flex justify-around items-center py-2 text-white">
                  <div className="text-center space-y-2">
                    <span className="text-4xl">{match.homeFlag}</span>
                    <p className="text-sm font-bold">{match.home}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="0" className="w-12 h-14 bg-brand-blue-deep border border-brand-blue-light rounded-xl text-center text-xl font-black focus:border-brand-green outline-none text-white" />
                    <span className="text-brand-text-dim font-black">-</span>
                    <input type="number" placeholder="0" className="w-12 h-14 bg-brand-blue-deep border border-brand-blue-light rounded-xl text-center text-xl font-black focus:border-brand-green outline-none text-white" />
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

        {/* Mini Ranking */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3 text-white italic uppercase"><span>🏆</span> Ranking actual</h2>
          <div className="bg-brand-blue-mid border border-brand-blue-light rounded-2xl overflow-hidden">
            {PLAYERS.slice(0, 5).map((player, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 border-b border-brand-blue-light last:border-0 ${player.isMe ? 'bg-brand-green/10' : ''}`}>
                <span className={`font-bold w-6 text-center text-sm ${i === 0 ? 'text-yellow-500' : 'text-brand-text-dim'}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-brand-blue-light flex items-center justify-center font-bold text-xs border border-brand-border text-white">{player.avatar}</div>
                <span className={`flex-grow font-bold text-sm ${player.isMe ? 'text-brand-green' : 'text-white'}`}>{player.name}</span>
                <div className="text-right">
                  <p className="font-bold text-sm text-white">{player.pts}</p>
                  <p className={`text-[10px] ${player.variacio > 0 ? 'text-brand-green' : 'text-red-500'}`}>
                    {player.variacio > 0 ? '▲' : player.variacio < 0 ? '▼' : '='} {Math.abs(player.variacio)}
                  </p>
                </div>
              </div>
            ))}
            <Link to="/ranking" className="block p-4 bg-brand-blue-light/30 text-center text-xs font-bold uppercase tracking-widest text-brand-green hover:bg-brand-blue-light transition-all">
              Ranking completo →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;