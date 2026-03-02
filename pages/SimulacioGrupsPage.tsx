import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../constants';
import { supabase } from '../lib/supabase';

// --- Interfaces ---
interface TeamStats {
  name: string;
  flag: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
}

interface MatchPrediction {
  id: string;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  homeScore: string;
  awayScore: string;
}

interface Group {
  id: string;
  name: string;
  teams: { name: string; flag: string }[];
  matches: MatchPrediction[];
}

const SimulacioGrupsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // --- Estados ---
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroupId, setActiveGroupId] = useState('A');
  const [loading, setLoading] = useState(true);

  // --- Carga de datos de Supabase ---
  useEffect(() => {
      const fetchTeamsData = async () => {
        setLoading(true);
    
        // 1. Nota: Usamos "Teams" con T mayúscula para que coincida con tu SQL
        const { data: teams, error } = await supabase
          .from('Teams') 
          .select('name, flag_url, group_name')
          .order('group_name', { ascending: true });

        if (error) {
          console.error('Error detallado de Supabase:', error.message);
          setLoading(false);
          return;
        }

        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    
        const formattedGroups: Group[] = letters.map(letter => {
          // Filtramos por group_name que es donde guardaste la letra (A, B, C...)
          const teamsInGroup = teams.filter(t => t.group_name === letter);
          const matches: MatchPrediction[] = [];

          if (teamsInGroup.length === 4) {
            const pairings = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];
            pairings.forEach((p, i) => {
              const h = teamsInGroup[p[0]];
              const a = teamsInGroup[p[1]];
              matches.push({
                id: `${letter}${i + 1}`,
                home: h.name, 
                away: a.name,
                homeFlag: h.flag_url || '🏳️', // Usamos flag_url de tu tabla
                awayFlag: a.flag_url || '🏳️', 
                homeScore: '', 
                awayScore: ''
              });
            });
          }

          return {
            id: letter,
            name: `Group ${letter}`,
            teams: teamsInGroup.map(t => ({ name: t.name, flag: t.flag_url || '🏳️' })),
            matches
          };
        });

        setGroups(formattedGroups);
        setLoading(false);
      };

      fetchTeamsData();
    }, []);

  // --- Lógica de la Tabla de Posiciones ---
  const calculateTable = (group: Group): TeamStats[] => {
    const stats: Record<string, TeamStats> = {};
    group.teams.forEach(t => {
      stats[t.name] = { name: t.name, flag: t.flag, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 };
    });

    group.matches.forEach(m => {
      const hS = parseInt(m.homeScore);
      const aS = parseInt(m.awayScore);

      if (!isNaN(hS) && !isNaN(aS)) {
        const home = stats[m.home];
        const away = stats[m.away];
        if (!home || !away) return;

        home.pj++; away.pj++;
        home.gf += hS; home.gc += aS;
        away.gf += aS; away.gc += hS;

        if (hS > aS) { home.pg++; home.pts += 3; away.pp++; }
        else if (hS < aS) { away.pg++; away.pts += 3; home.pp++; }
        else { home.pe++; away.pe++; home.pts += 1; away.pts += 1; }
      }
    });

    return Object.values(stats).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      const dgA = a.gf - a.gc;
      const dgB = b.gf - b.gc;
      if (dgB !== dgA) return dgB - dgA;
      return b.gf - a.gf;
    }).map(s => ({ ...s, dg: s.gf - s.gc }));
  };

  // --- Memos ---
  const activeGroup = useMemo(() => 
    groups.find(g => g.id === activeGroupId) || null
  , [groups, activeGroupId]);

  const activeTable = useMemo(() => 
    activeGroup ? calculateTable(activeGroup) : []
  , [activeGroup]);

  // --- Handlers ---
  const handleScoreChange = (matchId: string, side: 'home' | 'away', value: string) => {
    // Si es vacío, permitimos borrar
    if (value === '') {
      updateGroups(matchId, side, '');
      return;
    }

    // Solo permitimos números enteros positivos
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      // Guardamos como string para el input
      updateGroups(matchId, side, numValue.toString());
    }
  };

  const updateGroups = (matchId: string, side: 'home' | 'away', value: string) => {
    setGroups(prev => prev.map(g => ({
      ...g,
      matches: g.matches.map(m => 
        m.id === matchId 
          ? { ...m, [side === 'home' ? 'homeScore' : 'awayScore']: value } 
          : m
      )
    })));
  };

  // --- Progreso ---
  const totalMatches = 72;
  const completedMatches = useMemo(() => 
    groups.reduce((acc, g) => acc + g.matches.filter(m => m.homeScore !== '' && m.awayScore !== '').length, 0)
  , [groups]);
  const progress = (completedMatches / totalMatches) * 100;

  // --- Render de Carga ---
  if (loading || !activeGroup) {
    return (
      <div className="min-h-screen bg-brand-blue-deep flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-white font-black uppercase tracking-widest text-sm">Preparando Simulación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-blue-deep text-white flex flex-col font-sans">
      {/* --- HEADER --- */}
      <header className="bg-brand-blue-mid border-b border-brand-blue-light p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="h-8 w-px bg-brand-blue-light hidden md:block"></div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">Simulación — Fase de Grupos</h1>
              <p className="text-xs text-brand-text-dim uppercase font-bold tracking-widest">Mundial 2026</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-widest text-brand-text-dim">
              <span>Progreso</span>
              <span>{completedMatches} / {totalMatches} partidos</span>
            </div>
            <div className="w-full md:w-64 h-2 bg-brand-blue-light rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-green transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-brand-blue-light text-xs font-bold hover:bg-brand-blue-light transition-all">
              Guardar
            </button>
            <button 
              onClick={() => navigate('/simulacio-final')}
              disabled={completedMatches < totalMatches}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${completedMatches === totalMatches ? 'bg-brand-green text-brand-blue-deep hover:bg-brand-green-dark' : 'bg-brand-blue-light text-brand-text-dim cursor-not-allowed'}`}
            >
              Siguiente fase →
            </button>
          </div>
        </div>
      </header>

      {/* --- SELECTOR DE GRUPOS --- */}
      <nav className="bg-brand-blue-mid/50 border-b border-brand-blue-light overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex px-6">
          {groups.map(g => (
            <button
              key={g.id}
              onClick={() => setActiveGroupId(g.id)}
              className={`px-6 py-4 text-sm font-black transition-all border-b-2 whitespace-nowrap ${activeGroupId === g.id ? 'border-brand-green text-brand-green bg-brand-green/5' : 'border-transparent text-brand-text-dim hover:text-white'}`}
            >
              GRUPO {g.id}
            </button>
          ))}
        </div>
      </nav>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* COLUMNA IZQUIERDA: PARTIDOS */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase">Partidos Grupo {activeGroupId}</h2>
              <span className="text-xs font-bold text-brand-text-dim uppercase tracking-widest">Fase de Grupos</span>
            </div>

            <div className="space-y-4">
              {activeGroup.matches.map(match => (
                <div key={match.id} className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between gap-4">
                    
                    {/* Home Team */}
                    <div className="flex-1 flex flex-col items-center gap-3">
                      <img 
                        src={match.homeFlag} 
                        alt="" 
                        className="w-14 h-10 object-contain rounded-xl shadow-sm"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/64?text=?'; }}
                      />
                      <span className="font-bold text-[10px] md:text-xs text-center uppercase tracking-wider">{match.home}</span>
                    </div>

                    {/* Marcador */}
                    <div className="flex items-center gap-2 md:gap-3">
                      {/* Marcador Local */}
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={match.homeScore}
                        onKeyDown={(e) => {
                          if (["-", ".", ",", "e"].includes(e.key)) e.preventDefault();
                        }}
                        onPaste={(e) => {
                          const paste = e.clipboardData.getData('text');
                          if (!/^\d+$/.test(paste)) e.preventDefault();
                        }}
                        onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                        className="w-12 h-14 md:w-14 md:h-16 bg-brand-blue-deep border border-brand-blue-light rounded-xl text-center text-xl md:text-2xl font-black focus:border-brand-green outline-none transition-all placeholder:opacity-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      <span className="text-brand-text-dim font-black text-xl">-</span>

                      {/* Marcador Visitante */}
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={match.awayScore}
                        onKeyDown={(e) => {
                          if (["-", ".", ",", "e"].includes(e.key)) e.preventDefault();
                        }}
                        onPaste={(e) => {
                          const paste = e.clipboardData.getData('text');
                          if (!/^\d+$/.test(paste)) e.preventDefault();
                        }}
                        onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                        className="w-12 h-14 md:w-14 md:h-16 bg-brand-blue-deep border border-brand-blue-light rounded-xl text-center text-xl md:text-2xl font-black focus:border-brand-green outline-none transition-all placeholder:opacity-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex flex-col items-center gap-3">
                      <img 
                        src={match.awayFlag} 
                        alt="" 
                        className="w-14 h-10 object-contain rounded-xl shadow-sm"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/64?text=?'; }}
                      />
                      <span className="font-bold text-[10px] md:text-xs text-center uppercase tracking-wider">{match.away}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* COLUMNA DERECHA: TABLA COMPLETA */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase">Classificación</h2>

            <div className="bg-brand-blue-mid border border-brand-blue-light rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-brand-blue-light/30 text-[10px] font-black uppercase tracking-widest text-brand-text-dim">
                      <th className="px-4 py-4 text-center w-12">Pos</th>
                      <th className="px-4 py-4">Equipo</th>
                      <th className="px-2 py-4 text-center">PJ</th>
                      <th className="px-2 py-4 text-center">PG</th>
                      <th className="px-2 py-4 text-center">PE</th>
                      <th className="px-2 py-4 text-center">PP</th>
                      <th className="px-2 py-4 text-center">GF</th>
                      <th className="px-2 py-4 text-center">GC</th>
                      <th className="px-2 py-4 text-center">DG</th>
                      <th className="px-4 py-4 text-center bg-brand-blue-light/50 text-white">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-blue-light">
                    {activeTable.map((team, i) => (
                      <tr key={team.name} className={`transition-colors ${i < 2 ? 'bg-brand-green/5' : ''}`}>
                        <td className="px-4 py-4 text-center font-bold text-xs">{i + 1}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img src={team.flag} alt="" className="w-6 h-4 object-contain rounded-sm shadow-sm" />
                            <span className="font-bold text-xs truncate w-24">{team.name}</span>
                          </div>
                        </td>
                        <td className="px-2 py-4 text-center text-[10px] font-mono">{team.pj}</td>
                        <td className="px-2 py-4 text-center text-[10px] font-mono">{team.pg}</td>
                        <td className="px-2 py-4 text-center text-[10px] font-mono">{team.pe}</td>
                        <td className="px-2 py-4 text-center text-[10px] font-mono">{team.pp}</td>
                        <td className="px-2 py-4 text-center text-[10px] font-mono">{team.gf}</td>
                        <td className="px-2 py-4 text-center text-[10px] font-mono">{team.gc}</td>
                        <td className={`px-2 py-4 text-center text-[10px] font-bold font-mono ${team.dg > 0 ? 'text-brand-green' : team.dg < 0 ? 'text-red-400' : ''}`}>
                          {team.dg > 0 ? `+${team.dg}` : team.dg}
                        </td>
                        <td className={`px-4 py-4 text-center font-black text-md ${i < 2 ? 'text-brand-green bg-brand-green/10' : 'bg-brand-blue-light/20'}`}>
                          {team.pts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-brand-blue-light/10 text-[9px] text-brand-text-dim text-center uppercase tracking-widest font-bold">
                * Los 2 primeros de cada grupo y los 8 mejores terceros pasan a dieciseisavos de final.
              </div>
            </div>
          </section>

        </div>
      </main>

      <footer className="p-6 text-center text-[10px] text-brand-text-dim uppercase tracking-[0.2em] font-bold">
        Porra Pro © 2026
      </footer>
    </div>
  );
};

export default SimulacioGrupsPage;