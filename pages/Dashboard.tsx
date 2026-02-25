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
                <div className="w-full bg-brand-blue-