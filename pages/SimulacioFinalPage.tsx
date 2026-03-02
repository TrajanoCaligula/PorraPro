
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../constants';

interface Match {
  id: string;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  homeScore: string;
  awayScore: string;
  winner?: string;
  winnerFlag?: string;
  isLocked?: boolean;
}

const INITIAL_SETZENS: Match[] = [
  { id: 'S32-0', home: 'Espanya', away: 'Marroc', homeFlag: '🇪🇸', awayFlag: '🇲🇦', homeScore: '', awayScore: '' },
  { id: 'S32-1', home: 'Brasil', away: 'Corea Sud', homeFlag: '🇧🇷', awayFlag: '🇰🇷', homeScore: '', awayScore: '' },
  { id: 'S32-2', home: 'Argentina', away: 'Austràlia', homeFlag: '🇦🇷', awayFlag: '🇦🇺', homeScore: '', awayScore: '' },
  { id: 'S32-3', home: 'França', away: 'Polònia', homeFlag: '🇫🇷', awayFlag: '🇵🇱', homeScore: '', awayScore: '' },
  { id: 'S32-4', home: 'Anglaterra', away: 'Senegal', homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayFlag: '🇸🇳', homeScore: '', awayScore: '' },
  { id: 'S32-5', home: 'Japó', away: 'Croàcia', homeFlag: '🇯🇵', awayFlag: '🇭🇷', homeScore: '', awayScore: '' },
  { id: 'S32-6', home: 'Portugal', away: 'Suïssa', homeFlag: '🇵🇹', awayFlag: '🇨🇭', homeScore: '', awayScore: '' },
  { id: 'S32-7', home: 'Països Baixos', away: 'USA', homeFlag: '🇳🇱', awayFlag: '🇺🇸', homeScore: '', awayScore: '' },
  { id: 'S32-8', home: 'Alemanya', away: 'Mèxic', homeFlag: '🇩🇪', awayFlag: '🇲🇽', homeScore: '', awayScore: '' },
  { id: 'S32-9', home: 'Uruguai', away: 'Ghana', homeFlag: '🇺🇾', awayFlag: '🇬🇭', homeScore: '', awayScore: '' },
  { id: 'S32-10', home: 'Bèlgica', away: 'Canadà', homeFlag: '🇧🇪', awayFlag: '🇨🇦', homeScore: '', awayScore: '' },
  { id: 'S32-11', home: 'Dinamarca', away: 'Tunísia', homeFlag: '🇩🇰', awayFlag: '🇹🇳', homeScore: '', awayScore: '' },
  { id: 'S32-12', home: 'Sèrbia', away: 'Camerun', homeFlag: '🇷🇸', awayFlag: '🇨🇲', homeScore: '', awayScore: '' },
  { id: 'S32-13', home: 'Suïssa', away: 'Equador', homeFlag: '🇨🇭', awayFlag: '🇪🇨', homeScore: '', awayScore: '' },
  { id: 'S32-14', home: 'Corea Sud', away: 'Aràbia Saudita', homeFlag: '🇰🇷', awayFlag: '🇸🇦', homeScore: '', awayScore: '' },
  { id: 'S32-15', home: 'USA', away: 'Gales', homeFlag: '🇺🇸', awayFlag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', homeScore: '', awayScore: '' },
];

const SimulacioFinalPage: React.FC = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const [setzens, setSetzens] = useState<Match[]>(INITIAL_SETZENS);
  const [vuitens, setVuitens] = useState<Match[]>(Array.from({ length: 8 }, (_, i) => ({
    id: `V16-${i}`, home: '?', away: '?', homeFlag: '🏳️', awayFlag: '🏳️', homeScore: '', awayScore: '', isLocked: true
  })));
  const [quarts, setQuarts] = useState<Match[]>(Array.from({ length: 4 }, (_, i) => ({
    id: `Q8-${i}`, home: '?', away: '?', homeFlag: '🏳️', awayFlag: '🏳️', homeScore: '', awayScore: '', isLocked: true
  })));
  const [semis, setSemis] = useState<Match[]>(Array.from({ length: 2 }, (_, i) => ({
    id: `S4-${i}`, home: '?', away: '?', homeFlag: '🏳️', awayFlag: '🏳️', homeScore: '', awayScore: '', isLocked: true
  })));
  const [final, setFinal] = useState<Match>({ id: 'F2', home: '?', away: '?', homeFlag: '🏳️', awayFlag: '🏳️', homeScore: '', awayScore: '', isLocked: true });

  const updateMatch = (round: string, matchId: string, side: 'home' | 'away', score: string) => {
    const updateRound = (prev: Match[]) => prev.map(m => {
      if (m.id === matchId) {
        const newMatch = { ...m, [side === 'home' ? 'homeScore' : 'awayScore']: score };
        // Auto-determine winner if not draw
        const hS = parseInt(newMatch.homeScore);
        const aS = parseInt(newMatch.awayScore);
        if (!isNaN(hS) && !isNaN(aS)) {
          if (hS > aS) {
            newMatch.winner = newMatch.home;
            newMatch.winnerFlag = newMatch.homeFlag;
          } else if (aS > hS) {
            newMatch.winner = newMatch.away;
            newMatch.winnerFlag = newMatch.awayFlag;
          } else {
            newMatch.winner = undefined; // Draw needs manual selection
          }
        } else {
          newMatch.winner = undefined;
        }
        return newMatch;
      }
      return m;
    });

    if (round === 'setzens') setSetzens(updateRound);
    else if (round === 'vuitens') setVuitens(updateRound);
    else if (round === 'quarts') setQuarts(updateRound);
    else if (round === 'semis') setSemis(updateRound);
    else if (round === 'final') setFinal(m => {
      const newMatch = { ...m, [side === 'home' ? 'homeScore' : 'awayScore']: score };
      const hS = parseInt(newMatch.homeScore);
      const aS = parseInt(newMatch.awayScore);
      if (!isNaN(hS) && !isNaN(aS)) {
        if (hS > aS) { newMatch.winner = newMatch.home; newMatch.winnerFlag = newMatch.homeFlag; }
        else if (aS > hS) { newMatch.winner = newMatch.away; newMatch.winnerFlag = newMatch.awayFlag; }
      }
      return newMatch;
    });

    propagateWinner(round, matchId);
  };

  const selectWinner = (round: string, matchId: string, winner: string, flag: string) => {
    const updateRound = (prev: Match[]) => prev.map(m => m.id === matchId ? { ...m, winner, winnerFlag: flag } : m);
    if (round === 'setzens') setSetzens(updateRound);
    else if (round === 'vuitens') setVuitens(updateRound);
    else if (round === 'quarts') setQuarts(updateRound);
    else if (round === 'semis') setSemis(updateRound);
    else if (round === 'final') setFinal(m => ({ ...m, winner, winnerFlag: flag }));

    propagateWinner(round, matchId, winner, flag);
  };

  const propagateWinner = (round: string, matchId: string, manualWinner?: string, manualFlag?: string) => {
    // This is a bit complex to do in one go due to state updates being async, 
    // but for a simulation we can derive the next round's teams.
    // In a real app we'd use a more robust state management or useEffects.
    
    // Helper to get winner from current state (might be slightly stale if called immediately after set)
    const getWinner = (m: Match) => manualWinner || m.winner;
    const getFlag = (m: Match) => manualFlag || m.winnerFlag;

    if (round === 'setzens') {
      setVuitens(prev => {
        const newVuitens = [...prev];
        const matchIdx = parseInt(matchId.split('-')[1]);
        const nextMatchIdx = Math.floor(matchIdx / 2);
        const isHome = matchIdx % 2 === 0;
        const winner = getWinner(setzens[matchIdx]);
        const flag = getFlag(setzens[matchIdx]);
        
        if (winner) {
          newVuitens[nextMatchIdx] = { 
            ...newVuitens[nextMatchIdx], 
            [isHome ? 'home' : 'away']: winner,
            [isHome ? 'homeFlag' : 'awayFlag']: flag,
            isLocked: false 
          };
        }
        return newVuitens;
      });
    } else if (round === 'vuitens') {
      setQuarts(prev => {
        const newQuarts = [...prev];
        const matchIdx = parseInt(matchId.split('-')[1]);
        const nextMatchIdx = Math.floor(matchIdx / 2);
        const isHome = matchIdx % 2 === 0;
        const winner = getWinner(vuitens[matchIdx]);
        const flag = getFlag(vuitens[matchIdx]);
        if (winner) {
          newQuarts[nextMatchIdx] = { 
            ...newQuarts[nextMatchIdx], 
            [isHome ? 'home' : 'away']: winner,
            [isHome ? 'homeFlag' : 'awayFlag']: flag,
            isLocked: false 
          };
        }
        return newQuarts;
      });
    } else if (round === 'quarts') {
      setSemis(prev => {
        const newSemis = [...prev];
        const matchIdx = parseInt(matchId.split('-')[1]);
        const nextMatchIdx = Math.floor(matchIdx / 2);
        const isHome = matchIdx % 2 === 0;
        const winner = getWinner(quarts[matchIdx]);
        const flag = getFlag(quarts[matchIdx]);
        if (winner) {
          newSemis[nextMatchIdx] = { 
            ...newSemis[nextMatchIdx], 
            [isHome ? 'home' : 'away']: winner,
            [isHome ? 'homeFlag' : 'awayFlag']: flag,
            isLocked: false 
          };
        }
        return newSemis;
      });
    } else if (round === 'semis') {
      setFinal(prev => {
        const matchIdx = parseInt(matchId.split('-')[1]);
        const isHome = matchIdx % 2 === 0;
        const winner = getWinner(semis[matchIdx]);
        const flag = getFlag(semis[matchIdx]);
        if (winner) {
          return { 
            ...prev, 
            [isHome ? 'home' : 'away']: winner,
            [isHome ? 'homeFlag' : 'awayFlag']: flag,
            isLocked: false 
          };
        }
        return prev;
      });
    }
  };

  const [awards, setAwards] = useState({
    goldenBoot: '',
    silverBoot: '',
    bronzeBoot: '',
    goldenBall: '',
    goldenGlove: '',
    youngPlayer: ''
  });

  const players = ["Mbappé", "Messi", "Haaland", "Vinícius Jr.", "Bellingham", "Pedri", "Lamine Yamal", "Courtois", "Dibu Martínez"];

  const handleFinalize = () => {
    setShowConfirm(true);
  };

  const confirmFinalize = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-blue-deep text-white flex flex-col">
      {/* Header */}
      <header className="bg-brand-blue-mid border-b border-brand-blue-light p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="h-8 w-px bg-brand-blue-light"></div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">Simulació Inicial — Fase Final</h1>
              <p className="text-xs text-brand-text-dim uppercase font-bold tracking-widest">Mundial 2026</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/simulacio-grups')}
              className="px-4 py-2 rounded-lg border border-brand-blue-light text-xs font-bold hover:bg-brand-blue-light transition-all"
            >
              ← Tornar a Grups
            </button>
            <button 
              onClick={handleFinalize}
              className="px-6 py-2 rounded-lg bg-brand-green text-brand-blue-deep text-xs font-black uppercase hover:bg-brand-green-dark transition-all shadow-lg shadow-brand-green/20"
            >
              ✅ Finalitzar Simulació
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6 md:p-10 overflow-x-auto">
        <div className="min-w-[1200px] max-w-7xl mx-auto space-y-20">
          
          {/* Bracket Visual */}
          <div className="grid grid-cols-9 gap-4 items-center">
            
            {/* Setzens Left */}
            <div className="space-y-4">
              <h3 className="text-center text-[10px] font-black text-brand-text-dim uppercase tracking-widest mb-4">Setzens</h3>
              {setzens.slice(0, 8).map(m => <MatchCard key={m.id} match={m} onScoreChange={(side, val) => updateMatch('setzens', m.id, side, val)} onWinnerSelect={(w, f) => selectWinner('setzens', m.id, w, f)} />)}
            </div>

            {/* Vuitens Left */}
            <div className="space-y-16">
              <h3 className="text-center text-[10px] font-black text-brand-text-dim uppercase tracking-widest mb-4">Vuitens</h3>
              {vuitens.slice(0, 4).map(m => <MatchCard key={m.id} match={m} onScoreChange={(side, val) => updateMatch('vuitens', m.id, side, val)} onWinnerSelect={(w, f) => selectWinner('vuitens', m.id, w, f)} />)}
            </div>

            {/* Quarts Left */}
            <div className="space-y-48">
              <h3 className="text-center text-[10px] font-black text-brand-text-dim uppercase tracking-widest mb-4">Quarts</h3>
              {quarts.slice(0, 2).map(m => <MatchCard key={m.id} match={m} onScoreChange={(side, val) => updateMatch('quarts', m.id, side, val)} onWinnerSelect={(w, f) => selectWinner('quarts', m.id, w, f)} />)}
            </div>

            {/* Semis Left */}
            <div className="space-y-96">
              <h3 className="text-center text-[10px] font-black text-brand-text-dim uppercase tracking-widest mb-4">Semis</h3>
              <MatchCard match={semis[0]} onScoreChange={(side, val) => updateMatch('semis', semis[0].id, side, val)} onWinnerSelect={(w, f) => selectWinner('semis', semis[0].id, w, f)} />
            </div>

            {/* Final */}
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="text-center space-y-2">
                <span className="text-4xl">🏆</span>
                <h3 className="text-xl font-black text-brand-gold uppercase tracking-widest">Gran Final</h3>
              </div>
              <div className="w-full scale-125">
                <MatchCard match={final} isFinal onScoreChange={(side, val) => updateMatch('final', final.id, side, val)} onWinnerSelect={(w, f) => selectWinner('final', final.id, w, f)} />
              </div>
              <div className="mt-10 text-center space-y-4">
                <p className="text-xs font-bold text-brand-text-dim uppercase tracking-widest">Campió Mundial 2026</p>
                <div className="bg-brand-gold/10 border border-brand-gold/30 p-4 rounded-2xl">
                  <span className="text-2xl font-black text-brand-gold uppercase">{final.winner || '?'}</span>
                </div>
              </div>
            </div>

            {/* Semis Right */}
            <div className="space-y-96">
              <h3 className="text-center text-[10px] font-black text-brand-text-dim uppercase tracking-widest mb-4">Semis</h3>
              <MatchCard match={semis[1]} onScoreChange={(side, val) => updateMatch('semis', semis[1].id, side, val)} onWinnerSelect={(w, f) => selectWinner('semis', semis[1].id, w, f)} />
            </div>

            {/* Quarts Right */}
            <div className="space-y-48">
              <h3 className="text-center text-[10px] font-black text-brand-text-dim uppercase tracking-widest mb-4">Quarts</h3>
              {quarts.slice(2, 4).map(m => <MatchCard key={m.id} match={m} onScoreChange={(side, val) => updateMatch('quarts', m.id, side, val)} onWinnerSelect={(w, f) => selectWinner('quarts', m.id, w, f)} />)}
            </div>

            {/* Vuitens Right */}
            <div className="space-y-16">
              <h3 className="text-center text-[10px] font-black text-brand-text-dim uppercase tracking-widest mb-4">Vuitens</h3>
              {vuitens.slice(4, 8).map(m => <MatchCard key={m.id} match={m} onScoreChange={(side, val) => updateMatch('vuitens', m.id, side, val)} onWinnerSelect={(w, f) => selectWinner('vuitens', m.id, w, f)} />)}
            </div>

            {/* Setzens Right */}
            <div className="space-y-4">
              <h3 className="text-center text-[10px] font-black text-brand-text-dim uppercase tracking-widest mb-4">Setzens</h3>
              {setzens.slice(8, 16).map(m => <MatchCard key={m.id} match={m} onScoreChange={(side, val) => updateMatch('setzens', m.id, side, val)} onWinnerSelect={(w, f) => selectWinner('setzens', m.id, w, f)} />)}
            </div>

          </div>

          {/* Individual Awards */}
          <section className="max-w-4xl mx-auto bg-brand-blue-mid border border-brand-blue-light rounded-3xl p-10 space-y-10 shadow-2xl">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black uppercase">Premis Individuals</h2>
              <p className="text-brand-text-dim text-sm">Tria els teus favorits per guanyar punts extra</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <AwardSelect 
                label="🥇 Golden Boot (Màxim Golejador)" 
                value={awards.goldenBoot} 
                onChange={(v) => setAwards({...awards, goldenBoot: v})} 
                options={players} 
              />
              <AwardSelect 
                label="🥈 Silver Boot" 
                value={awards.silverBoot} 
                onChange={(v) => setAwards({...awards, silverBoot: v})} 
                options={players} 
              />
              <AwardSelect 
                label="🥉 Bronze Boot" 
                value={awards.bronzeBoot} 
                onChange={(v) => setAwards({...awards, bronzeBoot: v})} 
                options={players} 
              />
              <AwardSelect 
                label="⭐ Golden Ball (Millor Jugador)" 
                value={awards.goldenBall} 
                onChange={(v) => setAwards({...awards, goldenBall: v})} 
                options={players} 
              />
              <AwardSelect 
                label="🧤 Golden Glove (Millor Porter)" 
                value={awards.goldenGlove} 
                onChange={(v) => setAwards({...awards, goldenGlove: v})} 
                options={players} 
              />
              <AwardSelect 
                label="👶 FIFA Young Player Award" 
                value={awards.youngPlayer} 
                onChange={(v) => setAwards({...awards, youngPlayer: v})} 
                options={players} 
              />
            </div>
          </section>

        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-brand-blue-deep/90 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-brand-blue-mid border border-brand-blue-light p-10 rounded-3xl max-w-md w-full text-center space-y-8 shadow-2xl">
            <div className="text-6xl">⚠️</div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase">Segur que vols finalitzar?</h3>
              <p className="text-brand-text-dim text-sm leading-relaxed">
                Un cop finalitzis la simulació inicial, ja no podràs modificar cap resultat. Revisa bé tot el quadre abans de confirmar.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmFinalize}
                className="w-full bg-brand-green text-brand-blue-deep py-4 rounded-xl font-black uppercase hover:bg-brand-green-dark transition-all"
              >
                Sí, finalitzar simulació
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                className="w-full py-4 rounded-xl font-bold text-brand-text-dim hover:text-white transition-all"
              >
                No, vull revisar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="p-10 text-center text-[10px] text-brand-text-dim uppercase tracking-[0.2em] font-bold">
        Porra Pro © 2026 • Simulació de Fase Final
      </footer>
    </div>
  );
};

const MatchCard: React.FC<{ 
  match: Match; 
  isFinal?: boolean;
  onScoreChange: (side: 'home' | 'away', val: string) => void;
  onWinnerSelect: (winner: string, flag: string) => void;
}> = ({ match, isFinal, onScoreChange, onWinnerSelect }) => {
  const isDraw = match.homeScore !== '' && match.awayScore !== '' && match.homeScore === match.awayScore;
  const isCompleted = match.homeScore !== '' && match.awayScore !== '' && (match.homeScore !== match.awayScore || match.winner);

  return (
    <div className={`bg-brand-surface border ${isFinal ? 'border-brand-gold shadow-gold' : 'border-brand-border'} p-4 rounded-xl space-y-3 shadow-lg relative group transition-all ${match.isLocked ? 'opacity-30 grayscale pointer-events-none' : 'hover:scale-105'} ${isCompleted ? 'border-brand-green/50' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">{match.homeFlag}</span>
          <span className={`text-[10px] font-bold truncate uppercase ${match.winner === match.home ? 'text-brand-green' : ''}`}>{match.home}</span>
        </div>
        <input 
          type="number" 
          placeholder="0" 
          value={match.homeScore}
          onChange={(e) => onScoreChange('home', e.target.value)}
          className="w-8 h-8 bg-brand-blue-deep border border-brand-blue-light rounded text-center text-xs font-black outline-none focus:border-brand-green"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">{match.awayFlag}</span>
          <span className={`text-[10px] font-bold truncate uppercase ${match.winner === match.away ? 'text-brand-green' : ''}`}>{match.away}</span>
        </div>
        <input 
          type="number" 
          placeholder="0" 
          value={match.awayScore}
          onChange={(e) => onScoreChange('away', e.target.value)}
          className="w-8 h-8 bg-brand-blue-deep border border-brand-blue-light rounded text-center text-xs font-black outline-none focus:border-brand-green"
        />
      </div>

      {isDraw && !match.winner && (
        <div className="pt-2 border-t border-brand-blue-light animate-fade-in">
          <p className="text-[8px] font-black text-brand-orange uppercase mb-1 text-center">Qui passa?</p>
          <div className="flex gap-1">
            <button 
              onClick={() => onWinnerSelect(match.home, match.homeFlag)}
              className="flex-1 py-1 rounded bg-brand-blue-light text-[8px] font-bold hover:bg-brand-green hover:text-brand-blue-deep transition-all"
            >
              {match.home}
            </button>
            <button 
              onClick={() => onWinnerSelect(match.away, match.awayFlag)}
              className="flex-1 py-1 rounded bg-brand-blue-light text-[8px] font-bold hover:bg-brand-green hover:text-brand-blue-deep transition-all"
            >
              {match.away}
            </button>
          </div>
        </div>
      )}
      
      {match.winner && isDraw && (
        <div className="pt-1 text-center">
          <span className="text-[8px] font-black text-brand-green uppercase">Passa: {match.winner}</span>
        </div>
      )}
    </div>
  );
};

const AwardSelect: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-brand-text-dim uppercase tracking-widest">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-brand-blue-deep border border-brand-blue-light p-4 rounded-xl font-bold text-sm outline-none focus:border-brand-green appearance-none cursor-pointer"
    >
      <option value="">Selecciona jugador...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default SimulacioFinalPage;
