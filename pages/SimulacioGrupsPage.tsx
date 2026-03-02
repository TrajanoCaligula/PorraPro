
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../constants';
import { supabase } from '../lib/supabase';

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

const [groups, setGroups] = useState<Group[]>([]);
const [activeGroupId, setActiveGroupId] = useState('A');
const [loading, setLoading] = useState(true); // Nuevo: para saber si está cargando

useEffect(() => {
  const fetchTeamsData = async () => {
    setLoading(true);
    // 1. Traemos los equipos de la DB
    const { data: teams, error } = await supabase
      .from('teams')
      .select('name, flag, group_name')
      .order('group_name', { ascending: true });

    if (error) {
      console.error('Error:', error);
      setLoading(false);
      return;
    }

    // 2. Generamos la estructura de los 12 grupos (A-L)
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    
    const formattedGroups: Group[] = letters.map(letter => {
      const teamsInGroup = teams.filter(t => t.group_name === letter);
      
      // Lógica para crear los 6 partidos automáticos por grupo
      const matches: MatchPrediction[] = [];
      if (teamsInGroup.length === 4) {
        // Combinaciones estándar de fase de grupos (1vs2, 3vs4, etc.)
        const pairings = [[0,1], [2,3], [0,2], [1,3], [0,3], [1,2]];
        pairings.forEach((p, i) => {
          const h = teamsInGroup[p[0]];
          const a = teamsInGroup[p[1]];
          matches.push({
            id: `${letter}${i + 1}`,
            home: h.name, away: a.name,
            homeFlag: h.flag, awayFlag: a.flag,
            homeScore: '', awayScore: ''
          });
        });
      }

      return {
        id: letter,
        name: `Group ${letter}`,
        teams: teamsInGroup.map(t => ({ name: t.name, flag: t.flag })),
        matches
      };
    });

    setGroups(formattedGroups);
    setLoading(false);
  };

  fetchTeamsData();
}, []);

const SimulacioGrupsPage: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [activeGroupId, setActiveGroupId] = useState('A');

  // Agregamos una validación para que no sea null
    const activeGroup = useMemo(() => 
      groups.find(g => g.id === activeGroupId) || null
    , [groups, activeGroupId]);

    const activeTable = useMemo(() => 
      activeGroup ? calculateTable(activeGroup) : []
    , [activeGroup]);

  const handleScoreChange = (matchId: string, side: 'home' | 'away', value: string) => {
    setGroups(prev => prev.map(g => ({
      ...g,
      matches: g.matches.map(m => m.id === matchId ? { ...m, [side === 'home' ? 'homeScore' : 'awayScore']: value } : m)
    })));
  };

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

        home.pj++;
        away.pj++;
        home.gf += hS;
        home.gc += aS;
        away.gf += aS;
        away.gc += hS;

        if (hS > aS) {
          home.pg++;
          home.pts += 3;
          away.pp++;
        } else if (hS < aS) {
          away.pg++;
          away.pts += 3;
          home.pp++;
        } else {
          home.pe++;
          away.pe++;
          home.pts += 1;
          away.pts += 1;
        }
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

  const activeTable = useMemo(() => calculateTable(activeGroup), [activeGroup]);

  const totalMatches = 72;
  const completedMatches = groups.reduce((acc, g) => acc + g.matches.filter(m => m.homeScore !== '' && m.awayScore !== '').length, 0);
  const progress = (completedMatches / totalMatches) * 100;

  if (loading || !activeGroup) {
      return (
        <div className="min-h-screen bg-brand-blue-deep flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
            <p className="text-white font-black uppercase tracking-widest">Preparant Mundial 2026...</p>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-brand-blue-deep text-white flex flex-col">
      {/* Header */}
      <header className="bg-brand-blue-mid border-b border-brand-blue-light p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="h-8 w-px bg-brand-blue-light hidden md:block"></div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">Simulació Inicial — Fase de Grups</h1>
              <p className="text-xs text-brand-text-dim uppercase font-bold tracking-widest">Mundial 2026</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-widest text-brand-text-dim">
              <span>Progrés de la simulació</span>
              <span>{completedMatches} / {totalMatches} partits</span>
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
              Guardar i continuar més tard
            </button>
            <button 
              onClick={() => navigate('/simulacio-final')}
              disabled={completedMatches < totalMatches}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${completedMatches === totalMatches ? 'bg-brand-green text-brand-blue-deep hover:bg-brand-green-dark' : 'bg-brand-blue-light text-brand-text-dim cursor-not-allowed'}`}
            >
              Següent fase →
            </button>
          </div>
        </div>
      </header>

      {/* Group Selector */}
      <nav className="bg-brand-blue-mid/50 border-b border-brand-blue-light overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex px-6">
          {groups.map(g => (
            <button
              key={g.id}
              onClick={() => setActiveGroupId(g.id)}
              className={`px-6 py-4 text-sm font-black transition-all border-b-2 whitespace-nowrap ${activeGroupId === g.id ? 'border-brand-green text-brand-green bg-brand-green/5' : 'border-transparent text-brand-text-dim hover:text-white'}`}
            >
              GRUP {g.id}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Column: Matches */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase">Partits del Grup {activeGroupId}</h2>
              <span className="text-xs font-bold text-brand-text-dim uppercase tracking-widest">6 partits per grup</span>
            </div>

            <div className="space-y-4">
              {activeGroup.matches.map(match => (
                <div key={match.id} className="bg-brand-blue-mid border border-brand-blue-light p-6 rounded-2xl shadow-xl hover:border-brand-green/30 transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-4xl">{match.homeFlag}</span>
                      <span className="font-bold text-sm text-center">{match.home}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={match.homeScore}
                        onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                        className="w-14 h-16 bg-brand-blue-deep border border-brand-blue-light rounded-xl text-center text-2xl font-black focus:border-brand-green outline-none transition-all"
                      />
                      <span className="text-brand-text-dim font-black text-xl">-</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={match.awayScore}
                        onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                        className="w-14 h-16 bg-brand-blue-deep border border-brand-blue-light rounded-xl text-center text-2xl font-black focus:border-brand-green outline-none transition-all"
                      />
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-4xl">{match.awayFlag}</span>
                      <span className="font-bold text-sm text-center">{match.away}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Column: Table */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase">Classificació Grup {activeGroupId}</h2>
              <div className="flex gap-2">
                <span className="bg-brand-green/10 text-brand-green text-[10px] px-2 py-1 rounded font-bold uppercase tracking-tighter border border-brand-green/20">Passen ronda</span>
              </div>
            </div>

            <div className="bg-brand-blue-mid border border-brand-blue-light rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-blue-light/30 text-[10px] font-black uppercase tracking-widest text-brand-text-dim">
                    <th className="px-4 py-4 text-center w-12">Pos</th>
                    <th className="px-4 py-4">Equip</th>
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
                      <td className="px-4 py-4 text-center">
                        <span className={`mono-font font-bold ${i < 2 ? 'text-brand-green' : 'text-brand-text-dim'}`}>{i + 1}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{team.flag}</span>
                          <span className="font-bold text-sm">{team.name}</span>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-center mono-font text-xs">{team.pj}</td>
                      <td className="px-2 py-4 text-center mono-font text-xs">{team.pg}</td>
                      <td className="px-2 py-4 text-center mono-font text-xs">{team.pe}</td>
                      <td className="px-2 py-4 text-center mono-font text-xs">{team.pp}</td>
                      <td className="px-2 py-4 text-center mono-font text-xs">{team.gf}</td>
                      <td className="px-2 py-4 text-center mono-font text-xs">{team.gc}</td>
                      <td className="px-2 py-4 text-center mono-font text-xs font-bold">{team.dg > 0 ? `+${team.dg}` : team.dg}</td>
                      <td className={`px-4 py-4 text-center mono-font font-black text-lg ${i < 2 ? 'text-brand-green bg-brand-green/10' : 'bg-brand-blue-light/20'}`}>
                        {team.pts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-brand-blue-light/20 text-[10px] text-brand-text-dim font-medium italic text-center">
                * Els 2 primers de cada grup i els 8 millors tercers passen als setzens de final.
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl space-y-3">
              <h3 className="font-black uppercase text-sm flex items-center gap-2">
                <span>💡</span> Consell Pro
              </h3>
              <p className="text-xs text-brand-text-dim leading-relaxed">
                La classificació s'actualitza automàticament mentre omples els resultats. Revisa bé els gols a favor i en contra, ja que la diferència de gols pot ser decisiva per passar de ronda!
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-6 text-center text-[10px] text-brand-text-dim uppercase tracking-[0.2em] font-bold">
        Porra Pro © 2026 • Simulació de Fase de Grups
      </footer>
    </div>
  );
};

export default SimulacioGrupsPage;
