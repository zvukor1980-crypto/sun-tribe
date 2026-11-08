'use strict';
// ===== Sun Tribe — main engine =====
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const SAVE_KEY='suntribe_v1';
let S=null, lastSave=0;
const now=()=>Date.now();

// ---------- i18n ----------
function t(k,v){ let s=(L[S?S.lang:'ru']||L.ru)[k]; if(s==null) s=L.en[k]; if(s==null) s=k;
 if(v) for(const x in v) s=s.split('{'+x+'}').join(v[x]); return s; }
function fmt(n){ n=Math.floor(n); if(n<1000) return ''+n; const u=['K','M','B','T','Q'];
 let i=-1; while(n>=1000&&i<u.length-1){n/=1000;i++;} return String(n>=100?Math.floor(n):n>=10?n.toFixed(1):n.toFixed(2)).replace(/\.0+$/,'')+u[i]; }
function ftime(sec){ sec=Math.max(0,Math.ceil(sec)); const h=Math.floor(sec/3600), m=Math.floor(sec%3600/60), s=sec%60;
 if(h>0) return h+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); return m+':'+String(s).padStart(2,'0'); }
const hname=k=>t('h_'+k), bname=k=>t('b_'+k);
function costStr(c){ return Object.entries(c).filter(([k,v])=>v>0).map(([k,v])=>`<span class="cs${(S.r[k]||0)>=v?'':' no'}">${RI[k]}${fmt(v)}</span>`).join(' '); }

// ---------- state ----------
const STATS0={coll:0,builds:0,colors:0,logins:0,chests:0,petals:0,moved:0,collall:0,wear:0,parade:0};
function newState(lang){
 return {v:2,lang:lang||'ru',started:false,leader:null,mv:.6,sv:.8,vib:true,
  r:{coins:150,wood:40,stone:0,food:30,gems:20,tickets:0,books:0,shards:0,petals:0},
  xp:0,lv:1,b:[],nid:1,h:{},builders:1,exps:[],reg:{home:true},far:0,q:0,qc:0,qn:0,
  gift:0,tfree:0,last:now(),era:1,seenTut:0,tut:0,stats:Object.assign({},STATS0),
  decor:[],dinv:{},daily:{day:null,streak:0},chest:0,ach:{},dt:{day:null,list:[],prog:[],done:[],all:false}};
}
function migrate(o){ const D=newState(o.lang); const n=Object.assign(newState(o.lang),o);
 n.r=Object.assign({},D.r,o.r||{}); for(const k in n.r) if(!Number.isFinite(n.r[k])) n.r[k]=D.r[k]||0;
 n.stats=Object.assign({},STATS0,o.stats||{}); for(const k in n.stats) if(!Number.isFinite(n.stats[k])) n.stats[k]=0;
 n.daily=Object.assign({},D.daily,o.daily||{}); n.dt=Object.assign({},D.dt,o.dt||{}); for(const k of ['b','decor']) if(!Array.isArray(n[k])) n[k]=[];
 for(const k of ['dinv','ach','reg','h']) if(!n[k]||typeof n[k]!=='object') n[k]=D[k];
 if(o.v===1){ n.exps=o.exp?[o.exp]:[]; delete n.exp; n.q=o.q<OLDQ.length?OLDQ[o.q]:QUESTS.length; n.chest=0; n.tut=9;
  n.stats.builds=(o.b||[]).reduce((a,b)=>a+(b.lvl||0),0); }
 if(!Array.isArray(n.exps)) n.exps=[];
 n.b.forEach(b=>{ if(b.flip==null) b.flip=false; });
 for(const k in n.h){ const s=n.h[k]; if(!OUT[k]||!s||typeof s!=='object'){delete n.h[k];continue;} s.sk=Object.assign({res:0,build:0,charm:0},s.sk||{}); if(!s.hue) s.hue={}; if(!Array.isArray(s.owned)) s.owned=['base']; s.owned=s.owned.filter(id=>OUT[k]&&OUT[k].some(x=>x.id===id)); if(!s.owned.includes('base')) s.owned.unshift('base'); if(!OUT[k].some(x=>x.id===s.o)) s.o='base'; }
 if(n.started&&!n.h[n.leader]) n.leader=Object.keys(n.h)[0]||null;
 n.v=2; return n; }
let saveWarningAt=0;
function save(){ if(!S) return false; const stamp=now(), previous=S.last; S.last=stamp;
 try{ localStorage.setItem(SAVE_KEY,JSON.stringify(S)); lastSave=stamp; return true; }
 catch(e){ S.last=previous; if(stamp-saveWarningAt>60000){ saveWarningAt=stamp; toast(S.lang==='ru'?'Не удалось сохранить игру. Освободи место на устройстве и не закрывай игру.':S.lang==='he'?'השמירה נכשלה. פנו מקום ואל תסגרו את המשחק.':'Could not save. Free some storage and keep the game open.','bad'); } return false; } }
function load(){ try{ const j=localStorage.getItem(SAVE_KEY); if(j){ const o=JSON.parse(j); if(o&&(o.v===1||o.v===2)) return migrate(o); } }catch(e){} return null; }

// ---------- derived ----------
const hallB=()=>S.b.find(b=>b.type==='hall');
const hallLvl=()=>{const h=hallB(); return h?h.lvl:1;};
function eraOf(h){ return Math.min(ERAS,1+Math.floor((Math.max(1,h)-1)/3)); }
function eraName(e){ return t('era'+Math.min(ERAS,Math.max(1,e))); }
function tier(b){ const e=eraOf(hallLvl()); if(b.type==='hall') return e; return Math.max(1,Math.min(e,Math.max(e-1,1+Math.floor((Math.max(1,b.lvl)-1)/3)))); }
function bimg(type,tr){ return 'a/b/'+type+'_'+tr+'.webp'; }
function exploredCount(){ return REG.filter(r=>r.k!=='home'&&S.reg[r.k]).length + S.far; }
function plotsOpen(){ return Math.min(PLOTS.length, BASE_PLOTS+2*REG.filter(r=>r.k!=='home'&&S.reg[r.k]).length); }
const xpNeed=L=>Math.round(100*Math.pow(1.18,L));
const owned=()=>HER.filter(h=>S.h[h.k]);
const H=k=>HER.find(h=>h.k===k);
function wornFx(k){ const o=outfitOf(k); return o.th?TH_FX[o.th]:{}; }
function fxSum(kind){ let v=0; owned().forEach(h=>{ v+=wornFx(h.k)[kind]||0; }); return v; }
function perk(kind){ let v=0; owned().forEach(h=>{ if(h.perk===kind){ const s=S.h[h.k]; v+=h.pv*(1+0.03*(s.lvl-1))*Math.pow(1.15,s.stars-1);} });
 if(kind==='build'||kind==='exp'||kind==='loot') v+=fxSum(kind);
 return Math.min(kind==='loot'?200:60,v); }
function setMult(k){ const n=S.h[k].owned.length; return n>=OUT[k].length?1.15:n>=3?1.05:1; }
function parade(){ const c={}; owned().forEach(h=>{ const th=outfitOf(h.k).th; if(th) c[th]=(c[th]||0)+1; }); let best=null; for(const th in c) if(c[th]>=3&&(!best||c[th]>c[best])) best=th; return best; }
function dayNum(){ const d=new Date(); return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/86400000); }
function todayEv(){ return EVENTS[dayNum()%EVENTS.length]; }
function decorHap(){ let v=0; S.decor.forEach(d=>{ const D=DECOR.find(x=>x.k===d.k); if(D) v+=D.hap; }); return v; }
function totalOutfits(){ let n=0; owned().forEach(h=>n+=S.h[h.k].owned.length-1); return n; }
function skillSum(br){ let v=0; owned().forEach(h=>v+=S.h[h.k].sk[br]); return v; }
function charm(){ let c=0; owned().forEach(h=>{ const s=S.h[h.k]; const o=OUT[h.k].find(o=>o.id===s.o)||OUT[h.k][0];
  c+=o.ch+(s.owned.length-1)*2+s.sk.charm*3+(s.hue&&s.hue[s.o]!=null?1:0)+s.stars+(s.owned.length>=OUT[h.k].length?5:0); }); return Math.round(c*(1+perk('charm')/100)); }
const happiness=()=>Math.min(80,Math.min(50,charm()*0.5)+decorHap()+fxSum('hap')+(todayEv().hap||0));
function heroBonus(k){ const h=H(k), s=S.h[k]; return (h.base+0.5*(s.lvl-1))*Math.pow(1.25,s.stars-1)*(1+0.02*s.sk.res)*(1+(wornFx(k).res||0)/100)*setMult(k); }
function teamOf(b){ return owned().filter(h=>S.h[h.k].at===b.id).map(h=>h.k); }
function slotsOf(b){ return Math.min(3,1+Math.floor(b.lvl/5)); }
function heroInB(k,b){ const h=H(k); const m=(h.res==='all'||h.res===BLD[b.type].res)?1:0.5; return heroBonus(k)*m; }
function bonusOf(b){ const tm=teamOf(b); let v=0; tm.forEach(k=>v+=heroInB(k,b));
 SYNERGY.forEach(([a,c])=>{ if(tm.includes(a)&&tm.includes(c)) v+=5; });
 v+=happiness(); const res=BLD[b.type].res;
 REG.forEach(r=>{ if(r.k!=='home'&&S.reg[r.k]&&(r.bon===res||r.bon==='all')) v+=5; });
 if(parade()) v+=10;
 return v; }
function rate(b){ const ev=todayEv(); return BLD[b.type].rate*Math.pow(1.3,Math.max(0,b.lvl-1))*(1+bonusOf(b)/100)*(ev.res===BLD[b.type].res?ev.m:1); } // per minute
function capOf(b){ return Math.max(rate(b)*120, BLD[b.type].rate<0.1?2:10); }
function stored(b){ if(b.bt) return 0; return Math.min(capOf(b), rate(b)*(now()-b.t0)/60000); }
function bCost(type,L){ const base=BLD[type].cost, m=Math.pow(1.42,L-1)*(1-perk('cost')/100), o={};
 for(const k in base){ if(type==='hall'&&k==='stone'&&L<3) continue; o[k]=Math.ceil(base[k]*m); }
 if(L>=8) o.books=Math.ceil((L-6)*1.5); return o; }
function bTime(type,L){ return Math.max(3,Math.min(21600,BLD[type].time*Math.pow(1.3,L-1))*(1-Math.min(70,perk('build')+skillSum('build')*1.5)/100)*(1-(todayEv().build||0))); }
function hasRes(c){ for(const k in c){ if(k==='hall'){ if(hallLvl()<c[k]) return false; continue; } if((S.r[k]||0)<c[k]) return false; } return true; }
function pay(c){ for(const k in c){ if(k!=='hall') S.r[k]-=c[k]; } }
function give(c,mult=1){ for(const k in c){ if(k==='xp') addXP(c[k]); else if(k==='builder') S.builders=2; else { const v=Math.floor(c[k]*mult); S.r[k]=(S.r[k]||0)+v; if(k==='petals') S.stats.petals+=v; } } }
function busyBuilders(){ return S.b.filter(b=>b.bt).length; }
function countType(type){ return S.b.filter(b=>b.type===type).length; }
function maxLvl(b){ return b.type==='hall'?Infinity:hallLvl()*2; }

// ---------- feedback ----------
const IOS=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const CANVIB=('vibrate' in navigator)&&!IOS;
function vib(ms=12){ if(CANVIB&&S&&S.vib) try{navigator.vibrate(ms);}catch(e){} }
const RSFX={coins:'coin',wood:'wood',stone:'stone',food:'food',gems:'gems',books:'books',shards:'shards',tickets:'tickets',petals:'sparkle'};
function screenPos(el){ const r=el.getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2]; }
function flyRes(from,res,n){ const tgt=$('.rp[data-r='+res+']')||$('#hlv'); if(!tgt) return; const [tx,ty]=screenPos(tgt); const app=$('#app');
 for(let i=0;i<Math.min(8,Math.max(3,n));i++){ const d=document.createElement('div'); d.className='fly'; d.textContent=RI[res];
  const sx=from[0]+(Math.random()-.5)*60, sy=from[1]+(Math.random()-.5)*40; d.style.left=sx+'px'; d.style.top=sy+'px'; app.appendChild(d);
  setTimeout(()=>{ d.style.transform=`translate(${tx-sx}px,${ty-sy}px) scale(.6)`; d.style.opacity='.4'; },30+i*55);
  setTimeout(()=>{ d.remove(); tgt.classList.remove('pop'); void tgt.offsetWidth; tgt.classList.add('pop'); },650+i*55); } }
function bldPop(b){ const d=document.getElementById('b'+b.id); if(!d) return; d.classList.remove('popb'); void d.offsetWidth; d.classList.add('popb'); }
function confetti(n=60){ const app=$('#app'), cols=['#ff4fb4','#ffd54a','#7ee36a','#4fc3f7','#b388ff','#ff8a65'];
 for(let i=0;i<n;i++){ const d=document.createElement('i'); d.className='conf'; d.style.left=(Math.random()*100)+'%'; d.style.background=cols[i%cols.length];
  d.style.animationDelay=(Math.random()*.6)+'s'; d.style.animationDuration=(1.6+Math.random()*1.4)+'s'; d.style.setProperty('--r',(Math.random()*720-360)+'deg'); d.style.setProperty('--x',(Math.random()*120-60)+'px');
  app.appendChild(d); setTimeout(()=>d.remove(),3400); } }
function sfx(n){ Audio2.play(n); }
function toast(msg,cls=''){ const d=document.createElement('div'); d.className='toast '+cls; d.innerHTML=msg; $('#toasts').appendChild(d);
 setTimeout(()=>d.classList.add('out'),2300); setTimeout(()=>d.remove(),2800); }
function floatAt(b,txt){ const p=PLOTS[b.plot]; const d=document.createElement('div'); d.className='floaty'; d.textContent=txt;
 d.style.left=p[0]+'px'; d.style.top=(p[1]-120)+'px'; $('#world').appendChild(d); setTimeout(()=>d.remove(),1300); }

// ---------- XP / levels ----------
function addXP(n){ n=Math.round(n*(1+perk('xp')/100)); S.xp+=n;
 while(S.xp>=xpNeed(S.lv)){ S.xp-=xpNeed(S.lv); S.lv++; const g=3+S.lv; S.r.gems+=g; S.r.coins+=50*S.lv;
  celebrate('🎉 '+t('levelup'), t('level')+' '+S.lv, `${RI.gems}+${g} ${RI.coins}+${50*S.lv}`); sfx('levelup'); }
}
function celebrate(title,big,sub,img){ const d=document.createElement('div'); d.className='celebrate';
 d.innerHTML=`<div class="rays"></div><div class="cbox">${img?`<img src="${img}">`:''}<div class="ct">${title}</div><div class="cb">${big}</div><div class="cs2">${sub||''}</div><button class="btn g">OK</button></div>`;
 d.onclick=()=>{ d.remove(); sfx('tap'); }; $('#app').appendChild(d); vib(30); confetti(); }

// ---------- buildings ----------
function startBuild(plot,type){ const c=bCost(type,1);
 if(busyBuilders()>=S.builders){ toast(t('busy'),'bad'); sfx('error'); return false; }
 if(!hasRes(c)){ toast(t('nores'),'bad'); sfx('error'); return false; }
 pay(c); const b={id:S.nid++,type,lvl:0,plot,flip:false,t0:now(),bt:{end:now()+bTime(type,1)*1000,total:bTime(type,1)*1000,to:1}};
 S.b.push(b); sfx('build'); vib(); dEvent('upg',1); hidePointer(); renderVillage(); bldPop(b); updHUD(); save(); return true; }
function startUpgrade(b){ const L=b.lvl+1, c=bCost(b.type,L);
 if(b.type==='hall'&&S.lv<b.lvl){ toast(t('needlvl',{n:b.lvl}),'bad'); sfx('error'); return; }
 if(L>maxLvl(b)){ toast(t('needhall',{n:Math.ceil(L/2)}),'bad'); sfx('error'); return; }
 if(busyBuilders()>=S.builders){ toast(t('busy'),'bad'); sfx('error'); return; }
 if(!hasRes(c)){ toast(t('nores'),'bad'); sfx('error'); return; }
 collect(b,true); pay(c); const tm=bTime(b.type,L)*1000; b.bt={end:now()+tm,total:tm,to:L}; sfx('build'); vib(); dEvent('upg',1);
 closeModal(); renderVillage(); bldPop(b); updHUD(); save(); }
function finishBuild(b,quiet){ const oldEra=eraOf(hallLvl()); const first=b.lvl===0; b.lvl=b.bt.to; b.bt=null; b.t0=now(); S.stats.builds++;
 addXP(10*b.lvl+(b.type==='hall'?30*b.lvl:0));
 if(!quiet){ sfx(first?'done':'upgrade'); floatAt(b,'✓ '+t('done')); }
 const ne=eraOf(hallLvl()); if(ne>oldEra){ S.era=ne;
  setTimeout(()=>{ celebrate('🌅 '+t('newera'), eraName(ne), t('newera_s'), bimg('hall',ne)); sfx('fanfare'); musicFor(curModal); },quiet?500:300); }
 renderVillage(); if(!quiet) bldPop(b);
 if(!S.tut||S.tut<2){ if(b.type!=='hall'&&first){ S.tut=2; setTimeout(()=>tutor(t('tut2')),900); } }
 if(b.type==='tavern'&&first&&S.tut<4){ S.tut=4; setTimeout(()=>tutor(t('tut4')),900); } }
function speedCost(b){ const rem=(b.bt.end-now())/1000; return rem<30?0:Math.ceil(rem/120); }
function speedUp(b){ const c=speedCost(b); if(S.r.gems<c){ toast(t('nores'),'bad'); sfx('error'); return; }
 S.r.gems-=c; b.bt.end=now(); finishBuild(b); closeModal(); updHUD(); save(); }
function collect(b,silent,fly){ const st=stored(b); const n=Math.floor(st); if(n<1) return 0; const res=BLD[b.type].res;
 const r=rate(b); const cap=capOf(b);
 b.t0 = st>=cap ? now() : now()-((st-n)/r)*60000;
 S.r[res]+=n; S.stats.coll++; questEvent('collect',res,n); dEvent('coll',1);
 if(!silent||fly){ const el=document.getElementById('b'+b.id); if(el) flyRes(screenPos(el),res,n); bldPop(b); }
 if(!silent){ sfx(RSFX[res]||'collect'); vib(8); floatAt(b,'+'+fmt(n)+' '+RI[res]); addXP(1); }
 return n; }
function collectAll(){ const sum={}; let any=0;
 S.b.forEach(b=>{ if(b.bt) return; const n=collect(b,true,true); if(n>0){ const res=BLD[b.type].res; sum[res]=(sum[res]||0)+n; any++; floatAt(b,'+'+fmt(n)+' '+RI[res]); } });
 if(!any){ toast(t('nothing')); sfx('error'); return; }
 S.stats.collall++; dEvent('collall',1); addXP(any); sfx('collect'); setTimeout(()=>sfx('coin'),150); vib(15);
 toast('🧺 '+t('collall_n',{s:rwStr(sum)}),'good'); hidePointer(); updHUD(); updQuest(); updVillage(); save(); }

// ---------- heroines ----------
function newHero(k){ const h=H(k); S.h[k]={lvl:1,xp:0,stars:h.st||1,o:'base',owned:['base'],hue:{},sk:{res:0,build:0,charm:0},sp:0,at:null}; }
function heroCap(k){ const s=S.h[k]; return s.stars>=5?Infinity:30*s.stars; }
function lvlCost(k){ const L=S.h[k].lvl; return {coins:Math.ceil(200*Math.pow(1.2,L)),food:Math.ceil(20*Math.pow(1.15,L)),books:L<5?0:Math.ceil(L/3)}; }
const STARN=[10,20,30,50,80];
function heroLevelUp(k){ const s=S.h[k], c=lvlCost(k);
 if(s.xp<xpNeed(s.lvl)||s.lvl>=heroCap(k)||!hasRes(c)){ sfx('error'); toast(t('nores'),'bad'); return; }
 pay(c); s.xp-=xpNeed(s.lvl); s.lvl++; s.sp++; sfx('levelup'); vib(25); addXP(15); toast('✨ '+hname(k)+' → '+t('lvl')+' '+s.lvl,'good'); save(); }
function heroTrain(k){ const s=S.h[k], c={food:Math.ceil(15*Math.pow(1.12,s.lvl))};
 if(!hasRes(c)){ sfx('error'); toast(t('nores'),'bad'); return; } pay(c); s.xp+=Math.ceil(xpNeed(s.lvl)/4); sfx('sparkle'); dEvent('train',1); save(); }
function heroStar(k){ const s=S.h[k]; if(s.stars>=5) return; const n=STARN[s.stars-1];
 if(S.r.shards<n){ sfx('error'); toast(t('nores'),'bad'); return; } S.r.shards-=n; s.stars++; sfx('levelup'); vib(30);
 celebrate('★',hname(k),'★'.repeat(s.stars),faceImg(k)); save(); }
function faceImg(k){ return 'a/h/face_'+k+'.webp'; }
function assign(k,bid){ const s=S.h[k]; if(bid!=null){ const b=S.b.find(x=>x.id===bid); if(!b) return;
  const tm=teamOf(b).filter(x=>x!==k); if(tm.length>=slotsOf(b)) { S.h[tm[tm.length-1]].at=null; } }
 // freeze current stored amounts before changing rates
 S.b.forEach(b=>{ if(!b.bt){ const st=stored(b); b._st=st; } });
 s.at=bid;
 S.b.forEach(b=>{ if(!b.bt){ const r=rate(b); b.t0=now()-(b._st/r)*60000; delete b._st; } });
 sfx('tap'); save(); }
function autoAssign(){ S.b.forEach(b=>{ if(!b.bt){ b._st=stored(b);} });
 owned().forEach(h=>S.h[h.k].at=null);
 const hs=owned().slice().sort((a,b)=>heroBonus(b.k)-heroBonus(a.k));
 const bs=S.b.filter(b=>b.lvl>0).sort((a,b)=>BLD[b.type].rate*Math.pow(1.3,b.lvl)*(b.type==='hall'?1:1)-BLD[a.type].rate*Math.pow(1.3,a.lvl));
 const free=b=>teamOf(b).length<slotsOf(b);
 hs.forEach(h=>{ let tgt=bs.find(b=>free(b)&&(h.res==='all'||BLD[b.type].res===h.res)); if(!tgt) tgt=bs.find(free); if(tgt) S.h[h.k].at=tgt.id; });
 S.b.forEach(b=>{ if(!b.bt&&b._st!=null){ b.t0=now()-(b._st/rate(b))*60000; delete b._st;} });
 sfx('sparkle'); save(); }

// ---------- outfits / recolor ----------
const rcCache={}, imgCache={};
function loadImg(src){ if(imgCache[src]) return imgCache[src]; return imgCache[src]=new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src; }); }
function rgb2hsv(r,g,b){ const mx=Math.max(r,g,b), mn=Math.min(r,g,b), d=mx-mn; let h=0;
 if(d){ if(mx===r) h=((g-b)/d)%6; else if(mx===g) h=(b-r)/d+2; else h=(r-g)/d+4; h/=6; if(h<0) h+=1; } return [h,mx?d/mx:0,mx]; }
function hsv2rgb(h,s,v){ const i=Math.floor(h*6), f=h*6-i, p=v*(1-s), q=v*(1-f*s), u=v*(1-(1-f)*s);
 switch(((i%6)+6)%6){case 0:return[v,u,p];case 1:return[q,v,p];case 2:return[p,v,u];case 3:return[p,q,v];case 4:return[u,p,v];default:return[v,p,q];} }
async function recolored(src,mask,hue){ const key=src+'|'+hue; if(rcCache[key]) return rcCache[key];
 const center=MASKH[mask]; if(center==null) return src;
 const [im,mk]=await Promise.all([loadImg(src),loadImg('a/m/'+mask+'.png')]);
 const w=im.naturalWidth,h=im.naturalHeight, c=document.createElement('canvas'); c.width=w; c.height=h; const x=c.getContext('2d');
 x.drawImage(mk,0,0,w,h); const md=x.getImageData(0,0,w,h).data; x.clearRect(0,0,w,h); x.drawImage(im,0,0); const id=x.getImageData(0,0,w,h), d=id.data;
 const dh=(hue-center)/360;
 for(let i=0;i<d.length;i+=4){ const m=md[i]/255; if(m<0.03) continue;
  const [hh,ss,vv]=rgb2hsv(d[i]/255,d[i+1]/255,d[i+2]/255); let nh=hh+dh; nh-=Math.floor(nh);
  let ns=ss; if(hue===0||hue===330) ns=Math.min(1,ss*1.05);
  const [r,g,b]=hsv2rgb(nh,ns,vv); d[i]=d[i]*(1-m)+r*255*m; d[i+1]=d[i+1]*(1-m)+g*255*m; d[i+2]=d[i+2]*(1-m)+b*255*m; }
 x.putImageData(id,0,0);
 const url=await new Promise(res=>c.toBlob(bl=>res(bl?URL.createObjectURL(bl):c.toDataURL('image/png')),'image/png'));
 return rcCache[key]=url; }
function outfitOf(k,oid){ return OUT[k].find(o=>o.id===(oid||(S.h[k]&&S.h[k].o)))||OUT[k][0]; }
function setHeroImg(el,k,oid){ const o=outfitOf(k,oid), s=S.h[k]; el.src=o.img; const hue=s&&s.hue?s.hue[o.id]:null;
 if(hue!=null&&o.m&&MASKH[o.m]!=null){ const tok=Math.random(); el.dataset.tok=tok; recolored(o.img,o.m,hue).then(u=>{ if(el.dataset.tok==tok) el.src=u; }).catch(()=>{}); } }

// ---------- quests ----------
function curQuest(){ return S.q<QUESTS.length?QUESTS[S.q]:genQuest(S.q); }
function questText(q){ const [ty,a,n]=q.g; let an=a;
 if(ty==='build'||ty==='upgrade') an=bname(a); if(ty==='collect') an=RI[a];
 if(ty==='build'&&n>1) return t('q_build',{a:an})+' ×'+n;
 return t('q_'+ty,{a:an,n:fmt(n)}); }
function questProg(q){ const [ty,a,n]=q.g; let v=0;
 switch(ty){ case 'build': v=S.b.filter(b=>b.type===a&&b.lvl>=1).length; break;
  case 'collect': case 'color': case 'outfit': v=S.qc; break;
  case 'assign': v=owned().filter(h=>S.h[h.k].at!=null).length; break;
  case 'upgrade': v=Math.max(0,...S.b.filter(b=>b.type===a).map(b=>b.lvl)); break;
  case 'own': v=owned().length; break;
  case 'herolvl': v=Math.max(0,...owned().map(h=>S.h[h.k].lvl)); break;
  case 'herostar': v=Math.max(0,...owned().map(h=>S.h[h.k].stars)); break;
  case 'explore': v=exploredCount(); break;
  case 'bldlvl': v=Math.max(0,...S.b.filter(b=>b.type!=='hall').map(b=>b.lvl)); break;
  case 'daily': v=S.stats.logins; break; case 'collall': v=S.stats.collall; break; case 'decor': v=S.decor.length; break;
  case 'move': v=S.stats.moved; break; case 'chest': v=S.stats.chests; break; case 'outfits': v=totalOutfits(); break;
  case 'ach': v=Object.keys(S.ach).length; break; }
 return [Math.min(v,n),n]; }
function questEvent(ty,a,n){ const q=curQuest(); if(q.g[0]===ty&&(q.g[1]==null||q.g[1]===a)) S.qc+=n; }
function claimQuest(){ const q=curQuest(), [v,n]=questProg(q); if(v<n) return; give(q.r); S.q++; S.qc=0; sfx('quest'); vib(20); confetti(25);
 if(S.q>=5&&S.tut<3){ S.tut=3; setTimeout(()=>tutor(t('tut3')),700); }
 toast('🏆 '+t('qdone')+' '+rwStr(q.r),'good'); save(); updQuest(); updHUD(); if(curModal==='quests') openQuests(); }
function rwStr(r){ return Object.entries(r).map(([k,v])=>(RI[k]||'')+'+'+fmt(v)).join(' '); }

// ---------- map / expeditions ----------
const towerLvl=()=>{ const tw=S.b.find(b=>b.type==='tower'); return tw?tw.lvl:0; };
const expSlots=()=>Math.min(3,1+Math.floor(towerLvl()/4));
const expOf=k=>S.exps.find(e=>e.k===k);
function regState(r){ if(S.reg[r.k]) return 'done'; if(expOf(r.k)) return 'going';
 return (r.tw===0||towerLvl()>=r.tw)?'open':'locked'; }
function farReg(){ const n=S.far; return {k:'far',tw:12+n,food:Math.round(30000*Math.pow(1.35,n)),min:Math.round(180+30*n),rw:{gems:100+20*n,shards:40+8*n,books:20+5*n,tickets:2}}; }
function expTime(r){ return r.min*60*(1-perk('exp')/100)*(1-(todayEv().exp||0)); }
function startExp(r){ if(expOf(r.k)){ toast(t('exploring'),'bad'); sfx('error'); return; }
 if(S.exps.length>=expSlots()){ toast(t('noslot'),'bad'); sfx('error'); return; }
 if(r.tw&&towerLvl()<r.tw){ toast(t('needtower',{n:r.tw}),'bad'); sfx('error'); return; }
 if(S.r.food<r.food){ toast(t('nores'),'bad'); sfx('error'); return; }
 S.r.food-=r.food; const tm=expTime(r)*1000; S.exps.push({k:r.k,end:now()+tm,total:tm}); dEvent('exp',1); sfx('whoosh'); vib(); save(); openMap(r.k); }
function finishExp(e,quiet){ const k=e.k; const r=k==='far'?farReg():REG.find(x=>x.k===k); S.exps=S.exps.filter(x=>x!==e);
 if(!r) return; const mult=1+perk('loot')/100; give(r.rw,mult); addXP(50+r.min*3);
 if(k==='far') S.far++; else S.reg[k]=true;
 if(!quiet) setTimeout(()=>{ celebrate('🗺️ '+t('explored'), k==='far'?t('endless')+' #'+S.far:t('g_reg_'+k), rwStr(Object.fromEntries(Object.entries(r.rw).map(([a,b])=>[a,Math.floor(b*mult)])))+(k!=='far'?'<br>'+t('plots'):'')); sfx('fanfare'); },100);
 renderVillage(); save(); }

// ---------- daily / chest / events / achievements ----------
function dailyReady(){ return S.daily.day!==dayNum(); }
function dailyIdx(){ const d=dayNum(); const st=S.daily.day===d-1?S.daily.streak+1:S.daily.day===d?S.daily.streak:1; return {st,idx:(st-1)%7}; }
function dailyGift(i){ const g=Object.assign({},LOGIN[i]), m=1+0.5*(hallLvl()-1); ['coins','wood','food'].forEach(k=>{ if(g[k]) g[k]=Math.round(g[k]*m); }); return g; }
function claimDaily(){ if(!dailyReady()) return; const {st,idx}=dailyIdx(); const g=dailyGift(idx); give(g); S.daily={day:dayNum(),streak:st}; S.stats.logins++;
 sfx('chest'); vib(25); confetti(40); toast('🎁 '+rwStr(g),'good'); updHUD(); updQuest(); save(); }
function chestGift(){ const h=hallLvl(); const g={coins:150*h,food:100*h,gems:5+Math.floor(Math.random()*11),petals:10};
 const r=Math.random(); if(r<0.25) g.shards=5; else if(r<0.4) g.tickets=1; else if(r<0.6) g.books=3; return g; }
function openChest(){ if(now()<S.chest){ toast('📦 '+t('chest_in',{t:ftime((S.chest-now())/1000)})); sfx('error'); return; }
 const g=chestGift(); give(g); S.chest=now()+24*3600e3; S.stats.chests++; sfx('chest'); vib(25); hidePointer();
 celebrate('📦 '+t('chest'),rwStr(g),'',null); updHUD(); updQuest(); save(); updSide(); }
function dtEnsure(){ const d=dayNum(); if(S.dt.day===d) return; let seed=d*9301+49297; const rnd=()=>{ seed=(seed*9301+49297)%233280; return seed/233280; };
 const pool=DTASKS.slice(), list=[]; while(list.length<3){ const i=Math.floor(rnd()*pool.length); list.push(pool.splice(i,1)[0].k); }
 S.dt={day:d,list,prog:[0,0,0],done:[false,false,false],all:false}; }
function dEvent(k,n){ if(!S||!S.started) return; dtEnsure(); S.dt.list.forEach((x,i)=>{ if(x===k) S.dt.prog[i]+=n; }); }
const dtDef=k=>DTASKS.find(x=>x.k===k);
function dtClaim(i){ const T=dtDef(S.dt.list[i]); if(S.dt.done[i]||S.dt.prog[i]<T.n) return; S.dt.done[i]=true; const g={petals:15,coins:100*hallLvl()}; give(g); sfx('quest'); toast('🌸 '+rwStr(g),'good');
 if(S.dt.done.every(x=>x)&&!S.dt.all){ S.dt.all=true; give({gems:10,petals:20}); setTimeout(()=>{ celebrate('🎪 '+t('dtasks'),'✓✓✓',rwStr({gems:10,petals:20})); sfx('fanfare'); },300); } updHUD(); save(); }
function achVal(m){ switch(m){ case 'coll': return S.stats.coll; case 'builds': return S.stats.builds; case 'hall': return hallLvl(); case 'her': return owned().length;
 case 'outs': return totalOutfits(); case 'colors': return S.stats.colors; case 'explored': return REG.filter(r=>r.k!=='home'&&S.reg[r.k]).length; case 'lv': return S.lv;
 case 'star': return Math.max(0,...owned().map(h=>S.h[h.k].stars)); case 'decor': return S.decor.length; case 'logins': return S.stats.logins; case 'quests': return S.q;
 case 'parade': if(parade()) S.stats.parade=1; return S.stats.parade; case 'petals': return S.stats.petals; case 'chests': return S.stats.chests; } return 0; }
function achReady(){ return ACH.filter(a=>!S.ach[a.k]&&achVal(a.m)>=a.n); }
function claimAch(k){ const a=ACH.find(x=>x.k===k); if(!a||S.ach[k]||achVal(a.m)<a.n) return; S.ach[k]=now(); give({gems:a.g}); sfx('achievement'); vib(25);
 celebrate('🏆 '+t('ach'),t('a_'+k),RI.gems+'+'+a.g); updHUD(); updQuest(); save(); }
function dtReady(){ dtEnsure(); return S.dt.list.some((k,i)=>!S.dt.done[i]&&S.dt.prog[i]>=dtDef(k).n); }

// ---------- tick ----------
function tick(){ if(!S||!S.started) return; const tn=now();
 S.b.forEach(b=>{ if(b.bt&&b.bt.end<=tn) finishBuild(b); });
 S.exps.slice().forEach(e=>{ if(e.end<=tn) finishExp(e); });
 // passive heroine XP: 3/min when assigned
 const dt=(tn-(S._lt||tn))/60000; S._lt=tn;
 if(dt>0) owned().forEach(h=>{ const s=S.h[h.k]; if(s.at!=null) s.xp=Math.min(s.xp+3*dt*(1+perk('xp')/100), xpNeed(s.lvl)*3); });
 updVillage(); updHUD(); updQuest(); updSide();
 if(curModal&&modalTick) modalTick();
 if(tn-lastSave>5000) save(); }
function offlineCatchup(){ const tn=now(), away=tn-(S.last||tn); let fin=0, ex=0;
 S.b.forEach(b=>{ if(b.bt&&b.bt.end<=tn){ const e=b.bt.end; finishBuild(b,true); b.t0=e; fin++; } });
 S.exps.slice().forEach(e=>{ if(e.end<=tn){ finishExp(e,true); ex++; } });
 const mins=away/60000; if(mins>0) owned().forEach(h=>{ const s=S.h[h.k]; if(s.at!=null) s.xp=Math.min(s.xp+3*mins,xpNeed(s.lvl)*3); });
 S._lt=tn; S.last=tn;
 if(away>120000) return {away,fin,ex}; return null; }
function offlinePopup(o,then){ const sum={}; S.b.forEach(b=>{ if(b.bt) return; const n=Math.floor(stored(b)); if(n>0){ const r=BLD[b.type].res; sum[r]=(sum[r]||0)+n; } });
 openModal('offline',{title:'🌙 '+t('offline_t'),body:`<div class="offl"><img src="${faceImg(S.leader)}"><div><div class="big">${t('offline_away',{t:ftime(o.away/1000)})}</div>
  ${o.fin?`<div>🔨 ${t('offline_built',{n:o.fin})}</div>`:''}${o.ex?`<div>⛵ ${t('offline_exp',{n:o.ex})}</div>`:''}
  ${Object.keys(sum).length?`<div class="slh">${t('offline_res')}</div><div class="offr">${Object.entries(sum).map(([k,v])=>`<span class="chip big">${RI[k]} ${fmt(v)}</span>`).join(' ')}</div>`:''}</div></div>
  <div class="btns c">${Object.keys(sum).length?`<button class="btn y big" data-a="ca">🧺 ${t('collall')}</button>`:''}<button class="btn g" data-a="ok">OK</button></div>`},'mid');
 afterClose=then; on('[data-a=ca]',()=>{ closeModal(); collectAll(); }); on('[data-a=ok]',()=>closeModal()); }

// ================= UI =================
let curModal=null, modalTick=null, afterClose=null;
const MUSIC={map:'map',shop:'shop',wardrobe:'shop',decor:'shop',tavern:'tavern',daily:'party',events:'party',ach:'party'};
function musicFor(name){ Audio2.track(MUSIC[name]||('era'+eraOf(hallLvl()))); }
function openModal(name,html,cls=''){ const was=curModal; curModal=name; modalTick=null; const m=$('#modal'); m.className='modal show '+cls;
 m.innerHTML=`<div class="sheet ${cls}"><div class="mhead"><div class="mtitle">${html.title||''}</div><button class="x" data-a="close">✕</button></div><div class="mbody">${html.body}</div></div>`;
 m.querySelector('.sheet').onclick=e=>e.stopPropagation(); m.onclick=()=>closeModal(); m.querySelector('[data-a=close]').onclick=()=>closeModal();
 setNav(name); if(was!==name) musicFor(name); }
function closeModal(){ if(!curModal) return; curModal=null; modalTick=null; const m=$('#modal'); m.className='modal'; m.innerHTML=''; sfx('close'); setNav('village'); musicFor(null);
 const f=afterClose; afterClose=null; if(f) setTimeout(f,250); }
const NAVOF={tavern:'heroes',pick:'heroes',decor:'village',daily:'village',events:'village',ach:'village',offline:'village',bld:'village',build:'village'};
function setNav(n){ n=NAVOF[n]||n; $$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.n===n)); }
function on(sel,fn,root){ (root||document).querySelectorAll(sel).forEach(el=>el.onclick=e=>{ e.stopPropagation(); Audio2.unlock(); fn(el,e); }); }

// ---------- HUD ----------
function buildHUD(){ $('#hud').innerHTML=`
 <div class="lvbox" id="hlv"><div class="lvc"><span id="hlvn">1</span></div><div class="lvbar"><i id="hlvx"></i></div><div class="era" id="hera"></div></div>
 <div class="resrow">${['coins','wood','stone','food','gems'].map(r=>`<div class="rp" data-r="${r}"><b>${RI[r]}</b><span id="r_${r}">0</span></div>`).join('')}</div>
 <button class="gear" id="hgear" aria-label="Настройки">⚙️</button>`;
 on('#hgear',()=>openSettings()); on('#hlv',()=>openHeroes()); on('.rp',()=>openShop());
 $('#side').innerHTML=[['update','↻',S.lang==='ru'?'Обновить':S.lang==='he'?'עדכון':'Update'],['ca','🧺',t('collall')],['daily','🎁',t('daily')],['chest','📦',t('chest')],['events','🎪',t('events')],['ach','🏆',t('ach')],['decor','🪴',t('decor')]]
  .map(([k,i,n])=>`<button data-s="${k}" title="${n}"><span>${i}</span><small id="sd_${k}">${k==='update'?n:''}</small><i class="dot"></i></button>`).join('');
 on('#side button',el=>{ sfx('open'); vib(6); hidePointer(); ({update:checkUpdate,ca:collectAll,daily:openDaily,chest:openChest,events:openEvents,ach:openAch,decor:openDecor})[el.dataset.s](); }); }
function updHUD(){ if(!$('#hlvn')) return; $('#hlvn').textContent=S.lv; $('#hlvx').style.width=(100*S.xp/xpNeed(S.lv))+'%';
 $('#hera').textContent=eraName(eraOf(hallLvl()))+' · 🔨'+busyBuilders()+'/'+S.builders;
 ['coins','wood','stone','food','gems'].forEach(r=>{ const e=$('#r_'+r); const v=fmt(S.r[r]); if(e.textContent!==v){ e.textContent=v; e.parentNode.classList.remove('pop'); void e.offsetWidth; e.parentNode.classList.add('pop'); } });
 const qb=$('#nav [data-n=quests] .dot'); if(qb){ const [v,n]=questProg(curQuest()); qb.style.display=v>=n?'block':'none'; }
 const sb=$('#nav [data-n=shop] .dot'); if(sb) sb.style.display=now()>=S.gift?'block':'none'; }
function updSide(){ const sd=$('#side'); if(!sd||!sd.firstChild) return; const set=(k,dot,txt)=>{ const b=sd.querySelector(`[data-s=${k}]`); if(!b) return; b.querySelector('.dot').style.display=dot?'block':'none'; const e=b.querySelector('small'); if(e.textContent!==(txt||'')) e.textContent=txt||''; };
 const anyC=S.b.some(b=>!b.bt&&stored(b)>=1); set('ca',false,''); sd.querySelector('[data-s=ca]').classList.toggle('dim',!anyC);
 set('daily',dailyReady(),''); const cl=S.chest-now(); set('chest',cl<=0,cl>0?ftime(cl/1000):'');
 set('events',dtReady(),''); set('ach',achReady().length>0,''); set('decor',false,''); }
function buildNav(){ const items=[['village','🏝️'],['heroes','👑'],['wardrobe','👗'],['map','🗺️'],['shop','🛍️'],['quests','📜']];
 $('#nav').innerHTML=items.map(([n,i])=>`<button data-n="${n}"><span class="ni">${i}</span><span class="nl">${t(n)}</span><i class="dot"></i></button>`).join('');
 on('#nav button',el=>{ sfx('open'); vib(6); hidePointer(); const n=el.dataset.n; if(n==='village') { closeModal(); return; }
  ({heroes:openHeroes,wardrobe:()=>openWardrobe(),map:()=>openMap(),shop:openShop,quests:openQuests})[n](); }); setNav(curModal||'village'); }
function updQuest(){ const q=curQuest(), [v,n]=questProg(q), el=$('#qtrack'); if(!el) return;
 const done=v>=n; const html=`<div class="qi">${done?'🏆':'📜'}</div><div class="qt"><div>${questText(q)}</div><div class="qbar"><i style="width:${100*v/n}%"></i></div><small>${fmt(v)}/${fmt(n)}</small></div>${done?`<button class="btn g sm" id="qclaim">${t('claim')}</button>`:`<button class="btn b xs" id="qgo">${t('go')} ➜</button>`}`;
 if(el._h!==html){ el._h=html; el.innerHTML=html; el.classList.toggle('done',done); on('#qclaim',()=>claimQuest(),el); on('#qgo',()=>{ sfx('tap'); questGo(); },el); } }

// ---------- tutorial pointer / quest "Go" ----------
let ptrEl=null;
function hidePointer(){ if(ptrEl){ ptrEl.remove(); ptrEl=null; } $$('.hint').forEach(e=>e.classList.remove('hint')); }
function pointAtWorld(x,y){ hidePointer(); const d=document.createElement('div'); d.className='ptr'; d.textContent='👇'; d.style.left=x+'px'; d.style.top=y+'px'; $('#world').appendChild(d); ptrEl=d; panTo(x,y); }
function pointAtEl(el){ hidePointer(); if(el) el.classList.add('hint'); }
function freePlot(){ const po=plotsOpen(), used={}; S.b.forEach(b=>used[b.plot]=1); for(let i=0;i<po;i++) if(!used[i]) return i; return -1; }
function questGo(){ closeModal(); const q=curQuest(), [ty,a]=q.g;
 const bOf=tp=>S.b.filter(b=>b.type===tp).sort((x,y)=>y.lvl-x.lvl)[0];
 switch(ty){
  case 'build': { const fp=freePlot(); if(fp<0){ toast('🔒 '+t('plotlock')); return; } const p=PLOTS[fp]; pointAtWorld(p[0],p[1]-40); setTimeout(()=>openBuildMenu(fp,a),700); return; }
  case 'upgrade': { const b=bOf(a); if(b){ const p=PLOTS[b.plot]; pointAtWorld(p[0],p[1]-150); setTimeout(()=>openBuilding(b),700); } else { const fp=freePlot(); if(fp>=0) openBuildMenu(fp,a); } return; }
  case 'bldlvl': { const b=S.b.filter(b=>b.type!=='hall').sort((x,y)=>y.lvl-x.lvl)[0]; if(b) openBuilding(b); return; }
  case 'collect': { const b=S.b.filter(b=>BLD[b.type].res===a&&!b.bt).sort((x,y)=>stored(y)-stored(x))[0]; if(b){ const p=PLOTS[b.plot]; pointAtWorld(p[0],p[1]-170); } else pointAtEl($('[data-s=ca]')); return; }
  case 'assign': openTeam(); return; case 'own': openTavern(); return; case 'herolvl': case 'herostar': openHeroes(); return;
  case 'explore': openMap(); return; case 'color': case 'outfit': case 'outfits': openWardrobe(); return;
  case 'daily': openDaily(); return; case 'collall': pointAtEl($('[data-s=ca]')); return; case 'decor': openDecor(); return;
  case 'move': { const b=S.b.find(b=>b.type!=='hall'&&!b.bt); if(b) openBuilding(b); return; }
  case 'chest': pointAtEl($('[data-s=chest]')); return; case 'ach': openAch(); return; } }

// ---------- camera: pan / pinch-zoom ----------
const cam={x:0,y:0,z:1};
function camLimits(){ const v=$('#view'); const vw=v.clientWidth, vh=v.clientHeight; const minZ=Math.max(vw,vh)/1200*0.92, maxZ=1.7; return {vw,vh,minZ,maxZ}; }
function camApply(){ const {vw,vh,minZ,maxZ}=camLimits(); cam.z=Math.max(minZ,Math.min(maxZ,cam.z)); const W=1200*cam.z;
 cam.x = W<=vw ? (vw-W)/2 : Math.min(0,Math.max(vw-W,cam.x)); cam.y = W<=vh ? (vh-W)/2 : Math.min(0,Math.max(vh-W,cam.y));
 $('#world').style.transform=`translate3d(${cam.x}px,${cam.y}px,0) scale(${cam.z})`; }
function panTo(x,y,z){ const {vw,vh}=camLimits(); if(z) cam.z=z; cam.x=vw/2-x*cam.z; cam.y=vh/2-y*cam.z; const w=$('#world'); w.classList.add('anim'); camApply(); setTimeout(()=>w.classList.remove('anim'),400); }
function zoomAt(px,py,nz){ const wx=(px-cam.x)/cam.z, wy=(py-cam.y)/cam.z; const {minZ,maxZ}=camLimits(); nz=Math.max(minZ,Math.min(maxZ,nz)); cam.z=nz; cam.x=px-wx*nz; cam.y=py-wy*nz; camApply(); }
function initCam(){ const v=$('#view'); const pts=new Map(); let moved=0, lastDrag=0, pinch=null;
 const vr=()=>v.getBoundingClientRect();
 v.addEventListener('pointerdown',e=>{ pts.set(e.pointerId,{x:e.clientX,y:e.clientY}); if(pts.size===1) moved=0; if(pts.size===2){ const [a,b]=[...pts.values()]; pinch={d:Math.hypot(a.x-b.x,a.y-b.y),z:cam.z}; } });
 window.addEventListener('pointermove',e=>{ const p=pts.get(e.pointerId); if(!p) return; const dx=e.clientX-p.x, dy=e.clientY-p.y; p.x=e.clientX; p.y=e.clientY;
  if(pts.size===1){ moved+=Math.abs(dx)+Math.abs(dy); if(moved>8){ cam.x+=dx; cam.y+=dy; camApply(); } }
  else if(pts.size===2&&pinch){ moved=99; const [a,b]=[...pts.values()]; const d=Math.hypot(a.x-b.x,a.y-b.y); const r=vr(); zoomAt((a.x+b.x)/2-r.left,(a.y+b.y)/2-r.top,pinch.z*d/pinch.d); } });
 const up=e=>{ if(!pts.has(e.pointerId)) return; pts.delete(e.pointerId); if(pts.size<2) pinch=null; if(moved>8) lastDrag=now(); };
 window.addEventListener('pointerup',up); window.addEventListener('pointercancel',up);
 v.addEventListener('click',e=>{ if(now()-lastDrag<250){ e.stopPropagation(); e.preventDefault(); } },true);
 v.addEventListener('wheel',e=>{ e.preventDefault(); const r=vr(); zoomAt(e.clientX-r.left,e.clientY-r.top,cam.z*(e.deltaY<0?1.1:0.9)); },{passive:false});
 window.addEventListener('resize',()=>camApply()); window.addEventListener('apph',()=>camApply()); }
function centerView(){ const {vw,vh,minZ}=camLimits(); const z=Math.max(minZ,Math.min(1,Math.min(vw,vh)/560)); const p=PLOTS[0]; panTo(p[0],p[1]-(vw>vh?110:60),z); }

// ---------- village ----------
let moving=null, placing=null;
function renderVillage(){ const w=$('#world'); if(!w) return; w.querySelectorAll('.plot,.bld,.dec,.dspot').forEach(e=>e.remove());
 const po=plotsOpen(); const used={}; S.b.forEach(b=>used[b.plot]=b);
 PLOTS.forEach((p,i)=>{ if(used[i]) return; const d=document.createElement('div'); d.className='plot'+(i>=po?' lk':'')+(moving&&i<po?' tgt':''); d.style.left=p[0]+'px'; d.style.top=p[1]+'px'; d.style.zIndex=p[1];
  d.innerHTML=i>=po?'<span>🔒</span>':moving?'<span>⤵</span>':'<span>+</span>'; d.onclick=e=>{ e.stopPropagation(); Audio2.unlock(); if(i>=po){ toast('🔒 '+t('plotlock')); sfx('error'); return; }
   if(moving){ moveTo(i); return; } hidePointer(); openBuildMenu(i); }; w.appendChild(d); });
 S.b.forEach(b=>{ const p=PLOTS[b.plot]; const d=document.createElement('div'); d.className='bld'+(b.type==='hall'?' hall':'')+(moving===b?' moving':''); d.id='b'+b.id;
  d.style.left=p[0]+'px'; d.style.top=p[1]+'px'; d.style.zIndex=p[1];
  const tr=b.lvl>0?tier(b):1;
  d.innerHTML=`<img src="${bimg(b.type,tr)}" draggable="false" class="${b.flip?'flip':''}"><div class="blv">${b.lvl||'·'}</div><div class="bub"></div><div class="bbar"><i></i><span></span></div><div class="team"></div>`;
  d.onclick=e=>{ e.stopPropagation(); Audio2.unlock(); if(moving){ endMove(); return; } if(placing){ endPlace(); return; } hidePointer(); tapBuilding(b); }; w.appendChild(d); });
 const usedS={}; S.decor.forEach(dc=>{ usedS[dc.s]=1; const p=DECOR_SPOTS[dc.s]; if(!p) return; const d=document.createElement('div'); d.className='dec'; d.style.left=p[0]+'px'; d.style.top=p[1]+'px'; d.style.zIndex=p[1];
  d.innerHTML=`<img src="a/d/${dc.k}.webp" draggable="false">`; d.onclick=e=>{ e.stopPropagation(); Audio2.unlock(); if(placing){ endPlace(); return; } decorInfo(dc); }; w.appendChild(d); });
 if(placing) DECOR_SPOTS.forEach((p,i)=>{ if(usedS[i]) return; const d=document.createElement('div'); d.className='dspot'; d.style.left=p[0]+'px'; d.style.top=p[1]+'px'; d.style.zIndex=9000; d.innerHTML='<span>✨</span>';
  d.onclick=e=>{ e.stopPropagation(); placeDecor(i); }; w.appendChild(d); });
 if(ptrEl&&!ptrEl.isConnected) w.appendChild(ptrEl);
 updVillage(); }
function updVillage(){ S.b.forEach(b=>{ const d=document.getElementById('b'+b.id); if(!d) return;
  d.classList.toggle('cons',!!b.bt); const bar=d.querySelector('.bbar'), bub=d.querySelector('.bub');
  if(b.bt){ const rem=(b.bt.end-now())/1000; bar.style.display='block'; bar.querySelector('i').style.width=(100*(1-rem*1000/b.bt.total))+'%'; bar.querySelector('span').textContent='🔨 '+ftime(rem); bub.style.display='none'; }
  else { bar.style.display='none'; const st=stored(b), res=BLD[b.type].res; const show=st>=1&&(st>=capOf(b)*0.08||BLD[b.type].rate<0.3);
   bub.style.display=show?'flex':'none'; if(show){ const tx=RI[res]+(st>=capOf(b)?'!':''); if(bub.textContent!==tx) bub.textContent=tx; bub.classList.toggle('full',st>=capOf(b)); } }
  const tm=teamOf(b), te=d.querySelector('.team'), key=tm.join(','); if(te._k!==key){ te._k=key; te.innerHTML=tm.map(k=>`<img src="${faceImg(k)}">`).join(''); }
  const lv=d.querySelector('.blv'); const lt=String(b.bt?b.bt.to:b.lvl); if(lv.textContent!==lt) lv.textContent=lt;
  if(!b.bt){ const img=d.querySelector('img'), src=bimg(b.type,tier(b)); if(!img.src.endsWith(src)) img.src=src; } }); }
function tapBuilding(b){ if(b.bt){ openBuilding(b); return; } const n=collect(b); if(n>0){ updHUD(); updQuest(); updVillage(); } else openBuilding(b); }
function banner(msg){ let d=$('#banner'); if(!msg){ if(d) d.remove(); return; } if(!d){ d=document.createElement('div'); d.id='banner'; $('#app').appendChild(d); }
 d.innerHTML=`<span>${msg}</span><button class="btn r xs">${t('cancel')}</button>`; d.querySelector('button').onclick=e=>{ e.stopPropagation(); sfx('close'); endMove(); endPlace(); }; }
function startMove(b){ closeModal(); moving=b; banner('🔀 '+t('movehint')); renderVillage(); sfx('swipe'); }
function endMove(){ if(!moving) return; moving=null; banner(null); renderVillage(); }
function moveTo(i){ const b=moving; b.plot=i; S.stats.moved++; moving=null; banner(null); sfx('place'); vib(15); renderVillage(); bldPop(b); updQuest(); save(); }

// ---------- decor ----------
function freeSpots(){ const u={}; S.decor.forEach(d=>u[d.s]=1); return DECOR_SPOTS.map((_,i)=>i).filter(i=>!u[i]); }
function openDecor(){ sfx('open'); const draw=()=>{ const hl=hallLvl();
 const cards=DECOR.map(D=>{ const inv=S.dinv[D.k]||0, lock=hl<D.hall, cnt=S.decor.filter(d=>d.k===D.k).length;
  return `<div class="dcard${lock?' lk':''}"><img loading="lazy" src="a/d/${D.k}.webp"><b>${t('d_'+D.k)}</b><small>😊 +${D.hap}% ${cnt?'· ×'+cnt:''}</small>
   ${lock?`<div class="warn sm">🔒 ${t('needhall',{n:D.hall})}</div>`:inv?`<button class="btn g sm" data-k="${D.k}">${t('place')} <small>${t('instock',{n:inv})}</small></button>`:`<button class="btn ${hasRes(D.p)?'g':'gr'} sm" data-k="${D.k}">${costStr(D.p)}</button>`}</div>`; }).join('');
 openModal('decor',{title:`🪴 ${t('decor')} <small>😊 +${decorHap().toFixed(1)}% · ${S.decor.length}/${DECOR_SPOTS.length} · ${RI.petals}${fmt(S.r.petals)}</small>`,body:`<div class="note">${t('decor_h')}</div><div class="dgrid">${cards}</div>`},'full');
 on('[data-k]',el=>{ const D=DECOR.find(x=>x.k===el.dataset.k); if(!freeSpots().length){ toast(t('nospot'),'bad'); sfx('error'); return; }
  if(!(S.dinv[D.k]>0)){ if(!hasRes(D.p)){ toast(t('nores'),'bad'); sfx('error'); return; } pay(D.p); S.dinv[D.k]=(S.dinv[D.k]||0)+1; sfx('buy'); updHUD(); }
  closeModal(); placing=D.k; banner('✨ '+t('placing')); renderVillage(); const fs=freeSpots(); if(fs.length){ const p=DECOR_SPOTS[fs[0]]; panTo(p[0],p[1]); } save(); }); };
 draw(); }
function endPlace(){ if(!placing) return; placing=null; banner(null); renderVillage(); }
function placeDecor(i){ const k=placing; if(!k||!(S.dinv[k]>0)) { endPlace(); return; } S.dinv[k]--; S.decor.push({k,s:i}); placing=null; banner(null); sfx('place'); vib(15);
 renderVillage(); const p=DECOR_SPOTS[i]; const d=document.createElement('div'); d.className='floaty'; d.textContent='😊+'+DECOR.find(x=>x.k===k).hap+'%'; d.style.left=p[0]+'px'; d.style.top=(p[1]-90)+'px'; $('#world').appendChild(d); setTimeout(()=>d.remove(),1300);
 updQuest(); save(); }
function decorInfo(dc){ sfx('open'); const D=DECOR.find(x=>x.k===dc.k);
 openModal('decor',{title:'🪴 '+t('d_'+dc.k),body:`<div class="offl"><img src="a/d/${dc.k}.webp"><div><div class="big">😊 +${D.hap}%</div><div class="btns"><button class="btn o" data-a="mv">🔀 ${t('move')}</button><button class="btn r" data-a="st">📦 ${t('stash')}</button></div></div></div>`},'mid');
 on('[data-a=st]',()=>{ S.decor=S.decor.filter(x=>x!==dc); S.dinv[dc.k]=(S.dinv[dc.k]||0)+1; sfx('swipe'); closeModal(); renderVillage(); save(); });
 on('[data-a=mv]',()=>{ S.decor=S.decor.filter(x=>x!==dc); S.dinv[dc.k]=(S.dinv[dc.k]||0)+1; closeModal(); placing=dc.k; banner('✨ '+t('placing')); renderVillage(); sfx('swipe'); }); }

// ---------- daily / events / achievements UI ----------
function openDaily(){ sfx('open'); const draw=()=>{ const rd=dailyReady(), {st,idx}=dailyIdx(); const cur=rd?idx:(S.daily.streak-1)%7;
 const days=LOGIN.map((_,i)=>{ const g=dailyGift(i); const got=rd?i<idx:i<=cur; return `<div class="dday${got?' got':''}${rd&&i===idx?' now':''}"><b>${t('day',{n:i+1})}</b><div>${rwStr(g).replace(/\+/g,'')}</div>${got?'<i>✓</i>':''}</div>`; }).join('');
 openModal('daily',{title:'🎁 '+t('daily'),body:`<div class="note">${t('streak',{n:rd?st:S.daily.streak})}</div><div class="dgrid7">${days}</div><div class="btns c">${rd?`<button class="btn y big" data-a="cl">🎁 ${t('claim_d')}</button>`:`<div class="chip big">${t('come_back')}</div>`}</div>`},'mid');
 on('[data-a=cl]',()=>{ claimDaily(); draw(); }); }; draw(); }
function openEvents(){ sfx('open'); dtEnsure(); const draw=()=>{ const ev=todayEv();
 const rows=S.dt.list.map((k,i)=>{ const T=dtDef(k), p=Math.min(S.dt.prog[i],T.n), dn=S.dt.done[i];
  return `<div class="qrow${dn?' dim':''}"><div style="flex:1"><b>${t('dt_'+k,{n:T.n})}</b><div class="qbar"><i style="width:${100*p/T.n}%"></i></div><small>${p}/${T.n} · 🌸15 ${RI.coins}${fmt(100*hallLvl())}</small></div>${dn?'✓':p>=T.n?`<button class="btn g sm" data-i="${i}">${t('claim')}</button>`:''}</div>`; }).join('');
 openModal('events',{title:`🎪 ${t('events')} <small>${RI.petals} ${fmt(S.r.petals)}</small>`,body:`<div class="evbox"><div class="slh">⭐ ${t('event_today')}</div><div class="big">${t(ev.k)}</div></div>
  <div class="slh">📋 ${t('dtasks')}</div>${rows}<div class="note">${t('dall')}${S.dt.all?' ✓':''}<br>${t('petals_h')}</div>`},'mid');
 on('[data-i]',el=>{ dtClaim(+el.dataset.i); draw(); }); }; draw(); }
function openAch(){ sfx('open'); const draw=()=>{ const n=Object.keys(S.ach).length;
 const rows=ACH.map(a=>{ const v=Math.min(achVal(a.m),a.n), got=S.ach[a.k], rd=!got&&v>=a.n;
  return `<div class="arow${got?' got':''}${rd?' rd':''}"><div class="ai">${got?'🏆':rd?'🎉':'🔒'}</div><div style="flex:1"><b>${t('a_'+a.k)}</b><div class="qbar"><i style="width:${100*v/a.n}%"></i></div><small>${fmt(v)}/${fmt(a.n)} · ${RI.gems}${a.g}</small></div>${rd?`<button class="btn y sm" data-k="${a.k}">${t('claim')}</button>`:''}</div>`; }).join('');
 openModal('ach',{title:`🏆 ${t('ach')} <small>${t('ach_n',{a:n,b:ACH.length})}</small>`,body:`<div class="alist">${rows}</div>`},'full');
 on('[data-k]',el=>{ claimAch(el.dataset.k); draw(); }); }; draw(); }

function openBuildMenu(plot,hl0){ sfx('open'); const hl=hallLvl();
 const items=BORDER.filter(k=>k!=='hall').map(k=>{ const B=BLD[k], c=bCost(k,1), cnt=countType(k);
  let lock=''; if(hl<B.hall) lock=t('needhall',{n:B.hall}); else if(cnt>=B.max) lock=t('maxcount');
  return `<div class="bcard${lock?' lk':''}${hl0===k?' hint':''}" data-k="${k}"><img src="${bimg(k,eraOf(hl))}"><div class="bn">${bname(k)} <small>${cnt}/${B.max}</small></div>
   <div class="bp">${RI[B.res]} ${fmt(B.rate*60)}${t('per_h')} · ⏱${ftime(bTime(k,1))}</div><div class="bc">${lock?'🔒 '+lock:costStr(c)}</div></div>`; }).join('');
 openModal('build',{title:'🔨 '+t('buildmenu'),body:`<div class="bgrid">${items}</div>`},'mid');
 const h=$('.bcard.hint'); if(h) h.scrollIntoView({block:'center'});
 on('.bcard:not(.lk)',el=>{ if(startBuild(plot,el.dataset.k)) closeModal(); }); on('.bcard.lk',()=>{ sfx('error'); }); }
function openBuilding(b){ sfx('open'); const B=BLD[b.type];
 const draw=()=>{ const tm=teamOf(b), sl=slotsOf(b); const L=b.lvl+1, c=bCost(b.type,L);
  let block=''; if(b.type==='hall'&&S.lv<b.lvl) block=t('needlvl',{n:b.lvl}); else if(L>maxLvl(b)) block=t('needhall',{n:Math.ceil(L/2)});
  const st=stored(b), r=rate(b);
  const slots=[...Array(sl)].map((_,i)=>{ const k=tm[i]; return k?`<div class="slot f" data-k="${k}"><img src="${faceImg(k)}"><small>+${Math.round(heroInB(k,b))}%</small></div>`:`<div class="slot" data-i="${i}">＋<small>${t('empty')}</small></div>`; }).join('')
   + (sl<3?`<div class="slot lk">🔒<small>${t('lvl')} ${5*sl}</small></div>`:'');
  let body=`<div class="bpanel"><div class="bpi"><img class="${b.flip?'flip':''}" src="${bimg(b.type,b.lvl?tier(b):1)}"><div class="eratag">${eraName(b.lvl?tier(b):1)}</div></div><div class="bpd">`;
  if(b.bt){ const rem=(b.bt.end-now())/1000, sc=speedCost(b);
   body+=`<div class="big">${b.lvl?t('upgrading'):t('building')} → ${t('lvl')} ${b.bt.to}</div><div class="pbar"><i style="width:${100*(1-rem*1000/b.bt.total)}%"></i></div><div class="tm">⏱ ${ftime(rem)}</div>
    <button class="btn p" data-a="speed">⚡ ${t('speed')} ${sc?RI.gems+sc:t('speedfree')}</button>`; }
  else { body+=`<div class="stat">${t('prod')}: <b>${RI[B.res]} ${r*60>=10?fmt(r*60):(r*60).toFixed(1)}${t('per_h')}</b> <span class="bon">+${Math.round(bonusOf(b))}%</span></div>
    <div class="stat">${t('stored')}: <b>${RI[B.res]} ${fmt(st)}/${fmt(capOf(b))}</b></div><div class="pbar y"><i style="width:${100*st/capOf(b)}%"></i></div>
    <button class="btn y" data-a="collect" ${st<1?'disabled':''}>${t('collect')}</button>
    <div class="up"><div class="uph">${t('upgrade')} → ${t('lvl')} ${L} <small>⏱${ftime(bTime(b.type,L))}</small></div>${block?`<div class="warn">🔒 ${block}</div>`:`<div class="bc">${costStr(c)}</div>`}
    <button class="btn g" data-a="up" ${block?'disabled':''}>⬆ ${t('upgrade')}</button></div>`; }
  body+=`<div class="btns"><button class="btn b xs" data-a="mv">🔀 ${t('move')}</button><button class="btn b xs" data-a="fl">↔ ${t('flip')}</button></div>`;
  body+=`</div></div><div class="slh">👑 ${t('slots')} <small>(${t('bonus')})</small></div><div class="slots">${slots}</div>`;
  openModal('bld',{title:`${bname(b.type)} · ${t('lvl')} ${b.lvl}`,body},'mid');
  on('[data-a=speed]',()=>speedUp(b)); on('[data-a=collect]',()=>{ collect(b); updHUD(); draw(); }); on('[data-a=up]',()=>startUpgrade(b));
  on('[data-a=mv]',()=>startMove(b)); on('[data-a=fl]',()=>{ b.flip=!b.flip; sfx('swipe'); renderVillage(); bldPop(b); save(); draw(); });
  on('.slot:not(.lk)',el=>pickHero(b,draw));
  modalTick=()=>{ const tm2=$('.tm'); if(b.bt&&tm2){ const rem=(b.bt.end-now())/1000; tm2.textContent='⏱ '+ftime(rem); $('.pbar i').style.width=(100*(1-rem*1000/b.bt.total))+'%'; } else if(b._wasBt&&!b.bt) draw(); b._wasBt=!!b.bt; };
  b._wasBt=!!b.bt; };
 draw(); }
function pickHero(b,back){ const list=owned().map(h=>{ const s=S.h[h.k], here=s.at===b.id; const ob=s.at!=null&&!here?S.b.find(x=>x.id===s.at):null;
  return `<div class="hpick${here?' on':''}" data-k="${h.k}"><img src="${faceImg(h.k)}"><div><b>${hname(h.k)}</b><small>${RI[h.res==='all'?'charm':h.res]} +${Math.round(heroInB(h.k,b))}% ${ob?'· '+bname(ob.type):here?'✓':''}</small></div></div>`; }).join('');
 openModal('pick',{title:t('assign_to'),body:`<div class="hplist">${list}</div>`},'mid');
 on('.hpick',el=>{ const k=el.dataset.k; if(S.h[k].at===b.id) assign(k,null); else { assign(k,b.id); questEvent('assign',null,0); } updVillage(); back(); }); }

// ---------- heroines ----------
function stars(n,max=5){ let s=''; for(let i=1;i<=max;i++) s+=`<i class="${i<=n?'on':'off'}">★</i>`; return `<span class="stars">${s}</span>`; }
function freeRecruit(k){ return k==='dj'||k==='florist'; }
function recruitHero(k){
 const h=H(k); if(!h||S.h[k]) return false;
 if(!freeRecruit(k)){
  const r=h.rec;if(!r||!S.b.some(b=>b.type==='tavern'&&b.lvl>0))return false;
  if(r.t==='hall'){if(hallLvl()<r.v)return false;}else{if((S.r[r.t]||0)<r.v)return false;S.r[r.t]-=r.v;}
 }
 newHero(k);return true;
}
function inviteFreeHero(k){if(!freeRecruit(k)||!recruitHero(k))return;sfx('recruit');save();openHeroes();}
function recText(h){ const r=h.rec; if(freeRecruit(h.k))return t('free'); if(!r) return ''; if(r.t==='hall') return '🏛️ '+t('needhall',{n:r.v}); return RI[r.t]+' '+fmt(r.v); }
function openHeroes(){ const cards=HER.map(h=>{ const s=S.h[h.k];
  if(!s) return `<div class="hcard no" data-k="${h.k}"><img src="${faceImg(h.k)}"><div class="hn">${hname(h.k)}</div><div class="hr">${freeRecruit(h.k)?'🎁 '+t('recruit')+' · ':'🔒 '}${recText(h)}</div></div>`;
  const b=s.at!=null?S.b.find(x=>x.id===s.at):null; const ready=s.xp>=xpNeed(s.lvl)&&s.lvl<heroCap(h.k);
  return `<div class="hcard" data-k="${h.k}" style="--c:${h.c}"><img src="${faceImg(h.k)}">${ready?'<i class="dot2">⬆</i>':''}<div class="hn">${hname(h.k)}</div><div class="hl">${t('lvl')} ${s.lvl} ${stars(s.stars)}</div><div class="hr">${b?'🏠 '+bname(b.type):'· '+t('not_assigned')}</div></div>`; }).join('');
 openModal('heroes',{title:`👑 ${t('heroes')} <small>${t('owned_n',{n:owned().length+'/'+HER.length})}</small>`,
  body:`<div class="hbar"><button class="btn o sm" data-a="tav">🍹 ${t('tavern')}</button><button class="btn b sm" data-a="team">🤝 ${t('team')}</button><span class="chip">💖 ${charm()} · ${t('happiness')} +${happiness().toFixed(1)}%</span></div><div class="hgrid">${cards}</div>`},'full');
 on('.hcard:not(.no)',el=>openProfile(el.dataset.k)); on('.hcard.no',el=>freeRecruit(el.dataset.k)?inviteFreeHero(el.dataset.k):openTavern()); on('[data-a=tav]',()=>openTavern()); on('[data-a=team]',()=>openTeam()); }
function openProfile(k){ sfx('open'); const h=H(k);
 const draw=()=>{ const s=S.h[k], need=xpNeed(s.lvl), c=lvlCost(k), cap=heroCap(k); const b=s.at!=null?S.b.find(x=>x.id===s.at):null;
  const canLv=s.xp>=need&&s.lvl<cap; const tc={food:Math.ceil(15*Math.pow(1.12,s.lvl))};
  const syn=SYNERGY.filter(p=>p.includes(k)).map(p=>p[0]===k?p[1]:p[0]);
  const body=`<div class="prof" style="--c:${h.c}"><div class="pimg"><img id="pimg"><div class="pname">${hname(k)}</div><div class="prole">${t('ro_'+k)}</div></div><div class="pinfo">
   <div class="row">${stars(s.stars)} <span class="chip">${t('lvl')} ${s.lvl}${cap<Infinity?'/'+cap:''}</span></div>
   <div class="xpb"><i style="width:${Math.min(100,100*s.xp/need)}%"></i><span>${t('xp')} ${fmt(s.xp)}/${fmt(need)}</span></div>
   <div class="stat">${t('bonus')}: <b>${RI[h.res==='all'?'charm':h.res]} +${Math.round(heroBonus(k))}%</b> ${h.res==='all'?'('+t('r_all')+')':t('r_'+h.res)}</div>
   ${h.perk?`<div class="stat">${t('perk')}: <b>${t('p_'+h.perk,{v:Math.round(h.pv*(1+0.03*(s.lvl-1))*Math.pow(1.15,s.stars-1))})}</b></div>`:''}
   ${syn.length?`<div class="stat">${t('sync')}: ${syn.map(x=>`<img class="mini" src="${faceImg(x)}">`).join('')} +5%</div>`:''}
   <div class="stat">${b?t('in_bld')+': <b>'+bname(b.type)+'</b>':t('not_assigned')} <button class="btn b xs" data-a="as">${t('assign')}</button></div>
   <div class="btns"><button class="btn g" data-a="lv" ${canLv&&hasRes(c)?'':'disabled'}>⬆ ${t('lvlup')}<small>${costStr(c)}</small></button>
   <button class="btn o" data-a="tr">${t('train')}<small>${costStr(tc)} → +${fmt(Math.ceil(need/4))}${RI.xp}</small></button>
   ${s.stars<5?`<button class="btn p" data-a="st" ${S.r.shards>=STARN[s.stars-1]?'':'disabled'}>${t('starup')}<small>${t('star_need',{a:fmt(S.r.shards),b:STARN[s.stars-1]})}</small></button>`:''}
   <button class="btn pk" data-a="wd">👗 ${t('wardrobe')}</button></div>
   <div class="skh">${t('skills')} · <b>${s.sp}</b> ${t('sp')}</div>
   ${['res','build','charm'].map(br=>`<div class="sk"><span>${br==='res'?'⛏️':br==='build'?'🔨':'💖'} ${t('br_'+br)}</span><div class="pips">${[...Array(10)].map((_,i)=>`<i class="${i<s.sk[br]?'on':''}"></i>`).join('')}</div><button class="btn g xs" data-br="${br}" ${s.sp>0&&s.sk[br]<10?'':'disabled'}>+</button></div>`).join('')}
  </div></div>`;
  openModal('heroes',{title:hname(k),body},'full'); setHeroImg($('#pimg'),k);
  on('[data-a=lv]',()=>{ heroLevelUp(k); draw(); }); on('[data-a=tr]',()=>{ heroTrain(k); draw(); }); on('[data-a=st]',()=>{ heroStar(k); draw(); });
  on('[data-a=wd]',()=>openWardrobe(k)); on('[data-a=as]',()=>assignFromHero(k,draw));
  on('[data-br]',el=>{ const br=el.dataset.br; if(s.sp>0&&s.sk[br]<10){ s.sp--; s.sk[br]++; sfx('sparkle'); save(); draw(); } }); };
 draw(); }
function assignFromHero(k,back){ const bs=S.b.filter(b=>b.lvl>0);
 const list=`<div class="hpick" data-id="-1"><div class="ico">🚫</div><div><b>${t('remove')}</b></div></div>`+bs.map(b=>{ const tm=teamOf(b); return `<div class="hpick${S.h[k].at===b.id?' on':''}" data-id="${b.id}"><img src="${bimg(b.type,tier(b))}" class="bimg"><div><b>${bname(b.type)} ${t('lvl')} ${b.lvl}</b><small>+${Math.round(heroInB(k,b))}% · ${tm.length}/${slotsOf(b)}</small></div></div>`; }).join('');
 openModal('pick',{title:t('assign_to'),body:`<div class="hplist">${list}</div>`},'mid');
 on('.hpick',el=>{ const id=+el.dataset.id; assign(k,id<0?null:id); updVillage(); back(); }); }
function openTeam(){ const bs=S.b.filter(b=>b.lvl>0);
 const rows=bs.map(b=>{ const tm=teamOf(b), sl=slotsOf(b); return `<div class="trow" data-id="${b.id}"><img class="bimg" src="${bimg(b.type,tier(b))}"><div class="tn"><b>${bname(b.type)} ${t('lvl')} ${b.lvl}</b><small>${RI[BLD[b.type].res]} +${Math.round(bonusOf(b))}%</small></div><div class="tf">${[...Array(sl)].map((_,i)=>tm[i]?`<img src="${faceImg(tm[i])}">`:'<span>＋</span>').join('')}</div></div>`; }).join('');
 openModal('heroes',{title:'🤝 '+t('team'),body:`<button class="btn g" data-a="auto">${t('auto')}</button><div class="tlist">${rows}</div>`},'full');
 on('[data-a=auto]',()=>{ autoAssign(); updVillage(); openTeam(); }); on('.trow',el=>{ const b=S.b.find(x=>x.id==el.dataset.id); pickHero(b,()=>openTeam()); }); }

// ---------- tavern ----------
function openTavern(){ sfx('open'); const tav=S.b.find(b=>b.type==='tavern'&&b.lvl>0);
 const draw=()=>{ const left=S.tfree-now();
  const cards=HER.filter(h=>h.rec).map(h=>{ const s=S.h[h.k], r=h.rec; let ok=!s&&tav;
   if(freeRecruit(h.k))ok=!s;else if(r.t==='hall') ok=ok&&hallLvl()>=r.v; else ok=ok&&(S.r[r.t]||0)>=r.v;
   return `<div class="tcard${s?' got':''}" style="--c:${h.c}"><img loading="lazy" src="a/h/${h.k}.webp"><div class="tci"><b>${hname(h.k)}</b><small>${t('ro_'+h.k)}</small>
    ${s?`<div class="chip">✓ ${t('recruited')}</div>`:`<button class="btn ${ok?'g':'gr'}" data-k="${h.k}" ${ok?'':'disabled'}>${t('recruit')} · ${freeRecruit(h.k)?t('free'):r.t==='hall'?'🏛️'+r.v:RI[r.t]+fmt(r.v)}</button>`}</div></div>`; }).join('');
  openModal('tavern',{title:'🍹 '+t('tavern')+` <small>${RI.tickets} ${S.r.tickets}</small>`,body:`<div class="tavtop">${!tav?`<div class="warn">🔒 ${t('needtav')}</div>`:
   left>0?`<div class="chip big" id="tft">${t('freeticket')} ${ftime(left/1000)}</div>`:`<button class="btn y" data-a="free">${t('getfree')}</button>`}</div><div class="tgrid">${cards}</div>`},'full tav');
  on('[data-a=free]',()=>{ S.r.tickets++; S.tfree=now()+12*3600e3; sfx('buy'); save(); draw(); });
  on('[data-k]',el=>{ const h=H(el.dataset.k); if(!recruitHero(h.k))return; sfx('recruit'); vib(30); save();
   celebrate('💃 '+t('recruited'),hname(h.k),t('ro_'+h.k),faceImg(h.k)); draw(); });
  modalTick=()=>{ const e=$('#tft'); if(e){ const l=S.tfree-now(); if(l<=0) draw(); else e.textContent=t('freeticket')+' '+ftime(l/1000); } }; };
 draw(); }

// ---------- wardrobe ----------
let wdHero=null;
function outPrice(o){ const p=o.p; if(!p) return null; const ev=todayEv(); if(ev.disc&&(p.coins||p.gems||p.petals)){ const q={}; for(const k in p) q[k]=Math.ceil(p[k]*(1-ev.disc)); return q; } return p; }
function outLock(o){ const p=o.p; if(!p) return null; if(p.hall&&hallLvl()<p.hall) return t('un_hall',{n:p.hall}); if(p.quest&&S.q<p.quest) return t('un_quest',{n:p.quest}); if(p.ach&&Object.keys(S.ach).length<p.ach) return t('un_ach',{n:p.ach}); return null; }
const outFree=o=>o.p&&(o.p.hall||o.p.quest||o.p.ach);
function fxText(o){ if(!o.th) return t('fx_ch',{v:o.ch}); const f=TH_FX[o.th]; return Object.entries(f).map(([k,v])=>t('fx_'+k,{v})).join(' · '); }
function openWardrobe(k){ sfx('open'); wdHero=k||wdHero||S.leader; if(!S.h[wdHero]) wdHero=S.leader;
 const bout=S.b.find(b=>b.type==='boutique'&&b.lvl>0);
 const draw=()=>{ const k=wdHero, s=S.h[k], cur=outfitOf(k);
  const heads=owned().map(h=>`<img class="wh${h.k===k?' on':''}" data-h="${h.k}" src="${faceImg(h.k)}">`).join('');
  const outs=OUT[k].map(o=>{ const own=s.owned.includes(o.id); let pr='';
   if(!own){ const lk=outLock(o); if(lk) pr='🔒 '+lk; else if(outFree(o)) pr='🎁 '+t('free'); else pr=costStr(outPrice(o)); }
   return `<div class="oc${o.id===s.o?' on':''}${own?'':' lk'}" data-o="${o.id}"><div class="ot"><img loading="lazy" src="${o.tn}">${o.th?`<i class="thi">${TH_ICON[o.th]}</i>`:''}</div><b>${t('o_'+o.id)}</b><small class="fx">${fxText(o)}</small><small>${own?(o.id===s.o?'✓ '+t('worn'):t('owned')):pr}</small></div>`; }).join('');
  const canColor=cur.m&&MASKH[cur.m]!=null; const ch=s.hue[cur.id];
  const sw=HUES.map(hu=>hu==null?`<div class="sw orig${ch==null?' on':''}" data-hu="x">${t('orig')}</div>`:`<div class="sw${ch===hu?' on':''}" data-hu="${hu}" style="background:radial-gradient(circle at 35% 30%,#fff8 0 12%,transparent 30%),hsl(${hu},85%,48%)"></div>`).join('');
  const no=s.owned.length, tot=OUT[k].length, pr=parade();
  const setb=`<div class="setb"><b>📚 ${t('setb')}: ${no}/${tot}</b><div class="${no>=3?'ok':''}">${no>=3?'✓':'○'} ${t('set3')}</div><div class="${no>=tot?'ok':''}">${no>=tot?'✓':'○'} ${t('set6')}</div>
   <div class="${pr?'ok':''}">${pr?t('parade_on',{t:TH_ICON[pr]+' '+t('th_'+pr)}):t('parade',{t:cur.th?TH_ICON[cur.th]+' '+t('th_'+cur.th):'…'})}</div></div>`;
  openModal('wardrobe',{title:'👗 '+t('wardrobe')+` <small>💖 ${charm()} · ${RI.petals}${fmt(S.r.petals)}</small>`,body:`<div class="wd"><div class="wheads">${heads}</div><div class="wmain"><div class="wimg"><img id="wimg"><div class="pname">${hname(k)}</div><div class="wfx">${cur.th?TH_ICON[cur.th]+' ':''}${fxText(cur)}</div></div>
   <div class="wside"><div class="slh">${t('outfits')}</div><div class="ogrid">${outs}</div>${!bout?`<div class="warn sm">🔒 ${t('needbout')}</div>`:''}${setb}
   <div class="slh">${t('colors')}</div>${canColor?`<div class="sws">${sw}</div>`:`<div class="warn sm">${t('nocolor')}</div>`}</div></div></div>`},'full wdm');
  setHeroImg($('#wimg'),k);
  on('.wh',el=>{ wdHero=el.dataset.h; sfx('tap'); draw(); });
  on('.oc',el=>{ const o=OUT[k].find(x=>x.id===el.dataset.o);
   if(s.owned.includes(o.id)){ if(s.o!==o.id){ s.o=o.id; S.stats.wear++; dEvent('wear',1); sfx('outfit'); save(); } draw(); return; }
   const lk=outLock(o); if(lk){ toast('🔒 '+t('lockedby',{x:lk}),'bad'); sfx('error'); return; }
   if(!outFree(o)){ const pp=outPrice(o); if(!bout){ toast(t('needbout'),'bad'); sfx('error'); return; } if(!hasRes(pp)){ toast(t('nores'),'bad'); sfx('error'); return; } pay(pp); }
   s.owned.push(o.id); s.o=o.id; questEvent('outfit',null,1); dEvent('wear',1); sfx('outfit'); vib(20); confetti(30);
   if(s.owned.length===3||s.owned.length===OUT[k].length) setTimeout(()=>{ toast('📚 '+(s.owned.length>=OUT[k].length?t('set6'):t('set3')),'good'); sfx('fanfare'); },400);
   save(); updHUD(); draw(); });
  on('.sw',el=>{ const v=el.dataset.hu; if(v==='x') delete s.hue[cur.id]; else { s.hue[cur.id]=+v; questEvent('color',null,1); S.stats.colors++; dEvent('color',1); } sfx('sparkle'); save(); draw(); }); };
 draw(); }

// ---------- map ----------
function openMap(sel){ sfx('open');
 const draw=(sel)=>{ const allDone=REG.every(r=>S.reg[r.k]); const fe=expOf('far');
  const mk=REG.map(r=>{ const st=regState(r); return `<div class="mk ${st}${sel===r.k?' sel':''}" data-k="${r.k}" style="left:${r.x}%;top:${r.y}%"><span>${st==='done'?'🚩':st==='going'?'⛵':st==='open'?'❗':'🔒'}</span><b>${t('g_reg_'+r.k)}</b></div>`; }).join('')
   + (allDone?`<div class="mk ${fe?'going':'open'}${sel==='far'?' sel':''}" data-k="far" style="left:94%;top:20%"><span>🌀</span><b>${t('endless')} #${S.far+1}</b></div>`:'');
  const slots=`<div class="expslots">${[...Array(3)].map((_,i)=>{ const e=S.exps[i]; if(i>=expSlots()) return `<div class="es lk">🔒 🗼${4*i}</div>`;
   return e?`<div class="es on" data-k="${e.k}">⛵ ${e.k==='far'?t('endless'):t('g_reg_'+e.k)}<small class="est" data-k="${e.k}"></small></div>`:`<div class="es">＋</div>`; }).join('')}</div>`;
  let info='';
  if(sel){ const r=sel==='far'?farReg():REG.find(x=>x.k===sel); const st=sel==='far'?(fe?'going':'open'):regState(r);
   const nm=sel==='far'?t('endless')+' #'+(S.far+1):t('g_reg_'+sel);
   info=`<div class="minfo"><b>${nm}</b>`;
   if(sel==='home') info+=`<div>🏝️ ${t('village')}</div>`;
   else if(st==='done') info+=`<div class="chip">✓ ${t('explored')} · ${r.bon==='all'?'💫':RI[r.bon]} +5%</div>`;
   else if(st==='going'){ info+=`<div class="pbar"><i id="mpb"></i></div><div id="mtm" class="tm"></div><button class="btn p" data-a="spd">⚡ ${t('speed')} <span id="msc"></span></button>`; }
   else { const full=S.exps.length>=expSlots(); info+=`<div>${t('reward')}: ${rwStr(r.rw)}${sel!=='far'?' · '+t('plots'):''}${r.bon?' · '+(r.bon==='all'?'💫':RI[r.bon])+'+5%':''}</div><div>${RI.food} ${fmt(r.food)} · ⏱ ${ftime(expTime(r))} · 🗼${r.tw}</div>`+
     (st==='locked'?`<div class="warn">🔒 ${t('needtower',{n:r.tw})}</div>`:full?`<div class="warn">${t('noslot')}</div>`:`<button class="btn g" data-a="go">⛵ ${t('explore')}</button>`); }
   info+='</div>'; }
  const SI={done:'🚩',going:'⛵',open:'❗',locked:'🔒'};
  const rl=REG.filter(r=>r.k!=='home').map(r=>{ const st=regState(r); return `<div class="rrow ${st}${sel===r.k?' sel':''}" data-k="${r.k}"><span>${SI[st]}</span><b>${t('g_reg_'+r.k)}</b><small>${st==='done'?'✓ '+(r.bon==='all'?'💫':RI[r.bon])+'+5%':st==='locked'?'🗼'+r.tw:'⏱ '+ftime(expTime(r))}</small></div>`; }).join('')
   + (allDone?`<div class="rrow ${fe?'going':'open'}${sel==='far'?' sel':''}" data-k="far"><span>🌀</span><b>${t('endless')} #${S.far+1}</b><small>⏱ ${ftime(expTime(farReg()))}</small></div>`:'');
  const hint=expSlots()<3?`<div class="note">${t('expslots')}</div>`:'';
  openModal('map',{title:`🗺️ ${t('map')} <small>🗼${towerLvl()} · ${exploredCount()}/${REG.length-1} · ${t('exps',{a:S.exps.length,b:expSlots()})}</small>`,body:`<div class="mapv"><div class="mapi"><img src="a/ui/map.webp">${mk}</div></div><div class="mside">${slots}${info||hint}<div class="rlist">${rl}</div></div>`},'full mapm');
  on('.mk,.rrow',el=>{ sfx('tap'); draw(el.dataset.k); }); on('.es.on',el=>{ sfx('tap'); draw(el.dataset.k); });
  on('[data-a=go]',()=>startExp(sel==='far'?farReg():REG.find(x=>x.k===sel)));
  on('[data-a=spd]',()=>{ const e=expOf(sel); if(!e) return; const rem=(e.end-now())/1000, c=rem<30?0:Math.ceil(rem/120); if(S.r.gems<c){ toast(t('nores'),'bad'); sfx('error'); return; } S.r.gems-=c; e.end=now(); tick(); draw(sel); });
  modalTick=()=>{ $$('.est').forEach(x=>{ const e=expOf(x.dataset.k); if(e) x.textContent=' '+ftime((e.end-now())/1000); });
   const e=sel&&expOf(sel); if(e&&$('#mtm')){ const rem=(e.end-now())/1000; $('#mtm').textContent='⏱ '+ftime(rem); $('#mpb').style.width=(100*(1-rem*1000/e.total))+'%'; $('#msc').textContent=rem<30?t('free'):RI.gems+Math.ceil(rem/120); }
   else if(!e&&$('#mtm')) draw(sel); }; modalTick(); };
 draw(sel); }

// ---------- shop ----------
function openShop(){ sfx('open'); const draw=()=>{ const items=SHOP.map(it=>{ let btn;
   if(it.id==='gift'){ const l=S.gift-now(); btn=l>0?`<button class="btn gr" disabled id="gft">⏱ ${ftime(l/1000)}</button>`:`<button class="btn y" data-id="gift">🎁 ${t('free')}</button>`; }
   else if(it.once&&S.builders>=2) btn=`<button class="btn gr" disabled>✓</button>`;
   else btn=`<button class="btn ${hasRes(it.price)?'g':'gr'}" data-id="${it.id}">${costStr(it.price)}</button>`;
   const ic=it.id==='builder'?'👷‍♀️':it.id==='gift'?'🎁':RI[Object.keys(it.give)[0]];
   return `<div class="scard${it.id==='gift'?' gift':''}"><div class="si">${ic}</div><b>${t('s_'+it.id)}</b><small>${it.id==='builder'?'🔨+1':rwStr(it.give)}</small>${btn}</div>`; }).join('');
  openModal('shop',{title:'🛍️ '+t('shop')+` <small>${RI.petals}${fmt(S.r.petals)} ${RI.tickets}${S.r.tickets} ${RI.books}${fmt(S.r.books)} ${RI.shards}${fmt(S.r.shards)}</small>`,body:`<div class="note">💝 ${t('shopnote')}</div><div class="sgrid">${items}</div>`},'full');
  on('[data-id]',el=>{ const it=SHOP.find(x=>x.id===el.dataset.id);
   if(it.id==='gift'){ if(now()<S.gift) return; give(it.give); S.gift=now()+it.free; dEvent('gift',1); }
   else { if(!hasRes(it.price)){ toast(t('nores'),'bad'); sfx('error'); return; } pay(it.price); give(it.give); }
   sfx('buy'); vib(15); toast('✓ '+t('s_'+it.id),'good'); updHUD(); save(); draw(); });
  modalTick=()=>{ const e=$('#gft'); if(e){ const l=S.gift-now(); if(l<=0) draw(); else e.textContent='⏱ '+ftime(l/1000); } }; };
 draw(); }

// ---------- quests ----------
function openQuests(){ const q=curQuest(), [v,n]=questProg(q), done=v>=n;
 const next=[1,2,3].map(i=>{ const qq=S.q+i<QUESTS.length?QUESTS[S.q+i]:genQuest(S.q+i); return `<div class="qrow dim">🔒 ${questText(qq)} <small>${rwStr(qq.r)}</small></div>`; }).join('');
 openModal('quests',{title:`📜 ${t('quests')} <small>#${S.q+1}</small>`,body:`<div class="qmain${done?' done':''}"><img src="${faceImg(S.leader)}"><div><b>${questText(q)}</b><div class="qbar"><i style="width:${100*v/n}%"></i></div><small>${fmt(v)}/${fmt(n)}</small>
  <div>${t('reward')}: ${rwStr(q.r)}</div>${done?`<button class="btn g" data-a="cl">🏆 ${t('claim')}</button>`:`<button class="btn b" data-a="go">${t('go')} ➜</button>`}</div></div>${next}<div class="note">✅ ${S.q} · ${t('hint_offline')}</div>`},'full');
 on('[data-a=cl]',()=>claimQuest()); on('[data-a=go]',()=>questGo()); }

// ---------- settings ----------
function openSettings(){ sfx('open'); const draw=()=>{
 openModal('settings',{title:'⚙️ '+t('settings'),body:`<div class="set"><div class="slh">${t('lang')}</div><div class="langs">${[['ru','🇷🇺 Русский'],['en','🇬🇧 English'],['he','🇮🇱 עברית']].map(([l,n])=>`<button class="btn ${S.lang===l?'p':'gr'}" data-l="${l}">${n}</button>`).join('')}</div>
  <div class="nowp">🎶 ${t('nowplay')}: <b id="snp"></b></div>
  <label class="sl">🎵 ${t('settings_music')} <input type="range" min="0" max="100" value="${Math.round(S.mv*100)}" id="smv"></label>
  <label class="sl">🔊 ${t('settings_sfx')} <input type="range" min="0" max="100" value="${Math.round(S.sv*100)}" id="ssv"></label>
  ${CANVIB?`<label class="sl tg">📳 ${t('vib')} <input type="checkbox" id="svb" ${S.vib?'checked':''}></label>`:''}
  <div class="note">${t('hint_offline')}<br>${t('version')} ${VERSION}</div>
  <button class="btn b" data-a="update">↻ ${S.lang==='ru'?'Проверить обновление':S.lang==='he'?'בדיקת עדכון':'Check for update'}</button><button class="btn r" data-a="reset">🗑️ ${t('reset')}</button></div>`},'mid');
 const np=()=>{ const e=$('#snp'); if(e) e.textContent=S.mv>0?Audio2.trackName(Audio2.cur||Audio2.want||'menu'):t('musicoff'); }; np(); modalTick=np;
 on('[data-l]',el=>{ setLang(el.dataset.l); draw(); });
 $('#smv').oninput=e=>{ S.mv=e.target.value/100; Audio2.setVol(S.mv,S.sv); np(); }; $('#ssv').oninput=e=>{ S.sv=e.target.value/100; Audio2.setVol(S.mv,S.sv); };
 $('#ssv').onchange=()=>{ sfx('coin'); save(); }; $('#smv').onchange=()=>save(); if($('#svb')) $('#svb').onchange=e=>{ S.vib=e.target.checked; vib(20); save(); };
 on('[data-a=update]',()=>checkUpdate());
 on('[data-a=reset]',()=>{ openModal('settings',{title:t('reset'),body:`<div class="set"><p>${t('resetq')}</p><div class="langs"><button class="btn r" data-a="y">${t('yes')}</button><button class="btn gr" data-a="n">${t('no')}</button></div></div>`},'mid');
  on('[data-a=y]',()=>{ localStorage.removeItem(SAVE_KEY); S=null; location.reload(); }); on('[data-a=n]',()=>draw()); }); };
 draw(); }
function setLang(l){ S.lang=l; document.documentElement.lang=l; document.documentElement.dir=l==='he'?'rtl':'ltr'; document.title=t('title'); buildNav(); buildHUD(); updHUD(); updSide(); $('#qtrack')._h=''; updQuest(); save(); }

// ---------- intro ----------
function showIntro(){ const el=$('#intro'); el.style.display='flex';
 const splash=()=>{ el.className='intro splash'; el.innerHTML=`<div class="sun"></div><img class="logo" src="icon-512.png"><h1>${t('title')}</h1>
  <div class="langs">${[['ru','RU'],['en','EN'],['he','HE']].map(([l,n])=>`<button class="btn ${S.lang===l?'y':'gr'}" data-l="${l}">${n}</button>`).join('')}</div><div class="tapgo">${t('tap')}</div>`;
  on('[data-l]',b=>{ S.lang=b.dataset.l; document.documentElement.dir=S.lang==='he'?'rtl':'ltr'; document.documentElement.lang=S.lang; sfx('tap'); splash(); },el);
  el.onclick=()=>{ Audio2.unlock(); Audio2.setVol(S.mv,S.sv); sfx('whoosh'); story(); }; };
 const story=()=>{ el.className='intro story'; el.onclick=null; el.innerHTML=`<div class="sbg" style="background-image:url(a/ui/intro.webp)"></div><div class="stxt"><p>${t('story1')}</p><p>${t('story2')}</p><button class="btn g big" id="sgo">${t('choose')} ➜</button></div>`;
  on('#sgo',()=>{ sfx('open'); pick(0); },el); };
 const pick=(i)=>{ const k=STARTERS[i], h=H(k); el.className='intro pick'; el.style.setProperty('--c',h.c);
  el.innerHTML=`<div class="pk"><button class="arr" data-d="-1">‹</button><div class="pkc"><img src="a/h/${k}.webp"><div class="pkn">${hname(k)}</div><div class="pkr">${t('ro_'+k)}</div>
   <div class="pkb">${RI[h.res]} +${h.base}% ${t('r_'+h.res)}${h.perk?' · '+t('p_'+h.perk,{v:h.pv}):''}</div></div><button class="arr" data-d="1">›</button></div>
   <div class="dots">${STARTERS.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join('')}</div><button class="btn g big" id="pgo">✓ ${t('choose')}: ${hname(k)}</button>`;
  on('.arr',b=>{ sfx('tap'); pick((i+ +b.dataset.d+STARTERS.length)%STARTERS.length); },el);
  let sx=null; el.ontouchstart=e=>{ sx=e.touches[0].clientX; }; el.ontouchend=e=>{ if(sx==null) return; const dx=e.changedTouches[0].clientX-sx; sx=null; if(Math.abs(dx)>50){ sfx('tap'); pick((i+(dx<0?1:-1)+STARTERS.length)%STARTERS.length); } };
  on('#pgo',()=>startGame(k),el); };
 splash(); }
function startGame(k){ S.leader=k; newHero(k); S.started=true; S.tfree=now(); S.gift=now()+600e3; S.chest=now(); S.tut=1;
 S.b.push({id:S.nid++,type:'hall',lvl:1,plot:0,t0:now(),bt:null,flip:false}); S.h[k].at=S.b[0].id;
 $('#intro').style.display='none'; $('#intro').innerHTML=''; sfx('done'); save(); enterGame(true);
 setTimeout(()=>tutor(t('tut1',{h:hname(k)}),()=>{ const fp=freePlot(); if(fp>=0){ const p=PLOTS[fp]; pointAtWorld(p[0],p[1]-40); } }),600); }
function tutor(msg,then){ const d=$('#tutor'); d.innerHTML=`<img src="${faceImg(S.leader)}"><div class="tb">${msg}<small>👆 OK</small></div>`; d.style.display='flex'; sfx('pop');
 d.onclick=e=>{ e.stopPropagation(); d.style.display='none'; sfx('tap'); if(then) then(); }; }
function enterGame(fresh){ document.documentElement.dir=S.lang==='he'?'rtl':'ltr'; document.documentElement.lang=S.lang; document.title=t('title');
 Audio2.era=eraOf(hallLvl()); dtEnsure(); buildHUD(); buildNav(); renderVillage(); updHUD(); updQuest(); updSide(); centerView(); musicFor(null); }
function afterEnterPopups(off){ const daily=()=>{ if(dailyReady()&&S.tut!==1) setTimeout(openDaily,300); };
 if(off){ const has=off.fin||off.ex||S.b.some(b=>!b.bt&&stored(b)>=1); if(has){ offlinePopup(off,daily); return; } } daily(); }

// ---------- boot ----------
function boot(){ S=load(); if(!S) S=newState((navigator.language||'ru').slice(0,2)==='he'?'he':(navigator.language||'').startsWith('en')?'en':'ru');
 Audio2.mv=S.mv; Audio2.sv=S.sv; initCam();
 $('#qtrack').onclick=e=>{ if(!e.target.closest('button')){ sfx('open'); openQuests(); } };
 if(S.started){ const off=offlineCatchup(); enterGame(); afterEnterPopups(off); } else showIntro();
 setInterval(tick,1000);
 const unlock=()=>{ Audio2.unlock(); Audio2.setVol(S.mv,S.sv); };
 document.addEventListener('touchend',unlock,{passive:true}); document.addEventListener('click',unlock);
 document.addEventListener('visibilitychange',()=>{ if(document.hidden){ save(); Audio2.suspend(); } else { Audio2.resume(); if(S.started){ const off=offlineCatchup(); renderVillage(); updHUD(); if(off&&!curModal) offlinePopup(off,null); } } });
 window.addEventListener('pagehide',save);
 document.addEventListener('gesturestart',e=>e.preventDefault()); document.addEventListener('dblclick',e=>e.preventDefault());
 if('serviceWorker' in navigator && location.protocol!=='file:') navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(reg=>{reg.update().catch(()=>{});document.addEventListener('visibilitychange',()=>{if(!document.hidden)reg.update().catch(()=>{});});}).catch(()=>{});
 window.__S=()=>S; }
window.addEventListener('DOMContentLoaded',boot);

async function checkUpdate(){
 const msg=(ru,en,he)=>S.lang==='ru'?ru:S.lang==='he'?he:en;
 if(!save()) return;
 const btn=document.querySelector('[data-a=update]'); if(btn)btn.disabled=true;
 let timer;
 try{
  if(!('serviceWorker' in navigator))throw Error('unsupported');
  toast(msg('Проверяю обновление…','Checking for updates…','בודק עדכון…'));
  await Promise.race([(async()=>{
   const reg=await navigator.serviceWorker.getRegistration(); if(!reg)throw Error('registration');
   await reg.update(); const worker=reg.installing||reg.waiting;
   if(worker&&worker.state!=='activated')await new Promise((resolve,reject)=>{const check=()=>{if(worker.state==='activated')resolve();else if(worker.state==='redundant')reject(Error('install'));};worker.addEventListener('statechange',check);check();});
  })(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('timeout')),12000);})]);
  location.reload();
 }catch(e){toast(msg('Обновление недоступно. Проверь интернет и попробуй ещё раз.','Update unavailable. Check your connection and retry.','העדכון אינו זמין. בדקו את החיבור ונסו שוב.'),'bad');}
 finally{clearTimeout(timer);if(btn)btn.disabled=false;}
}
