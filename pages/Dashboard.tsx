import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MATCHES } from '../mockData';
import { supabase } from '../lib/supabase'; 

const Dashboard = () => {
  const [porras, setPorras] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Datos de sesión desde localStorage
  const userId = localStorage.getItem('user_id');
  const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  const me = userProfile; 

  // 2. Partidos próximos (mockData)
  const upcomingMatches = MATCHES.filter(m => m.status === 'upcoming').slice(0, 2);

  useEffect(() => {
    if (userId) {
      fetchMyPools();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchMyPools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('PoolParticipations')
        .select(`
          score,
          Pools (
            idPool,
            name
          )
        `)
        .eq('idUser', userId);

      if (error) throw error;

      const formattedPorras = data.map((item) => ({
        id: item.Pools?.idPool,
        nombre: item.Pools?.name || "Sin nombre",
        puntos: item.score || 0,
        participantes: 1, // Valores por defecto hasta tener lógica de conteo
        posicion: 1,
        tendencia: 0,
        aciertos: 0,
        totales: 0,
        exactos: 0,
        progreso: '0%'
      }));

      setPorras(formattedPorras);
    } catch (err) {
      console.error("Error en la carga:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="bg-brand-blue-deep min-h-screen text-white p-10 font-black italic uppercase animate-pulse">Cargando estadísticas...</div>;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-12 bg-brand-blue-deep min-h-screen text-white">
      
      {/* Header General */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-brand-green text-sm animate-pulse">●</span>
            <span className="text-brand-text-dim font-bold uppercase tracking-widest text-xs">Sesión activa: {me?.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase">Resumen</h1>
          <p className="text-brand-text-dim font-medium">Gestiona tus pronósticos y revisa tus estadísticas por competición.</p>
        </div>

        <Link to="/crear-porra" className="flex flex-col sm:flex-row gap-3">   
          <button className="bg-brand-green/10 border border-brand-green/20 text-brand-green px-6 py-3 rounded-xl font-bold hover:bg-brand-green hover:text-brand-blue-deep transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
            <span>➕</span> Crear porra
          </button>
        </Link>
      </header>

      {/* SECCIÓN 1: PRONÓSTICOS PENDIENTES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase italic">
            <span>⚽</span> Pronósticos Pendientes
            <span className="bg-red-600 text-[10px] px-2 py-1 rounded-md uppercase tracking-tighter animate-pulse">Urgente</span>
          </h2>
          <Link to="/partits" className="text-brand-green text-sm font-bold hover:underline">Ver calendario completo →</Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingMatches.map(match => (
            <div key={match.id} className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-3xl space-y-6 shadow-2xl hover:border-brand-green/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl font-black italic select-none">NEXT</div>
              <div className="flex justify-between items-center text-xs text-brand-text-dim font-bold uppercase tracking-widest">
                <span>Fase de Grupos</span>
                <span className="text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg">Cierra en 2h 14m</span>
              </div>
              <div className="flex justify-around items-center py-4">
                <div className="text-center space-y-3 w-1/3">
                  <span className="text-5xl drop-shadow-lg">{match.homeFlag}</span>
                  <p className="text-sm font-black truncate">{match.home}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input type="number" placeholder="0" className="w-14 h-16 bg-brand-blue-deep border-2 border-brand-blue-light rounded-2xl text-center text-2xl font-black focus:border-brand-green outline-none transition-all" />
                  <span className="text-brand-text-dim font-black text-xl">-</span>
                  <input type="number" placeholder="0" className="w-14 h-16 bg-brand-blue-deep border-2 border-brand-blue-light rounded-2xl text-center text-2xl font-black focus:border-brand-green outline-none transition-all" />
                </div>
                <div className="text-center space-y-3 w-1/3">
                  <span className="text-5xl drop-shadow-lg">{match.awayFlag}</span>
                  <p className="text-sm font-black truncate">{match.away}</p>
                </div>
              </div>
              <button className="w-full bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep py-4 rounded-2xl font-black transition-all transform active:scale-[0.98]">
                Confirmar Pronóstico
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: TUS COMPETICIONES */}
      <section className="space-y-12">
        <h2 className="text-2xl font-black flex items-center gap-3 uppercase italic">
          <span>🏆</span> Tus Competiciones ({porras.length})
        </h2>
        
        <div className="space-y-16">
          {porras.map((porra) => (
            /* TODA LA FILA ES UN LINK A LA SIMULACIÓN */
            <Link 
              key={porra.id} 
              to={`/simulacion-grupos/${porra.id}`} 
              className="block space-y-6 animate-fadeIn group/card hover:opacity-90 transition-all"
            >
              <div className="flex items-center justify-between px-2 border-l-4 border-brand-green pl-4 group-hover/card:border-white transition-colors">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight group-hover/card:text-brand-green transition-colors">
                    {porra.nombre}
                  </h3>
                  <p className="text-brand-text-dim text-xs font-bold uppercase tracking-tighter">
                    Ranking: {porra.posicion}º de {porra.participantes} participantes
                  </p>
                </div>
                <span className="bg-brand-blue-light/30 px-4 py-2 rounded-lg text-brand-green text-xs font-bold group-hover/card:bg-brand-green group-hover/card:text-brand-blue-deep transition-all">
                  Entrar →
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-white">
                <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl relative overflow-hidden group">
                  <p className="text-brand-text-dim text-sm font-bold uppercase mb-2 italic">Posición</p>
                  <p className="text-4xl font-black text-brand-green">{porra.posicion}º</p>
                  <p className="text-xs font-bold mt-2 text-brand-green">▲ 0 posiciones</p>
                </div>

                <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group">
                  <p className="text-brand-text-dim text-sm font-bold uppercase mb-2 italic">Puntos</p>
                  <p className="text-4xl font-black">{porra.puntos} PTS</p>
                </div>

                <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group">
                  <p className="text-brand-text-dim text-sm font-bold uppercase mb-2 italic">Acertados</p>
                  <p className="text-4xl font-black">{porra.aciertos} / {porra.totales}</p>
                </div>

                <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group border-b-4 border-b-brand-gold">
                  <p className="text-brand-text-dim text-sm font-bold uppercase mb-2 italic text-brand-gold">Exactos</p>
                  <p className="text-4xl font-black text-brand-gold">{porra.exactos}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="pt-10 border-t border-white/5 text-center">
        <p className="text-brand-text-dim text-xs uppercase tracking-[0.2em]">Liga de Pronósticos Deportivos 2026</p>
      </footer>
    </div>
  );
};

export default Dashboard;