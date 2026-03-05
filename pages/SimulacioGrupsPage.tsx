import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Logo } from '../constants';
import { supabase } from '../lib/supabase';

// --- Interfaces ---
interface TeamStats {
  id?: number;
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
  headToHead: Record<string, { gf: number; gc: number }>; // Nova propietat per desempat
}

interface MatchPrediction {
  id: string;
  idMatchDB: number;
  home: string;
  away: string;
  homeId: number;
  awayId: number;
  homeFlag: string;
  awayFlag: string;
  homeScore: string;
  awayScore: string;
  isLocked: boolean;
  startTime: string;
}

interface Group {
  id: string;
  name: string;
  teams: { name: string; flag: string }[];
  matches: MatchPrediction[];
}

const SimulacioGrupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { poolCode } = useParams();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroupId, setActiveGroupId] = useState('A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('user_id');
        
        const { data: participation, error: partError } = await supabase
          .from('PoolParticipations')
          .select(`idPool, Pools!inner (code)`)
          .eq('idUser', userId)
          .eq('Pools.code', poolCode)
          .single();

        if (partError || !participation) {
          navigate('/dashboard');
          return;
        }

        const activePoolId = participation.idPool;

        const [teamsRes, matchesRes, predictionsRes] = await Promise.all([
          supabase.from('Teams').select('idTeam, name, flag_url, group_name').order('group_name', { ascending: true }),
          supabase.from('Matches').select(`
            idMatch, idTeamOne, idTeamTwo, group_name, phase, startTime,
            homeTeam:idTeamOne (name, flag_url),
            awayTeam:idTeamTwo (name, flag_url)
          `).eq('phase', 'GROUP_STAGE'),
          supabase.from('Predictions')
            .select('idMatch, scoreHome, scoreAway')
            .eq('idUser', userId)
            .eq('idPool', activePoolId)
        ]);

        if (teamsRes.error) throw teamsRes.error;
        if (matchesRes.error) throw matchesRes.error;

        const teams = teamsRes.data;
        const dbMatches = matchesRes.data;
        const existingPredictions = predictionsRes.data || [];
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

        const formattedGroups: Group[] = letters.map(letter => {
          const teamsInGroup = teams.filter(t => t.group_name === letter);
          const matchesInGroup = dbMatches
            .filter(m => m.group_name === letter)
            .filter(m => m.homeTeam && m.awayTeam)
            .map((m) => {
              const savedPred = existingPredictions.find(p => p.idMatch === m.idMatch);
              const matchDate = m.startTime ? new Date(m.startTime) : null;
              const now = new Date();
              const isLocked = matchDate ? now > matchDate : false;

              return {
                id: m.idMatch.toString(),
                idMatchDB: m.idMatch,
                home: m.homeTeam?.name || 'TBD',
                away: m.awayTeam?.name || 'TBD',
                homeId: m.idTeamOne,
                awayId: m.idTeamTwo,
                homeFlag: m.homeTeam?.flag_url || '🏳️',
                awayFlag: m.awayTeam?.flag_url || '🏳️',
                homeScore: savedPred ? savedPred.scoreHome.toString() : '',
                awayScore: savedPred ? savedPred.scoreAway.toString() : '',
                isLocked: isLocked,
                startTime: m.startTime
              };
            });

          return {
            id: letter,
            name: `Group ${letter}`,
            teams: teamsInGroup.map(t => ({ name: t.name, flag: t.flag_url || '🏳️' })),
            matches: matchesInGroup
          };
        });

        setGroups(formattedGroups);
      } catch (error: any) {
        console.error('Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [poolCode, navigate]);

  // --- Lògica de Càlcul amb Desempat Mundial 2026 ---
  const calculateTable = (group: Group): TeamStats[] => {
    const stats: Record<string, TeamStats> = {};
    group.teams.forEach(t => {
      stats[t.name] = { 
        name: t.name, flag: t.flag, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0,
        headToHead: {} 
      };
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

        // Guardar resultats directes per desempat
        if (!home.headToHead[m.away]) home.headToHead[m.away] = { gf: 0, gc: 0 };
        if (!away.headToHead[m.home]) away.headToHead[m.home] = { gf: 0, gc: 0 };
        home.headToHead[m.away].gf += hS;
        home.headToHead[m.away].gc += aS;
        away.headToHead[m.home].gf += aS;
        away.headToHead[m.home].gc += hS;

        if (hS > aS) { home.pg++; home.pts += 3; away.pp++; }
        else if (hS < aS) { away.pg++; away.pts += 3; home.pp++; }
        else { home.pe++; away.pe++; home.pts += 1; away.pts += 1; }
      }
    });

    return Object.values(stats).sort((a, b) => {
      // 1. Punts
      if (b.pts !== a.pts) return b.pts - a.pts;

      // Detectar equips empatats per aplicar mini-lliga
      const tiedTeams = Object.values(stats).filter(t => t.pts === a.pts);

      if (tiedTeams.length === 2) {
        // Desempat entre 2: Enfrontament directe
        const h2h_a = a.headToHead[b.name];
        const h2h_b = b.headToHead[a.name];
        if (h2h_a && h2h_b) {
          const diffA = h2h_a.gf - h2h_a.gc;
          const diffB = h2h_b.gf - h2h_b.gc;
          if (diffA !== diffB) return diffB - diffA;
          if (h2h_a.gf !== h2h_b.gf) return h2h_b.gf - h2h_a.gf;
        }
      } else if (tiedTeams.length > 2) {
        // Desempat entre 3+: Mini-lliga
        const getMiniStats = (team: TeamStats) => {
          let gf = 0, gc = 0;
          tiedTeams.forEach(opp => {
            if (opp.name !== team.name && team.headToHead[opp.name]) {
              gf += team.headToHead[opp.name].gf;
              gc += team.headToHead[opp.name].gc;
            }
          });
          return { gf, diff: gf - gc };
        };
        const miniA = getMiniStats(a);
        const miniB = getMiniStats(b);
        if (miniA.diff !== miniB.diff) return miniB.diff - miniA.diff;
        if (miniA.gf !== miniB.gf) return miniB.gf - miniA.gf;
      }

      // 3. Diferència de gols general
      const dgA = a.gf - a.gc;
      const dgB = b.gf - b.gc;
      if (dgB !== dgA) return dgB - dgA;

      // 4. Gols marcats totals
      if (b.gf !== a.gf) return b.gf - a.gf;

      // 5. Alfabet (últim recurs)
      return a.name.localeCompare(b.name);
    }).map(s => ({ ...s, dg: s.gf - s.gc }));
  };

  const activeGroup = useMemo(() => groups.find(g => g.id === activeGroupId) || null, [groups, activeGroupId]);
  const activeTable = useMemo(() => activeGroup ? calculateTable(activeGroup) : [], [activeGroup]);

  const handleScoreChange = (matchId: string, side: 'home' | 'away', value: string) => {
    if (value === '') {
      updateGroups(matchId, side, '');
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      updateGroups(matchId, side, numValue.toString());
    }
  };

  const updateGroups = (matchId: string, side: 'home' | 'away', value: string) => {
    setGroups(prev => prev.map(g => ({
      ...g,
      matches: g.matches.map(m => m.id === matchId ? { ...m, [side === 'home' ? 'homeScore' : 'awayScore']: value } : m)
    })));
  };

  const handleSavePredictions = async (showAlert = false) => {
    setLoading(true);
    const userId = localStorage.getItem('user_id');
    try {
      const { data: poolData } = await supabase.from('Pools').select('idPool').eq('code', poolCode).single();
      if (!poolData || !userId) throw new Error("Sesión no válida");

      const predictionsToSave = groups.flatMap(group => 
        group.matches
          .filter(m => m.homeScore !== '' && m.awayScore !== '' && !m.isLocked)
          .map(match => ({
            idUser: userId,
            idPool: poolData.idPool,
            idMatch: match.idMatchDB,
            scoreHome: parseInt(match.homeScore),
            scoreAway: parseInt(match.awayScore),
            idTeamWinner: parseInt(match.homeScore) > parseInt(match.awayScore) ? match.homeId : 
                          parseInt(match.awayScore) > parseInt(match.homeScore) ? match.awayId : null
          }))
      );

      if (predictionsToSave.length > 0) {
        const { error } = await supabase.from('Predictions').upsert(predictionsToSave, { onConflict: 'idUser,idPool,idMatch' });
        if (error) throw error;
      }
      
      if (showAlert) alert("¡Sincronizado!");
      return true;
    } catch (err: any) {
      alert("Error al guardar: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const totalMatches = useMemo(() => groups.reduce((acc, g) => acc + g.matches.length, 0), [groups]);
  const completedMatches = useMemo(() => groups.reduce((acc, g) => acc + g.matches.filter(m => m.homeScore !== '' && m.awayScore !== '').length, 0), [groups]);
  const progress = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;

  if (loading || !activeGroup) {
    return (
      <div className="min-h-screen bg-brand-blue-deep flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
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
            <button 
              onClick={() => handleSavePredictions(true)}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-brand-blue-light text-xs font-bold hover:bg-brand-blue-light transition-all disabled:opacity-50"
            >
              {loading ? '...' : 'Guardar'}
            </button>
            <button 
              onClick={async () => {
                const saved = await handleSavePredictions(false);
                if (saved) {
                  navigate(`/simulacion-finales/${poolCode}`);
                }
              }}
              disabled={completedMatches < totalMatches || loading}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${
                completedMatches === totalMatches 
                  ? 'bg-brand-green text-brand-blue-deep hover:bg-brand-green-dark shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                  : 'bg-brand-blue-light text-brand-text-dim cursor-not-allowed'
              }`}
            >
              {loading ? 'Guardando...' : 'Siguiente fase →'}
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

                    {/* Marcador e Info Temporal */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={match.homeScore}
                          disabled={match.isLocked}
                          onKeyDown={(e) => ["-", ".", ",", "e"].includes(e.key) && e.preventDefault()}
                          onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                          className={`w-12 h-14 md:w-14 md:h-16 bg-brand-blue-deep border rounded-xl text-center text-xl md:text-2xl font-black focus:border-brand-green outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
                            ${match.isLocked ? 'opacity-40 cursor-not-allowed border-gray-600 grayscale' : 'border-brand-blue-light'}`}
                        />

                        <span className="text-brand-text-dim font-black text-xl">-</span>

                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={match.awayScore}
                          disabled={match.isLocked}
                          onKeyDown={(e) => ["-", ".", ",", "e"].includes(e.key) && e.preventDefault()}
                          onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                          className={`w-12 h-14 md:w-14 md:h-16 bg-brand-blue-deep border rounded-xl text-center text-xl md:text-2xl font-black focus:border-brand-green outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
                            ${match.isLocked ? 'opacity-40 cursor-not-allowed border-gray-600 grayscale' : 'border-brand-blue-light'}`}
                        />
                      </div>

                      <div className="text-[10px] font-bold uppercase tracking-widest flex flex-col items-center">
                        {match.isLocked ? (
                          <span className="text-red-400/80 flex items-center gap-1">🔒 Cerrado</span>
                        ) : (
                          <>
                            <span className="text-brand-text-dim">
                              {new Date(match.startTime).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                            <span className="text-brand-green">
                              {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </>
                        )}
                      </div>
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
            <h2 className="text-2xl font-black uppercase">Clasificación Grupo {activeGroupId}</h2>

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
              
              {/* --- CUADRO EXPLICATIVO EN CASTELLANO --- */}
                <div className="p-6 bg-brand-blue-deep/50 border-t border-brand-blue-light">
                  <h3 className="text-brand-orange text-[11px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    ⚠️ Criterios de desempate (Mundial 2026)
                  </h3>
                  <p className="text-[10px] text-brand-text-dim leading-relaxed mb-3">
                    En caso de empate a puntos, el orden se decide por el <strong>resultado directo</strong> entre los equipos implicados (mini-liga):
                  </p>
                  <ol className="text-[10px] text-brand-text-dim space-y-1 list-decimal ml-4">
                    <li>Mayor <strong>diferencia de goles</strong> en los partidos entre los equipos empatados.</li>
                    <li>Mayor número de <strong>goles marcados</strong> en los partidos entre los equipos empatados.</li>
                    <li>Mejor <strong>diferencia de goles general</strong> en todos los partidos del grupo.</li>
                    <li>Mayor número de <strong>goles marcados</strong> en toda la fase de grupos.</li>
                    <li>Mejor conducta deportiva (puntos Fair Play).</li>
                  </ol>
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