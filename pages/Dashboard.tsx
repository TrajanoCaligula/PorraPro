import React from 'react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MATCHES } from '../mockData';

import { supabase } from '../lib/supabase'; 

const Dashboard = () => {
  const [porras, setPorras] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOG DE CONTROL 1: ¿Se renderiza el componente?
  console.log("--- DASHBOARD RENDER ---");

  const userId = localStorage.getItem('user_id');

  // LOG DE CONTROL 2: ¿Tenemos ID?
  console.log("UserID detectado:", userId);

  useEffect(() => {
    console.log("Ejecutando useEffect...");
    if (userId) {
      fetchMyPools();
    } else {
      console.log("No hay userId, cancelando carga.");
      setLoading(false);
    }
  }, [userId]);

  const fetchMyPools = async () => {
  try {
    setLoading(true);
    const userId = localStorage.getItem('user_id');

    // Cambiamos la forma de pedir la relación
    // Usamos el nombre de la tabla "Pools" tal cual está en tu base de datos
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

    if (error) {
      console.error("Error detallado de Supabase:", error);
      throw error;
    }

    console.log("Datos recibidos:", data);

    const formattedPorras = data.map((item) => ({
      id: item.Pools?.idPool,
      nombre: item.Pools?.nombre || "Sin nombre",
      puntos: item.score || 0,
      posicion: "-",
      participantes: "-",
      progreso: '0%'
    }));

    setPorras(formattedPorras);
  } catch (err) {
    console.error("Fallo en la petición:", err.message);
  } finally {
    setLoading(false);
  }
};

  // 4. Si está cargando, mostrar un indicador
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

        <a href="/crear-porra" className="flex flex-col sm:flex-row gap-3">   
          <button className="bg-brand-green/10 border border-brand-green/20 text-brand-green px-6 py-3 rounded-xl font-bold hover:bg-brand-green hover:text-brand-blue-deep transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
            <span>➕</span> Crear porra
          </button>
        </a>
      </header>

      {/* SECCIÓN 1: PRÓXIMOS PARTIDOS (Prioridad) */}
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
              {/* Decoración de fondo */}
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

              <button className="w-full bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep py-4 rounded-2xl font-black transition-all transform active:scale-[0.98] shadow-[0_4px_20px_rgba(0,255,157,0.2)]">
                Confirmar Pronóstico
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: TUS COMPETICIONES (Listado de Porras) */}
      <section className="space-y-12">
        <h2 className="text-2xl font-black flex items-center gap-3 uppercase italic">
          <span>🏆</span> Tus Competiciones ({porras.length})
        </h2>
        
        <div className="space-y-16">
          {porras.map((porra) => (
            <div key={porra.id} className="space-y-6 animate-fadeIn">
              
              {/* Cabecera de la Competición */}
              <div className="flex items-center justify-between px-2 border-l-4 border-brand-green pl-4">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">{porra.nombre}</h3>
                  <p className="text-brand-text-dim text-xs font-bold uppercase tracking-tighter">Ranking: {porra.posicion}º de {porra.participantes} participantes</p>
                </div>
                <Link to={`/porra/${porra.id}`} className="bg-brand-blue-light/30 hover:bg-brand-blue-light/50 px-4 py-2 rounded-lg text-brand-green text-xs font-bold transition-all">
                  Ver Clasificación
                </Link>
              </div>

              {/* Grid de 4 cuadros originales */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                
                {/* Cuadro 1: Posición */}
                <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 font-black mono-font group-hover:scale-110 transition-transform select-none uppercase italic">
                    POS
                  </div>
                  <p className="text-brand-text-dim text-sm font-bold uppercase mb-2 italic">Posición</p>
                  <p className="text-4xl font-black text-brand-green">
                    {porra.posicion}º <span className="text-xs text-brand-text-dim font-normal uppercase">/ {porra.participantes}</span>
                  </p>
                  <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${porra.tendencia >= 0 ? 'text-brand-green' : 'text-red-500'}`}>
                    {porra.tendencia >= 0 ? '▲' : '▼'} {Math.abs(porra.tendencia)} {porra.tendencia === 0 ? 'Sin cambios' : 'posiciones'}
                  </p>
                </div>

                {/* Cuadro 2: Puntos */}
                <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group">
                  <p className="text-brand-text-dim text-sm font-bold uppercase mb-2 italic">Puntos totales</p>
                  <p className="text-4xl font-black mono-font">{porra.puntos} <span className="text-xs text-brand-text-dim font-normal uppercase">PTS</span></p>
                  <div className="w-full bg-brand-blue-light h-2 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="bg-brand-green h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(0,255,157,0.4)]" 
                      style={{ width: porra.progreso }}
                    ></div>
                  </div>
                </div>

                {/* Cuadro 3: Acertados */}
                <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group">
                  <p className="text-brand-text-dim text-sm font-bold uppercase mb-2 italic">Acertados</p>
                  <p className="text-4xl font-black">
                    {porra.aciertos} <span className="text-xs text-brand-text-dim font-normal uppercase">/ {porra.totales}</span>
                  </p>
                  <p className="text-xs text-brand-text-dim mt-2 font-medium bg-white/5 inline-block px-2 py-0.5 rounded">
                    {Math.round((porra.aciertos / porra.totales) * 100)}% de efectividad
                  </p>
                </div>

                {/* Cuadro 4: Exactos */}
                <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl group border-b-4 border-b-brand-gold">
                  <p className="text-brand-text-dim text-sm font-bold uppercase mb-2 italic text-brand-gold">Exactos</p>
                  <p className="text-4xl font-black text-brand-gold">
                    {porra.exactos} <span className="text-xs text-brand-text-dim font-normal uppercase text-white/50">Full Hit</span>
                  </p>
                  <p className="text-xs text-brand-gold font-bold mt-2">🎯 Estimado: +{porra.exactos * 60} pts extra</p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Nota final */}
      <footer className="pt-10 border-t border-white/5 text-center">
        <p className="text-brand-text-dim text-xs uppercase tracking-[0.2em]">Liga de Pronósticos Deportivos 2026</p>
      </footer>
    </div>
  );
};

export default Dashboard;