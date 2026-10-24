import type { Club } from '../types/game';

/** Tier 1 is a modest local club; tier 4 is an international contender. Salary is annual rupiah. */
export const CLUBS: Club[] = [
  { id:'cakrawala', name:'Cakrawala Junior', region:'Surabaya, Indonesia', tier:1, prestige:12, training:42, difficulty:29, salary:0, youth:95, opportunity:85, colors:['#16764D','#F4EEDB'], crest:'CJ' },
  { id:'surya', name:'Surya Kota FC', region:'Surabaya, Indonesia', tier:1, prestige:30, training:49, difficulty:43, salary:180000000, youth:88, opportunity:88, colors:['#FF6536','#171B26'], crest:'SK' },
  { id:'banyu', name:'Banyu Biru', region:'Malang, Indonesia', tier:1, prestige:25, training:45, difficulty:42, salary:150000000, youth:82, opportunity:91, colors:['#78C8F5','#171B26'], crest:'BB' },
  { id:'meranti', name:'Meranti Athletic', region:'Samarinda, Indonesia', tier:1, prestige:32, training:51, difficulty:45, salary:210000000, youth:75, opportunity:83, colors:['#16764D','#F4C644'], crest:'MA' },
  { id:'garuda', name:'Garuda Selatan', region:'Makassar, Indonesia', tier:2, prestige:48, training:62, difficulty:57, salary:520000000, youth:70, opportunity:72, colors:['#D74136','#F4EEDB'], crest:'GS' },
  { id:'lentera', name:'Lentera United', region:'Bandung, Indonesia', tier:2, prestige:51, training:66, difficulty:60, salary:680000000, youth:78, opportunity:68, colors:['#67459A','#F4EEDB'], crest:'LU' },
  { id:'seabrook', name:'Seabrook Rovers', region:'Bristol, Inggris', tier:2, prestige:53, training:68, difficulty:62, salary:1700000000, youth:73, opportunity:67, colors:['#78C8F5','#F4EEDB'], crest:'SR' },
  { id:'solana', name:'Solana Deportivo', region:'Valencia, Spanyol', tier:2, prestige:55, training:70, difficulty:63, salary:1900000000, youth:84, opportunity:64, colors:['#F4C644','#171B26'], crest:'SD' },
  { id:'arunika', name:'Arunika Jakarta', region:'Jakarta, Indonesia', tier:3, prestige:68, training:77, difficulty:72, salary:1700000000, youth:63, opportunity:57, colors:['#FF6536','#F4EEDB'], crest:'AJ' },
  { id:'portovento', name:'Portovento Calcio', region:'Genoa, Italia', tier:3, prestige:74, training:81, difficulty:76, salary:8400000000, youth:67, opportunity:53, colors:['#16764D','#171B26'], crest:'PC' },
  { id:'rhein', name:'Rheinwald 08', region:'Köln, Jerman', tier:3, prestige:77, training:85, difficulty:77, salary:9600000000, youth:80, opportunity:57, colors:['#D74136','#171B26'], crest:'R8' },
  { id:'belrive', name:'Belrive Olympique', region:'Lyon, Prancis', tier:3, prestige:75, training:83, difficulty:75, salary:9000000000, youth:86, opportunity:60, colors:['#4168A4','#F4EEDB'], crest:'BO' },
  { id:'valente', name:'Valente Real', region:'Lisboa, Portugal', tier:4, prestige:90, training:92, difficulty:87, salary:27000000000, youth:85, opportunity:39, colors:['#16764D','#F4C644'], crest:'VR' },
  { id:'aurora', name:'Vespera Milano', region:'Milano, Italia', tier:4, prestige:94, training:94, difficulty:91, salary:35000000000, youth:68, opportunity:30, colors:['#67459A','#F4C644'], crest:'VM' },
  { id:'northstar', name:'Kestrel Quay', region:'Manchester, Inggris', tier:4, prestige:97, training:97, difficulty:94, salary:43000000000, youth:74, opportunity:27, colors:['#78C8F5','#171B26'], crest:'KQ' },
  { id:'monteluz', name:'Monteluz CF', region:'Madrid, Spanyol', tier:4, prestige:98, training:96, difficulty:95, salary:46000000000, youth:69, opportunity:25, colors:['#F4EEDB','#FF6536'], crest:'MC' },
];

export const HOME_CLUB_ID = 'surya';
export function getClub(id: string): Club { return CLUBS.find(club => club.id === id) ?? CLUBS[0]; }
