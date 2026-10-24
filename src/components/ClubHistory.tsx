import type {CareerState} from '../game/types/game';
import {getClub,getClubHistory} from '../game/engine';
import ClubCrest from './ClubCrest';
export default function ClubHistory({career}:{career:CareerState}){
 const records=getClubHistory(career);
 return <section className="club-history" aria-label="Riwayat klub"><h3 className="journal-subheading">LAMBANG YANG PERNAH KAMU BELA</h3>{records.length?records.map((record,i)=>{const club=getClub(record.clubId);return <article className="club-history-row" key={`${record.clubId}-${i}`}><ClubCrest club={club} size={39}/><div><h4>{club.name}</h4><span>Usia {record.fromAge}–{record.toAge-1} · {record.years} musim · {record.role}</span><p>{record.appearances} laga · {career.config.position==='defender'?`${record.defensive} aksi bertahan`:`${record.goals} gol`} · {record.assists} asis · {record.trophies} trofi</p></div></article>;}):<p className="club-history-empty">Catatan profesionalmu akan dimulai bersama kontrak pertama. Untuk sekarang, seragam akademi menyimpan mimpi yang sama besarnya.</p>}</section>;
}
