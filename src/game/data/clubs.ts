import type { Club } from '../types/game';

/** Original fictional clubs. Tiers overlap across regions; salary is annual rupiah. */
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
  { id:'pijar', name:'Akademi Pijar Timur', region:'Malang, Indonesia', tier:1, prestige:22, training:68, difficulty:34, salary:0, youth:98, opportunity:82, colors:['#ECAB3F','#263C4B'], crest:'PT', level:'academy' },
  { id:'tempa', name:'Akademi Tempa Nusantara', region:'Jakarta, Indonesia', tier:1, prestige:36, training:76, difficulty:44, salary:0, youth:93, opportunity:62, colors:['#6F56C3','#F1E8CF'], crest:'TN', level:'academy' },
  { id:'segaraloka', name:'Segaraloka Semarang', region:'Semarang, Indonesia', tier:1, prestige:28, training:51, difficulty:44, salary:195000000, youth:82, opportunity:90, colors:['#1E8796','#ECE4D4'], crest:'SS' },
  { id:'rengganis', name:'Rengganis Sporting', region:'Yogyakarta, Indonesia', tier:1, prestige:34, training:62, difficulty:54, salary:260000000, youth:90, opportunity:74, colors:['#B44853','#F4C779'], crest:'RS' },
  { id:'seruni', name:'Seruni Bandung', region:'Bandung, Indonesia', tier:2, prestige:59, training:76, difficulty:65, salary:950000000, youth:88, opportunity:76, colors:['#214D63','#F0BE53'], crest:'SB' },
  { id:'muara', name:'Muara Batavia', region:'Jakarta, Indonesia', tier:3, prestige:70, training:79, difficulty:74, salary:2100000000, youth:61, opportunity:53, colors:['#126E70','#F0DFC4'], crest:'MB' },
  { id:'teluk', name:'Teluk Rimbun FC', region:'Penang, Malaysia', tier:2, prestige:48, training:64, difficulty:59, salary:1100000000, youth:85, opportunity:84, colors:['#227866','#F2AC4D'], crest:'TR', level:'asia' },
  { id:'saffron', name:'Saffron Harbour', region:'Kobe, Jepang', tier:3, prestige:72, training:84, difficulty:73, salary:4800000000, youth:80, opportunity:63, colors:['#E7AF46','#3B435B'], crest:'SH', level:'asia' },
  { id:'hanul', name:'Hanul Creek', region:'Busan, Korea Selatan', tier:3, prestige:69, training:82, difficulty:71, salary:3800000000, youth:84, opportunity:71, colors:['#5DA8C6','#222F49'], crest:'HC', level:'asia' },
  { id:'meridian', name:'Meridian Vale', region:'York, Inggris', tier:2, prestige:49, training:73, difficulty:63, salary:1600000000, youth:94, opportunity:78, colors:['#B84D54','#D7E2C4'], crest:'MV', level:'europe-development' },
  { id:'brumacosta', name:'Brumacosta FC', region:'Vigo, Spanyol', tier:2, prestige:58, training:79, difficulty:68, salary:2400000000, youth:91, opportunity:72, colors:['#0D7A87','#EDBB56'], crest:'BC', level:'europe-development' },
  { id:'luminara', name:'Luminara Sporting', region:'Bologna, Italia', tier:2, prestige:54, training:75, difficulty:65, salary:2000000000, youth:92, opportunity:76, colors:['#586BA3','#F0D9A9'], crest:'LS', level:'europe-development' },
  { id:'falken', name:'Falkenwerth 61', region:'Bremen, Jerman', tier:2, prestige:60, training:82, difficulty:69, salary:2600000000, youth:96, opportunity:69, colors:['#2E7B66','#EAD8AE'], crest:'F61', level:'europe-development' },
  { id:'cendre', name:'Cendreval Union', region:'Nantes, Prancis', tier:2, prestige:57, training:78, difficulty:66, salary:2300000000, youth:93, opportunity:74, colors:['#875BA1','#F3BD61'], crest:'CU', level:'europe-development' },
  { id:'eisenhafen', name:'Eisenhafen SC', region:'Hamburg, Jerman', tier:4, prestige:93, training:95, difficulty:90, salary:33000000000, youth:82, opportunity:37, colors:['#1D6077','#E6C77D'], crest:'ES', level:'europe-elite' },
  { id:'lumecerf', name:'Lumecerf Athletic', region:'Bordeaux, Prancis', tier:4, prestige:91, training:93, difficulty:88, salary:29000000000, youth:87, opportunity:42, colors:['#9F4566','#EFE1B7'], crest:'LA', level:'europe-elite' },
];

// Branding is procedural: no downloaded badges, real competition marks, or kit replicas.
const symbols=['star','wave','mountain','wing','sun'] as const;
const shapes=['shield','round','diamond'] as const;
CLUBS.forEach((club,index)=>{
  club.country=club.region.split(', ').slice(1).join(', ');
  club.level??=club.id==='cakrawala'?'academy':club.country==='Indonesia'?(club.tier===1?'domestic-lower':'domestic-top'):club.tier===4?'europe-elite':club.tier===3?'europe-mid':'europe-development';
  club.league=club.level==='academy'?'Liga Akademi Nusantara':club.country==='Indonesia'?(club.tier===1?'Divisi Kota Nusantara':'Liga Utama Kepulauan'):club.level==='asia'?'Liga Pelabuhan Asia':club.tier===2?'Liga Pengembangan Eropa':club.tier===3?'Liga Utama Regional':'Liga Mahkota Eropa';
  club.crestShape=shapes[index%shapes.length]; club.symbol=symbols[index%symbols.length];
});
export const HOME_CLUB_ID = 'surya';
export function getClub(id: string): Club { return CLUBS.find(club => club.id === id) ?? CLUBS[0]; }
