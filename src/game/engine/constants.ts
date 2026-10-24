import type { Attribute, Chapter } from '../types/game';

export const AGE_SCHEDULE = [8,10,11,12,13,14,16,17,18,19,21,22,23,25,27,29,30,33,35,38] as const;
export const ATTRIBUTE_KEYS:Attribute[] = ['technique','pace','fitness','vision','discipline','mentality'];
export const CHAPTERS:{id:Chapter;name:string;number:string;ages:string}[] = [
  {id:'childhood',name:'MIMPI DIMULAI',number:'I',ages:'8–12'},
  {id:'academy',name:'MENEMPA BAKAT',number:'II',ages:'13–17'},
  {id:'professional',name:'MENEMBUS BATAS',number:'III',ages:'18–22'},
  {id:'prime',name:'DI BAWAH SOROTAN',number:'IV',ages:'23–29'},
  {id:'retirement',name:'JEJAK YANG TERTINGGAL',number:'V',ages:'30–38'},
];
export const chapterForAge = (age:number):Chapter => age<13?'childhood':age<18?'academy':age<23?'professional':age<30?'prime':'retirement';
