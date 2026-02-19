
import { Match, Player } from './types';

export const PLAYERS: Player[] = [
  { pos: 1, name: "Marc G.", pts: 312, exactes: 8, signe: 31, variacio: 2, avatar: "MG" },
  { pos: 2, name: "Laura P.", pts: 287, exactes: 4, signe: 38, variacio: 0, avatar: "LP" },
  { pos: 3, name: "Jordi T.", pts: 271, exactes: 6, signe: 29, variacio: -1, avatar: "JT" },
  { pos: 4, name: "Anna M.", pts: 258, exactes: 7, signe: 25, variacio: 3, avatar: "AM" },
  { pos: 5, name: "Pau R.", pts: 247, exactes: 3, signe: 36, variacio: 0, avatar: "PR" },
  { pos: 6, name: "Tu", pts: 234, exactes: 6, signe: 27, variacio: 1, avatar: "TU", isMe: true },
  { pos: 7, name: "Marta S.", pts: 219, exactes: 4, signe: 25, variacio: -2, avatar: "MS" },
  { pos: 8, name: "Nil V.", pts: 201, exactes: 9, signe: 18, variacio: 4, avatar: "NV" },
  { pos: 9, name: "Carla F.", pts: 195, exactes: 2, signe: 31, variacio: -1, avatar: "CF" },
  { pos: 10, name: "Àlex B.", pts: 183, exactes: 5, signe: 22, variacio: 0, avatar: "AB" },
];

export const MATCHES: Match[] = [
  { id: 1, home: "Espanya", away: "Brasil", homeFlag: "🇪🇸", awayFlag: "🇧🇷", date: "2026-06-15T21:00", phase: "group", mult: 1.0, myPred: null, status: "upcoming" },
  { id: 2, home: "Alemanya", away: "Japó", homeFlag: "🇩🇪", awayFlag: "🇯🇵", date: "2026-06-15T18:00", phase: "group", mult: 1.0, myPred: "2-1", status: "upcoming" },
  { id: 3, home: "França", away: "Argentina", homeFlag: "🇫🇷", awayFlag: "🇦🇷", date: "2026-06-15T15:00", phase: "group", mult: 1.0, myPred: "1-2", status: "live", liveScore: "1-1", minute: 67 },
  { id: 4, home: "Anglaterra", away: "USA", homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayFlag: "🇺🇸", date: "2026-06-14T21:00", phase: "group", mult: 1.0, myPred: "3-0", realScore: "2-0", pts: 5, result: "sign", status: "finished" },
  { id: 5, home: "Portugal", away: "Marroc", homeFlag: "🇵🇹", awayFlag: "🇲🇦", date: "2026-06-14T18:00", phase: "group", mult: 1.0, myPred: "2-1", realScore: "2-1", pts: 15, result: "exact", status: "finished" },
  { id: 6, home: "Itàlia", away: "Mèxic", homeFlag: "🇮🇹", awayFlag: "🇲🇽", date: "2026-06-16T20:00", phase: "group", mult: 1.0, myPred: null, status: "upcoming" },
];

export const COUNTRIES = [
  "Espanya", "Brasil", "França", "Argentina", "Alemanya", "Anglaterra", "Portugal", "USA", "Marroc", "Japó", "Mèxic", "Itàlia"
];
