import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
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
  headToHead: Record<string, { gf: number; gc: number }>;
  needsFairPlay?: boolean; 
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
  const [manualOrders, setManualOrders] = useState<Record<string, string[]>>({});

  // --- Carga de Datos ---
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
              const isLocked = m.startTime ? new Date() > new Date(m.startTime) : false;

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
                isLocked,
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

  // --- Lógica de Ordenación y Desempate ---
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
        if (!home.headToHead[m.away]) home.headToHead[m.away] = { gf: 0, gc: 0 };
        if (!away.headToHead[m.home]) away.headToHead[m.home] = { gf: 0, gc: 0 };
        home.headToHead[m.away].gf += hS; home.headToHead[m.away].gc += aS;
        away.headToHead[m.home].gf += aS; away.headToHead[m.home].gc += hS;
        if (hS > aS) { home.pg++; home.pts += 3; away.pp++; } 
        else if (hS < aS) { away.pg++; away.pts += 3; home.pp++; } 
        else { home.pe++; away.pe++; home.pts += 1; away.pts += 1; }
      }
    });

    const sorted = Object.values(stats).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      
      // 1. Enfrentamiento directo (H2H)
      const h2h_a = a.headToHead[b.name];
      const h2h_b = b.headToHead[a.name];
      if (h2h_a && h2h_b) {
        const diffH2H = (h2h_a.gf - h2h_a.gc) - (h2h_b.gf - h2h_b.gc);
        if (diffH2H !== 0) return -diffH2H;
        if (h2h_a.gf !== h2h_b.gf) return h2h_b.gf - h2h_a.gf;
      }

      // 2. Diferencia de goles general
      const dgA = a.gf - a.gc;
      const dgB = b.gf - b.gc;
      if (dgB !== dgA) return dgB - dgA;
      
      // 3. Goles a favor
      if (b.gf !== a.gf) return b.gf - a.gf;

      // 4. Orden manual (Fair Play)
      const groupManualOrder = manualOrders[group.id];
      if (groupManualOrder) {
        const idxA = groupManualOrder.indexOf(a.name);
        const idxB = groupManualOrder.indexOf(b.name);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      }
      return a.name.localeCompare(b.name);
    }).map(s => ({ ...s, dg: s.gf - s.gc }));

    // Detectar necesidad de Fair Play (Empate absoluto)
    for (let i = 0; i < sorted.length; i++) {
      const curr = sorted[i];
      const prev = sorted[i-1];
      const next = sorted[i+1];
      const isSame = (t1: TeamStats, t2: TeamStats) => 
        t1 && t2 && t1.pts === t2.pts && (t1.gf - t1.gc) === (t2.gf - t2.gc) && t1.gf === t2.gf &&
        t1.headToHead[t2.name]?.gf === t2.headToHead[t1.name]?.gf;

      if ((prev && isSame(curr, prev)) || (next && isSame(curr, next))) {
        curr.needsFairPlay = true;
      }
    }
    return sorted;
  };

  const activeGroup = useMemo(() => groups.find(g => g.id === activeGroupId) || null, [groups, activeGroupId]);
  const activeTable = useMemo(() => activeGroup ? calculateTable(activeGroup) : [], [activeGroup, manualOrders]);

  // --- Handlers ---
  const handleScoreChange = (matchId: string, side: 'home' | 'away', value: string) => {
    const val = value === '' ? '' : Math.max(0, parseInt(value, 10)).toString();
    setGroups(prev => prev.map(g => ({
      ...g,
      matches: g.matches.map(m => m.id === matchId ? { ...m, [side === 'home' ? 'homeScore' : 'awayScore']: val } : m)
    })));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !activeGroup) return;
    const newOrder = Array.from(activeTable);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);

    setManualOrders(prev => ({
      ...prev,
      [activeGroupId]: newOrder.map(t => t.name)
    }));
  };

  const handleSavePredictions = async (showAlert = false) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('user_id');
      const { data: poolData } = await supabase.from('Pools').select('idPool').eq('code', poolCode).single();
      if (!poolData || !userId) throw new Error("Sesión no válida");

      const predictionsToSave = groups.flatMap(group => 
        group.matches
          .filter(m => m.homeScore !== '' && m.awayScore !== '' && !m.isLocked)
          .map(match => ({
            idUser: userId, idPool: poolData.idPool, idMatch: match.idMatchDB,
            scoreHome: parseInt(match.homeScore), scoreAway: parseInt(match.awayScore),
            idTeamWinner: parseInt(match.homeScore) > parseInt(match.awayScore) ? match.homeId : 
                          parseInt(match.awayScore) > parseInt(match.homeScore) ? match.awayId : null
          }))
      );

      if (predictionsToSave.length > 0) {
        await supabase.from('Predictions').upsert(predictionsToSave, { onConflict: 'idUser,idPool,idMatch' });
      }
      if (showAlert) alert("¡Sincronizado!");
      return true;
    } catch (err: any) {
      alert("Error: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const totalMatches = groups.reduce((acc, g) => acc + g.matches.length, 0);
  const completedMatches = groups.reduce((acc, g) => acc + g.matches.filter(m => m.homeScore !== '' && m.awayScore !== '').length, 0);

  // --- Sub-componente de Fila ---
  const TeamRow = ({ team, index, isDraggable, provided, snapshot }: any) => (
    <tr
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={`transition-all ${snapshot?.isDragging ? 'bg-brand-blue-light/50 shadow-2xl' : index < 2 ? 'bg-brand-green/5' : ''} ${isDraggable ? 'cursor-grab active:cursor-grabbing hover:bg-white/5' : 'cursor-default'}`}
    >
      <td className="px-4 py-4 text-center font-bold text-xs relative">
        {index + 1}
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <img src={team.flag} alt="" className="w-6 h-4 object-contain rounded-sm" />
          <div className="flex items-center gap-2">
            <span className={`font-bold text-xs uppercase ${team.needsFairPlay ? 'text-brand-orange' : 'text-white'}`}>
              {team.name}
            </span>
            {team.needsFairPlay && (
              <div className="flex items-center gap-1.5">
                <span className="bg-brand-orange text-brand-blue-deep text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm tracking-tighter">
                  EMPATADO
                </span>
                <span className="text-brand-orange font-bold text-sm animate-pulse cursor-grab">
                  ⠿
                </span>
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-2 py-4 text-center text-[10px] font-mono">{team.pj}</td>
      <td className="px-2 py-4 text-center text-[10px] font-mono">{team.gf}</td>
      <td className="px-2 py-4 text-center text-[10px] font-mono">{team.gc}</td>
      <td className={`px-2 py-4 text-center text-[10px] font-bold ${team.dg > 0 ? 'text-brand-green' : team.dg < 0 ? 'text-red-400' : ''}`}>
        {team.dg >= 0 ? `+${team.dg}` : team.dg}
      </td>
      <td className={`px-4 py-4 text-center font-black text-md ${index < 2 ? 'text-brand-green bg-brand-green/10' : 'bg-brand-blue-light/50'}`}>{team.pts}</td>
    </tr>
  );

  if (loading || !activeGroup) {
    return (
      <div className="min-h-screen bg-brand-blue-deep flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-blue-deep text-white flex flex-col font-sans">
      <style>{`
        input.no-spinner::-webkit-outer-spin-button,
        input.no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input.no-spinner[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      
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
          <div className="flex gap-3">
            <button onClick={() => handleSavePredictions(true)} className="px-4 py-2 rounded-lg border border-brand-blue-light text-xs font-bold hover:bg-brand-blue-light">Guardar</button>
            <button 
              onClick={async () => {
                const saved = await handleSavePredictions(false);
                if (saved) navigate(`/simulacion-finales/${poolCode}`);
              }}
              disabled={completedMatches < totalMatches}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase ${completedMatches === totalMatches ? 'bg-brand-green text-brand-blue-deep' : 'bg-brand-blue-light text-brand-text-dim cursor-not-allowed'}`}
            >
              Siguiente fase →
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-brand-blue-mid/50 border-b border-brand-blue-light overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex px-6">
          {groups.map(g => (
            <button key={g.id} onClick={() => setActiveGroupId(g.id)} className={`px-6 py-4 text-sm font-black transition-all border-b-2 ${activeGroupId === g.id ? 'border-brand-green text-brand-green bg-brand-green/5' : 'border-transparent text-brand-text-dim hover:text-white'}`}>
              GRUPO {g.id}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-10">
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase">Partidos Grupo {activeGroupId}</h2>
            <div className="space-y-4">
              {activeGroup.matches.map(match => (
                <div key={match.id} className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex flex-col items-center gap-3">
                      <img src={match.homeFlag} alt="" className="w-14 h-10 object-contain" />
                      <span className="font-bold text-xs uppercase text-center">{match.home}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        value={match.homeScore} 
                        onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                        className="no-spinner w-12 h-14 bg-brand-blue-deep border border-brand-blue-light rounded-xl text-center text-xl font-black outline-none focus:border-brand-green" 
                      />
                      <span className="text-brand-text-dim font-black">-</span>
                      <input 
                        type="number" 
                        value={match.awayScore} 
                        onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                        className="no-spinner w-12 h-14 bg-brand-blue-deep border border-brand-blue-light rounded-xl text-center text-xl font-black outline-none focus:border-brand-green" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-3">
                      <img src={match.awayFlag} alt="" className="w-14 h-10 object-contain" />
                      <span className="font-bold text-xs uppercase text-center">{match.away}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

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
                      <th className="px-2 py-4 text-center">GF</th>
                      <th className="px-2 py-4 text-center">GC</th>
                      <th className="px-2 py-4 text-center">DG</th>
                      <th className="px-4 py-4 text-center bg-brand-blue-light/50 text-white">Pts</th>
                    </tr>
                  </thead>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={`table-${activeGroupId}`}>
                      {(provided) => (
                        <tbody {...provided.droppableProps} ref={provided.innerRef} className="divide-y divide-brand-blue-light">
                          {activeTable.map((team, i) => {
                            if (team.needsFairPlay) {
                              return (
                                <Draggable key={team.name} draggableId={team.name} index={i}>
                                  {(p, s) => <TeamRow team={team} index={i} isDraggable={true} provided={p} snapshot={s} />}
                                </Draggable>
                              );
                            }
                            return <TeamRow key={team.name} team={team} index={i} isDraggable={false} />;
                          })}
                          {provided.placeholder}
                        </tbody>
                      )}
                    </Droppable>
                  </DragDropContext>
                </table>
              </div>

              <div className="p-6 bg-brand-blue-deep/50 border-t border-brand-blue-light">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="space-y-3">
                    <h3 className="text-brand-orange text-sm font-black uppercase tracking-widest">
                      ⚠️ CRITERIOS DE DESEMPATE (Mundial 2026)
                    </h3>
                    <p className="text-[11px] text-brand-text-dim leading-relaxed">
                      Desde 2026, el orden se decide <strong className="text-white">primero</strong> por el <strong className="text-white">resultado del enfrentamiento directo</strong> entre los equipos implicados:
                    </p>
                    <ol className="text-[11px] text-brand-text-dim space-y-2 list-decimal ml-4">
                      <li><strong>Mayor diferencia de goles en los partidos entre las selecciones en cuestión.</strong></li>
                      <li><strong>Mayor número de goles marcados en los partidos entre las selecciones implicadas.</strong></li>
                      <li><strong>Mayor diferencia de goles en todos los partidos del grupo.</strong></li>
                      <li><strong>Mayor nombre de goles marcados en toda la fase de grupos.</strong></li>
                      <li><strong>Mejor conducta deportiva</strong> (tarjetas amarillas/rojas).</li>
                    </ol>
                    <p className="text-[10px] text-brand-orange italic mt-2">
                      * Si más de 2 selecciones están empatadas, se aplican estos criterios en el orden indicado considerando SOLO los enfrentamientos directos. En caso de persistir el empate absoluto, utiliza el marcador <span className="font-bold">⠿</span> para el orden manual (Fair Play).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="p-6 text-center text-[10px] text-brand-text-dim uppercase tracking-[0.2em] font-bold">Porra Pro © 2026</footer>
    </div>
  );
};

export default SimulacioGrupsPage;