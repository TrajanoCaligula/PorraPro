import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { MATCHES } from '../mockData'; // Seguimos usando mock para partidos hasta que tengas esa tabla

const Dashboard = () => {
  const [porras, setPorras] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Obtener datos del usuario desde LocalStorage
  const userProfile = JSON.parse(localStorage.getItem('user_profile'));
  const userId = userProfile?.id;

  const upcomingMatches = MATCHES.filter(m => m.status === 'upcoming').slice(0, 2);

  useEffect(() => {
    if (userId) {
      fetchMyPools();
    }
  }, [userId]);

  const fetchMyPools = async () => {
    try {
      setLoading(true);
      
      // 2. Consulta a tu tabla PoolParticipations
      const { data, error } = await supabase
        .from('PoolParticipations')
        .select(`
          score,
          Pools (
            idPool,
            nombre
          )
        `)
        .eq('idUser', userId);

      if (error) throw error;

      // 3. Mapeo de datos (ajustado a tu diseño)
      const formatted = data.map(item => ({
        id: item.Pools.idPool,
        nombre: item.Pools.nombre,
        puntos: item.score || 0,
        // De momento hardcodeamos estos hasta tener la lógica de ranking/estadísticas en DB
        posicion: "-", 
        participantes: "-",
        tendencia: 0,
        aciertos: 0,
        totales: 0,
        exactos: 0,
        progreso: '0%'
      }));

      setPorras(formatted);
    } catch (err) {
      console.error("Error cargando porras:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-12 bg-brand-blue-deep min-h-screen text-white">
      
      {/* Header General */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-brand-green text-sm animate-pulse">●</span>
            <span className="text-brand-text-dim font-bold uppercase tracking-widest text-xs">
              Sesión activa: {userProfile?.name}
            </span>
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

      {/* PRÓXIMOS PARTIDOS (Mantenemos mockData por ahora) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase italic">
            <span>⚽</span> Pronósticos Pendientes
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingMatches.map(match => (
            <div key={match.id} className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-3xl space-y-6 shadow-2xl hover:border-brand-green/50 transition-all group relative overflow-hidden">
               {/* Contenido del match igual que antes... */}
               <div className="flex justify-around items-center py-4">
                  <div className="text-center space-y-3 w-1/3">
                    <span className="text-5xl">{match.homeFlag}</span>
                    <p className="text-sm font-black truncate">{match.home}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="number" placeholder="0" className="w-14 h-16 bg-brand-blue-deep border-2 border-brand-blue-light rounded-2xl text-center text-2xl font-black focus:border-brand-green outline-none" />
                    <span className="text-brand-text-dim font-black text-xl">-</span>
                    <input type="number" placeholder="0" className="w-14 h-16 bg-brand-blue-deep border-2 border-brand-blue-light rounded-2xl text-center text-2xl font-black focus:border-brand-green outline-none" />
                  </div>
                  <div className="text-center space-y-3 w-1/3">
                    <span className="text-5xl">{match.awayFlag}</span>
                    <p className="text-sm font-black truncate">{match.away}</p>
                  </div>
               </div>
               <button className="w-full bg-brand-green text-brand-blue-deep py-4 rounded-2xl font-black hover:bg-white transition-colors">
                  Confirmar Pronóstico
               </button>
            </div>
          ))}
        </div>
      </section>

      {/* TUS COMPETICIONES (Dinámico de Supabase) */}
      <section className="space-y-12">
        <h2 className="text-2xl font-black flex items-center gap-3 uppercase italic">
          <span>🏆</span> Tus Competiciones ({porras.length})
        </h2>
        
        <div className="space-y-16">
          {loading ? (
            <p className="text-brand-green animate-pulse font-bold">Cargando tus porras...</p>
          ) : porras.length > 0 ? (
            porras.map((porra) => (
              <div key={porra.id} className="space-y-6">
                <div className="flex items-center justify-between px-2 border-l-4 border-brand-green pl-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">{porra.nombre}</h3>
                    <p className="text-brand-text-dim text-xs font-bold uppercase">Puntos actuales: {porra.puntos}</p>
                  </div>
                  <Link to={`/porra/${porra.id}`} className="bg-brand-blue-light/30 hover:bg-brand-blue-light/50 px-4 py-2 rounded-lg text-brand-green text-xs font-bold">
                    Ver Clasificación
                  </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* Cuadro Puntos */}
                  <div className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl">
                    <p className="text-brand-text-dim text-sm font-bold uppercase mb-2 italic">Puntos</p>
                    <p className="text-4xl font-black text-brand-green">{porra.puntos} <span className="text-xs text-brand-text-dim">PTS</span></p>
                  </div>
                  {/* ... Resto de cuadros (puedes dejarlos estáticos o quitarlos hasta tener más datos) */}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-brand-blue-mid p-10 rounded-3xl border border-dashed border-brand-blue-light text-center">
              <p className="text-brand-text-dim mb-4">No estás participando en ninguna porra todavía.</p>
              <Link to="/explorar" className="text-brand-green font-bold border border-brand-green px-6 py-2 rounded-xl hover:bg-brand-green hover:text-brand-blue-deep transition-all">
                Unirse a una porra
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;