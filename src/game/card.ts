import type {CareerState, Ending} from './types/game';
const ink='#171B26',paper='#F4EEDB',green='#16764D',orange='#FF6536';
async function drawRig(x:CanvasRenderingContext2D):Promise<boolean>{
 const source=document.querySelector('#card-player svg');if(!source)return false;
 try{const clone=source.cloneNode(true) as SVGSVGElement;const sourceNodes=[source,...source.querySelectorAll('*')],clonedNodes=[clone,...clone.querySelectorAll('*')];sourceNodes.forEach((el,i)=>{const style=getComputedStyle(el);const target=clonedNodes[i] as SVGElement;for(const property of ['transform','transform-origin','transform-box','opacity']){const value=style.getPropertyValue(property);if(value)target.style.setProperty(property,value);}target.style.setProperty('animation','none');});clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('viewBox','-35 -25 310 400');clone.setAttribute('width','620');clone.setAttribute('height','800');const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml'}));try{const img=new Image();img.src=url;await img.decode();x.drawImage(img,290,210,620,800);return true;}finally{URL.revokeObjectURL(url);}}catch{return false;}
}
export async function createCard(state:CareerState,ending:Ending,clubName:string,rating:number):Promise<Blob>{
 const c=document.createElement('canvas');c.width=1200;c.height=1600;const x=c.getContext('2d');if(!x)throw new Error('Canvas tidak tersedia.');
 x.fillStyle=paper;x.fillRect(0,0,1200,1600);x.fillStyle=green;x.fillRect(35,35,1130,1000);x.save();x.globalAlpha=.1;x.strokeStyle=paper;x.lineWidth=3;for(let i=-1000;i<1800;i+=70){x.beginPath();x.moveTo(i,35);x.lineTo(i+800,1035);x.stroke();}x.restore();
 const text=(s:string,px:number,y:number,size:number,color=ink,weight=800)=>{x.fillStyle=color;x.font=`${weight} ${size}px 'Bricolage', Arial, sans-serif`;x.fillText(s,px,y);};
 text('KICKTALE',75,145,82,paper);text('ARSIP SEBUAH KARIER',80,193,20,paper,500);text(String(rating),910,175,110,'#F4C644');
 // An original paper-cut portrait rendered locally at export resolution.
 if(!await drawRig(x)){x.save();x.translate(600,600);x.fillStyle='#102b29';x.beginPath();x.ellipse(0,360,280,35,0,0,Math.PI*2);x.fill();
 const skin=state.config.appearance.skin;
 x.fillStyle=skin;x.beginPath();x.moveTo(-105,-25);x.lineTo(-185,92);x.lineTo(-258,20);x.lineTo(-285,43);x.lineTo(-187,165);x.quadraticCurveTo(-160,180,-140,150);x.lineTo(-65,42);x.fill();x.beginPath();x.moveTo(105,-25);x.lineTo(185,92);x.lineTo(258,20);x.lineTo(285,43);x.lineTo(187,165);x.quadraticCurveTo(160,180,140,150);x.lineTo(65,42);x.fill();
 x.fillStyle=paper;x.beginPath();x.moveTo(-100,-40);x.lineTo(-150,5);x.lineTo(-113,60);x.lineTo(-83,45);x.lineTo(-78,190);x.lineTo(78,190);x.lineTo(83,45);x.lineTo(113,60);x.lineTo(150,5);x.lineTo(100,-40);x.closePath();x.fill();x.fillStyle=orange;x.fillRect(-30,-40,60,230);x.fillStyle=ink;x.fillRect(-80,190,160,65);x.fillStyle=skin;x.fillRect(-75,255,55,70);x.fillRect(20,255,55,70);x.fillStyle=paper;x.fillRect(-75,302,55,50);x.fillRect(20,302,55,50);x.fillStyle=ink;x.fillRect(-88,345,68,24);x.fillRect(20,345,68,24);
 x.fillStyle=skin;x.fillRect(-27,-96,54,74);x.beginPath();x.ellipse(0,-150,69,86,0,0,Math.PI*2);x.fill();x.fillStyle=ink;x.beginPath();x.ellipse(0,-194,72,51,0,Math.PI,Math.PI*2);x.lineTo(66,-149);x.lineTo(40,-187);x.lineTo(-22,-174);x.lineTo(-65,-145);x.closePath();x.fill();x.fillRect(-35,-158,14,7);x.fillRect(21,-158,14,7);x.strokeStyle=ink;x.lineWidth=5;x.beginPath();x.arc(0,-133,23,.2,Math.PI-.2);x.stroke();x.fillStyle=ink;x.font='bold 60px Arial';x.textAlign='center';x.fillText('10',0,100);x.restore();}
 text(ending.title.toUpperCase(),80,970,Math.min(64,940/(ending.title.length*.6)),paper);text(state.config.name.toUpperCase().slice(0,24),75,1110,Math.min(68,1050/(state.config.name.length*.62)));
 const positions={striker:'PENYERANG',winger:'SAYAP',midfielder:'GELANDANG',defender:'BEK'};
 text(`${positions[state.config.position]}  /  PENSIUN USIA ${state.age}`,80,1155,24,green);text(clubName,80,1196,25,ink,500);
 const stats=[[state.appearances,'LAGA'],[state.goals,'GOL'],[state.assists,'ASIS'],[state.trophies,'TROFI']];stats.forEach(([v,l],i)=>{text(String(v),80+i*280,1320,68);text(String(l),80+i*280,1365,20,green);});
 x.fillStyle=ink;x.fillRect(35,1430,1130,135);text('SATU HIDUP. SATU BOLA.',80,1490,33,paper);text(`SERIBU KEMUNGKINAN.  •  BENIH KARIER ${state.seed}`,80,1532,19,paper,500);
 return await new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(new Error('Gambar gagal dibuat.')),'image/png'));
}
export function downloadCard(blob:Blob,name:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`kicktale-${name.replace(/[^a-z0-9]/gi,'-')}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
