export const COMPETITIONS = [
  { id:'nusantara', name:'Nusantara Premier Series', minTier:1, scope:'domestic' },
  { id:'regional', name:'Piala Kepulauan', minTier:1, scope:'domestic' },
  { id:'continental', name:'Continental Crown', minTier:3, scope:'continental' },
  { id:'circuit', name:'Champions Circuit', minTier:4, scope:'continental' },
  { id:'nations', name:'World Nations Tournament', minTier:1, scope:'national' },
  { id:'honors', name:'Global Football Honors', minTier:3, scope:'individual' },
] as const;
