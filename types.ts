
export type MatchStatus = 'upcoming' | 'live' | 'finished';
export type Phase = 'group' | 'round16' | 'quarter' | 'semi' | 'final';

export interface Match {
  id: number;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  date: string;
  phase: Phase;
  mult: number;
  myPred: string | null;
  realScore?: string;
  liveScore?: string;
  minute?: number;
  pts?: number;
  result?: 'exact' | 'sign' | 'diff' | 'none';
  status: MatchStatus;
}

export interface Player {
  pos: number;
  name: string;
  pts: number;
  exactes: number;
  signe: number;
  variacio: number;
  avatar: string;
  isMe?: boolean;
}

export interface SpecialPrediction {
  id: string;
  label: string;
  pts: number;
  value: string | null;
  options?: string[];
}
